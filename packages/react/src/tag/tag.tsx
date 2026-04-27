import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

export const tagVariants = cva({
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

export function Tag({ className, size, ...props }: TagProps) {
  return (
    <span
      {...props}
      className={cx(tagVariants({ size, className }))}
    />
  )
}
