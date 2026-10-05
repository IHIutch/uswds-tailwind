import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { tv } from '../tv.config'

export const tagVariants = tv({
  base: 'rounded-xs py-px px-2 uppercase',
  variants: {
    variant: {
      'default': 'bg-gray-60 text-white',
      'vivid-orange': 'bg-orange-50v text-white',
      'light-gray': 'bg-gray-10 text-ink',
    },
    size: {
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export type TagProps = React.ComponentPropsWithoutRef<'span'> & VariantProps<typeof tagVariants>

export function Tag({ className, size, variant, ...props }: TagProps) {
  return (
    <span
      {...props}
      className={tagVariants({ size, variant, className })}
    />
  )
}
