import type { IconifyJSON } from '@iconify/types'
import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import Fuse from 'fuse.js'

// Cache for all icons and Fuse instance to avoid repeated API calls and initialization
let iconCache: string[] = []
let fuseInstance: Fuse<{ id: string; humanName: string }> | null = null

async function initializeSearch(): Promise<{ icons: string[]; fuse: Fuse<{ id: string; humanName: string }> }> {
  if (iconCache && fuseInstance) {
    return { icons: iconCache, fuse: fuseInstance }
  }

  // Fetch icons if not cached
  if (!iconCache.length) {
    const collection = await fetch(`https://api.iconify.design/collection?prefix=material-symbols`)
    const collectionData = await collection.json() as { categories?: Record<string, string[]> }
    iconCache = collectionData.categories ? Object.values(collectionData.categories || {}).flat().sort() : []
  }

  // Initialize Fuse if not cached
  if (!fuseInstance) {
    const searchList = iconCache.map(name => ({
      id: name,
      humanName: name.replaceAll('-', ' ')
    }))

    fuseInstance = new Fuse(searchList, {
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      keys: ['id', 'humanName']
    })
  }

  return { icons: iconCache, fuse: fuseInstance }
}

export const server = {
  searchIcons: defineAction({
    input: z.object({
      query: z.string(),
    }),
    handler: async ({ query }) => {
      const trimmedQuery = query?.trim()
      const { icons, fuse } = await initializeSearch()

      let iconNames: string[]

      if (trimmedQuery) {
        // Use cached Fuse instance for fuzzy search
        const results = fuse.search(trimmedQuery, { limit: 150 })
        iconNames = results.map(result => result.item.id)
      } else {
        // Show first 150 icons alphabetically
        iconNames = icons.slice(0, 150)
      }

      if (!iconNames.length) return {
        filteredIcons: [],
        totalIconCount: iconCache.length
      }

      // Get SVGs for each icon
      // const filteredIcons = await Promise.all(
      //   iconNames.map(async (name: string) => {
      //     const svg = await fetch(`https://api.iconify.design/material-symbols:${name}.svg?height=unset`).then(r => r.text())
      //     return { name, svg }
      //   })
      // )

      const iconRes = await fetch(`https://api.iconify.design/material-symbols.json?icons=${iconNames.join(',')}`)
      const filteredIcons = await iconRes.json() as IconifyJSON

      return {
        filteredIcons: Object.entries(filteredIcons?.icons || {}).map(([key, value]) => ({ name: key, svg: value.body })),
        totalIconCount: iconCache.length
      }
    }
  })
}
