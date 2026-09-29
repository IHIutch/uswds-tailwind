import { tv } from 'tailwind-variants'

export const accordionThemes = [
  { value: 'styleless', label: 'Unstyled' },
  { value: 'uswds', label: 'USWDS' },
  { value: 'va', label: 'VA.gov' },
  { value: 'cms', label: 'CMS Core' },
] as const

export type AccordionTheme = typeof accordionThemes[number]['value']

// Use our accordion's utilities for USWDS and approximate the VA and CMS
// examples with the project's fonts, spacing scales, and custom colors.
export const accordionStyles = tv({
  slots: {
    root: '',
    trigger: 'group',
    icon: '',
    plus: 'group-aria-expanded:hidden',
    minus: 'hidden group-aria-expanded:block',
    panel: '',
  },
  variants: {
    styled: {
      true: {
        root: 'space-y-2 w-full max-w-160 font-source-sans text-base leading-normal text-[#1b1b1b]',
        trigger: 'relative m-0 block w-full cursor-pointer rounded-none border-0 bg-[#f0f0f0] py-4 pr-14 pl-5 text-left font-bold leading-tight text-inherit hover:bg-[#dfe1e2] focus:z-10 focus:outline-4 focus:outline-offset-0 focus:outline-blue-40v forced-colors:border-2 forced-colors:border-[ButtonText]',
        icon: 'absolute top-1/2 right-5 size-6 -translate-y-1/2 fill-current',
        panel: 'overflow-auto bg-white px-5 pt-4 pb-3 wrap-break-word',
      },
    },
    theme: {
      styleless: {
        // Undo preflight for the native HTML example, including inherited fonts.
        root: '[all:revert] [color:initial] [font:initial] [letter-spacing:normal] [text-align:initial]',
        trigger: '[all:revert]',
        icon: 'hidden',
        panel: '[all:revert]',
      },
      uswds: {
        root: 'text-black',
        trigger: 'flex items-center gap-3 bg-gray-5 px-5 leading-normal hover:bg-gray-10',
        icon: 'static ml-auto shrink-0 translate-y-0',
        panel: 'bg-transparent px-4 py-6',
      },
      va: {
        trigger: 'focus:outline-2 focus:outline-offset-2 focus:outline-[#face00]',
      },
      cms: {
        root: 'font-open-sans text-[#262626]',
        trigger: 'flex justify-between gap-4 bg-[#f2f2f2] px-6 py-4 leading-normal hover:bg-[#d9d9d9] focus:outline-3 focus:outline-offset-3 focus:outline-transparent focus:shadow-[0_0_0_3px_#fff,0_0_4px_6px_#bd13b8] forced-colors:focus:outline-4 forced-colors:focus:-outline-offset-4 forced-colors:focus:outline-[LinkText] forced-colors:focus:shadow-none',
        icon: 'static size-5 shrink-0 translate-y-0',
        panel: 'border-4 border-t-0 border-[#f2f2f2] p-4',
      },
    },
  },
})
