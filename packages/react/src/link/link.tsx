import * as React from 'react'
import { cva, cx } from '../cva.config'

export const linkVariants = cva({
  base: 'text-blue-60v visited:text-violet-70v hover:text-blue-70v focus:outline-4 focus:outline-blue-40v underline',
  variants: {
    external: {
      true: 'after:icon-[material-symbols--open-in-new] after:size-4 after:align-middle after:ml-px',
    },
  },
  defaultVariants: {
    external: false,
  },
})

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isExternal?: boolean
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, isExternal, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx(
          linkVariants({
            external: isExternal,
          }),
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

Link.displayName = 'Link'
