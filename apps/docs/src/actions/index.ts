import type { IconSuffix } from "types";
import { icons as materialIcons } from "@iconify-json/material-symbols";
import Fuse from "fuse.js";
import { getIcons, type IconifyIcon } from "@iconify/utils";
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  getIcons: defineAction({
    accept: "form",
    input: z.object({
      search: z.string().nullable(),
    }),
    handler: async ({ search }) => {
      const SEARCH_LIMIT = 150

      const suffixes: Record<IconSuffix, string> = {
        'outline-rounded': 'Outline Rounded',
        'outline-sharp': 'Outline Sharp',
        'outline': 'Outline',
        'rounded': 'Rounded',
        'sharp': 'Sharp',
        '': "Filled",
      };

      const testList = Object.entries(materialIcons.icons).reduce((acc, [iconName, iconData]) => {
        const matchedSuffix = (Object.keys(suffixes) as IconSuffix[]).find(suffix => iconName.endsWith(suffix)) || '';

        if (!acc[matchedSuffix]) acc[matchedSuffix] = {}; // Initialize the object if it doesn't exist

        acc[matchedSuffix][iconName] = iconData;
        return acc;
      }, {} as Record<IconSuffix, Record<string, IconifyIcon | null>>);

      function getIconNamesBySuffix(suffix?: IconSuffix): string[] {
        const iconsBySuffix = suffix
          ? Object.keys(testList[suffix])
          : Object.keys({
            ...testList['sharp'],
            ...testList['outline-sharp'],
            ...testList['']
          })

        return iconsBySuffix
      }

      const iconList = getIconNamesBySuffix()
      const fuse = new Fuse(iconList, {
        threshold: 0.25,
        distance: 10,
        ignoreLocation: true,
      });

      const searchResults = fuse.search(search || '', {
        limit: SEARCH_LIMIT
      })

      const filteredIconsJson = getIcons(materialIcons, search
        ? searchResults.map(i => i.item)
        : iconList.slice(0, SEARCH_LIMIT)
      );

      return {
        filteredIcons: Object.keys(filteredIconsJson?.icons || {}).sort((a, b) => a.localeCompare(b)),
        totalIconCount: iconList.length
      }
    }
  })
}
