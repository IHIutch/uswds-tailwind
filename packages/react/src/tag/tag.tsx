import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { tv } from '../tv.config'

export const tagVariants = tv({
  base: 'bg-gray-60 text-white rounded-xs py-px px-2 uppercase',
  variants: {
    size: {
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TagProps = React.ComponentPropsWithoutRef<'span'> & VariantProps<typeof tagVariants>

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, size, ...props }, forwardedRef) => {
    return (
      <span
        {...props}
        className={tagVariants({ size, className })}
        ref={forwardedRef}
      />
    )
  },
)

Tag.displayName = 'Tag'
