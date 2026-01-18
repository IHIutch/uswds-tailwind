import type { UseFieldProps } from './use-field'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useField } from './use-field'

export type FieldRootProps = React.HTMLProps<HTMLDivElement> & UseFieldProps

const FieldContext = React.createContext<ReturnType<typeof useField> | null>(null)

export function useFieldContext() {
  return React.useContext(FieldContext)
}

const FieldRoot = React.forwardRef<any, FieldRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const field = useField(props)

    return (
      <FieldContext.Provider value={field}>
        <div {...props} className={cx('max-w-mobile-lg', className)} ref={forwardedRef} />
      </FieldContext.Provider>
    )
  },
)

const FieldLabel = React.forwardRef<any, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, forwardedRef) => {
    const field = useFieldContext()
    const mergedProps = mergeProps(field?.getLabelProps(), props)

    return (
      <label
        {...mergedProps}
        className={cx('block mb-2', className)}
        ref={forwardedRef}
      />
    )
  },
)

const FieldDescription = React.forwardRef<any, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const field = useFieldContext()
    const mergedProps = mergeProps(field?.getDescriptionProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx('text-gray-500', className)}
        ref={forwardedRef}
      />
    )
  },
)

const FieldErrorMessage = React.forwardRef<any, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const field = useFieldContext()
    const mergedProps = mergeProps(field?.getErrorTextProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx('invalid:text-red-60v invalid:font-bold', className)}
        ref={forwardedRef}
      />
    )
  },
)

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  ErrorMessage: FieldErrorMessage,
}
