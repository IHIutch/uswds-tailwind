import * as React from 'react'
import { cx } from '../cva.config'
import { useInputGroupContext } from '../input-group/input-group'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Input = React.forwardRef<any, InputProps>(
  ({ className, ...props }, ref) => {
    const ctx = useInputGroupContext()

    return (
      <input
        ref={ref}
        {...props}
        className={cx(
          'p-2 w-full max-w-mobile-lg h-10 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v invalid:border-red-60v invalid:border-4 invalid:py-1 valid:border-green-cool-40v valid:border-4 valid:py-1',
          ctx?.hasStartElement ? 'pl-10' : '',
          ctx?.hasEndElement ? 'pr-10' : '',
          className,
        )}
      />
    )
  },
)

export const Textarea = React.forwardRef<any, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={cx(
          'p-2 w-full max-w-mobile-lg h-40 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v invalid:border-red-60v invalid:border-4 invalid:py-1 valid:border-green-cool-40v valid:border-4 valid:py-1',
          className,
        )}
      />
    )
  },
)
