import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { tv } from '../tv.config'

export const linkVariants = tv({
  base: 'focus:outline-4 focus:outline-blue-40v underline',
  variants: {
    variant: {
      light: 'text-gray-10 visited:text-gray-10 hover:text-gray-5',
      blue: 'text-blue-60v visited:text-violet-70v hover:text-blue-70v ',
    },
    isExternal: {
      true: 'after:icon-[material-symbols--open-in-new] after:size-4 after:align-middle after:ml-px',
    },
  },
  defaultVariants: {
    variant: 'blue',
    isExternal: false,
  },
})

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof linkVariants>

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, isExternal, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={linkVariants({
          isExternal,
          variant,
          className,
        })}
        ref={forwardedRef}
      />
    )
  },
)

Link.displayName = 'Link'
