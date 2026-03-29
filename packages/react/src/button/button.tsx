import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

export const buttonVariants = cva({
  base: [
    'leading-none focus:outline-4 focus:outline-offset-4 focus:outline-blue-40v cursor-pointer flex items-center',
    // Disabled
    'disabled:bg-gray-20 disabled:text-gray-70 disabled:cursor-not-allowed',
  ],
  variants: {
    variant: {
      blue: 'text-white bg-blue-60v hover:bg-blue-warm-70v active:bg-blue-warm-80v border-blue-warm-70v',
      red: 'text-white bg-red-50 hover:bg-red-60v active:bg-red-70v border-red-60v',
      cyan: 'text-gray-90 bg-cyan-30v hover:bg-blue-cool-40v active:bg-blue-cool-60v active:text-white border-blue-cool-40v',
      orange: 'text-gray-90 bg-orange-30v hover:bg-orange-50v hover:text-white active:bg-orange-60 active:text-white border-orange-50v',
      gray: 'text-white bg-gray-50 hover:bg-gray-60 active:bg-gray-80 border-gray-60',
      outline: 'text-blue-60v bg-transparent ring-inset ring-2 ring-blue-60v hover:ring-blue-warm-70v hover:text-blue-warm-70v active:ring-blue-warm-80v active:text-blue-warm-80v',
      inverse: 'text-gray-10 bg-transparent ring-inset ring-2 ring-gray-10 hover:ring-gray-5 hover:text-gray-5 active:ring-white active:text-white',
    },
    unstyled: {
      true: 'underline ring-0 text-blue-60v bg-transparent hover:bg-transparent active:bg-transparent disabled:bg-transparent disabled:text-gray-40 hover:text-blue-warm-70v active:text-blue-warm-80v',
    },
    size: {
      lg: 'px-6 py-4 text-xl',
      md: 'px-5 py-3',
      unset: null,
    },
  },
  defaultVariants: {
    variant: 'blue',
    size: 'md',
    unstyled: false,
  },
  compoundVariants: [
    {
      unstyled: false,
      className: 'font-bold rounded-sm',
    },
    {
      variant: ['blue', 'red', 'cyan', 'orange', 'gray', 'outline'],
      unstyled: true,
      className: 'text-blue-60v hover:text-blue-warm-70v active:text-blue-warm-80v ',
    },
    {
      variant: ['inverse'],
      unstyled: true,
      className: 'text-gray-10 hover:text-gray-5 active:text-white ',
    },
  ],
})

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, unstyled, ...props }, forwardedRef) => {
    return (
      <button
        {...props}
        className={cx(
          buttonVariants({
            variant,
            size: unstyled ? 'unset' : size,
            unstyled,
            className,
          }),
        )}
        ref={forwardedRef}
      />
    )
  },
)
