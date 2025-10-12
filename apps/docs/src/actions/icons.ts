import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

export const searchIcons = defineAction({
  input: z.object({
    query: z.string(),
    limit: z.number().optional().default(150)
  }),
  handler: async ({ query, limit }) => {
    const searchQuery = query.trim() || 'home'
    const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&prefix=material-symbols&limit=${limit}`

    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json() as { icons?: string[] }

    if (!searchData.icons) return []

    const iconPromises = searchData.icons.map(async (iconName: string) => {
      const name = iconName.replace('material-symbols:', '')
      const svgResponse = await fetch(`https://api.iconify.design/${iconName}.svg?height=100%`)
      const svg = await svgResponse.text()
      return { name, svg }
    })

    return Promise.all(iconPromises)
  }
})
