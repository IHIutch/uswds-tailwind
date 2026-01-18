import { defineConfig } from 'cva'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['card', 'card-lg', 'mobile', 'mobile-lg', 'tablet', 'tablet-lg', 'desktop', 'desktop-lg', 'widescreen'],
    },
  },
})

export const { cva, cx } = defineConfig({
  hooks: {
    onComplete: className => twMerge(className),
  },
})
