import type { CnOptions } from 'tailwind-variants'
import { cnMerge, createTV } from 'tailwind-variants'

export type { VariantProps } from 'tailwind-variants'

const twMergeConfig = {
  extend: {
    theme: {
      spacing: ['card', 'card-lg', 'mobile', 'mobile-lg', 'tablet', 'tablet-lg', 'desktop', 'desktop-lg', 'widescreen'],
    },
  },
}

export const tv = createTV({ twMergeConfig })
export const cn = <T extends CnOptions>(...classes: T) => cnMerge(classes)({ twMergeConfig })
