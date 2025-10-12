import type { IconSuffix } from "types";
// import { icons as materialIcons } from "@iconify-json/material-symbols";
// import Fuse from "fuse.js";
// import { getIcons as getIconifyIcons, type IconifyIcon } from "@iconify/utils";
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

// const suffixes: Record<IconSuffix, string> = {
//   'outline-rounded': 'Outline Rounded',
//   'outline-sharp': 'Outline Sharp',
//   'outline': 'Outline',
//   'rounded': 'Rounded',
//   'sharp': 'Sharp',
//   '': "Filled",
// };

// const groupedIconList = Object.entries(materialIcons.icons).reduce((acc, [iconName, iconData]) => {
//   const matchedSuffix = (Object.keys(suffixes) as IconSuffix[]).find(suffix => iconName.endsWith(suffix)) || '';

//   if (!acc[matchedSuffix]) acc[matchedSuffix] = {}; // Initialize the object if it doesn't exist

//   acc[matchedSuffix][iconName] = iconData;
//   return acc;
// }, {} as Record<IconSuffix, Record<string, IconifyIcon | null>>);

// function getIconNamesBySuffix(suffix?: IconSuffix): string[] {
//   const iconsBySuffix = suffix
//     ? Object.keys(groupedIconList[suffix])
//     : Object.keys({
//       ...groupedIconList['sharp'],
//       ...groupedIconList['outline-sharp'],
//       ...groupedIconList['']
//     })

//   return iconsBySuffix
// }

// const iconList = getIconNamesBySuffix()
// const iconSearchList = iconList.map(i => ({
//   id: i,
//   humanName: i.replaceAll('-', ' ')
// }))

// const fuse = new Fuse(iconSearchList, {
//   threshold: 0.2,
//   distance: 100,
//   ignoreLocation: true,
//   keys: [
//     "humanName"
//   ]
// });

// "https://api.iconify.design/collection?prefix=material-symbols"
// "/keywords?prefix=hom&pretty=1"

const SEARCH_LIMIT = 150

export const server = {
  searchIcons: defineAction({
    accept: "form",
    input: z.object({
      query: z.string(),
    }),
    handler: async ({ query }) => {
      const searchQuery = query.trim()
      const searchUrl = new URL('https://api.iconify.design/search')
      searchUrl.searchParams.set('query', searchQuery)
      searchUrl.searchParams.set('prefix', 'material-symbols')
      searchUrl.searchParams.set('limit', SEARCH_LIMIT.toString())

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
}
