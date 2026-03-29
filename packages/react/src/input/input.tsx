import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { useInputGroupContext } from '../input-group/input-group'

export type InputProps = React.ComponentPropsWithoutRef<'input'>
export type TextareaProps = React.ComponentPropsWithoutRef<'textarea'>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const inputGroup = useInputGroupContext()
    const field = useFieldContext()

    const mergedProps = mergeProps(field?.getInputProps(), props)

    return (
      <input
        {...mergedProps}
        className={cx(
          'mt-2 p-2 w-full h-10 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v invalid:border-red-60v invalid:border-4 invalid:py-1 valid:border-green-cool-40v valid:border-4 valid:py-1',
          inputGroup?.hasStartElement ? 'pl-10' : '',
          inputGroup?.hasEndElement ? 'pr-10' : '',
          className,
        )}
        ref={ref}
      />
    )
  },
)

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const field = useFieldContext()
    const mergedProps = mergeProps(field?.getTextareaProps(), props)

    return (
      <textarea
        {...mergedProps}
        className={cx(
          'p-2 w-full max-w-mobile-lg h-40 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v invalid:border-red-60v invalid:border-4 invalid:py-1 valid:border-green-cool-40v valid:border-4 valid:py-1',
          className,
        )}
        ref={ref}
      />
    )
  },
)
