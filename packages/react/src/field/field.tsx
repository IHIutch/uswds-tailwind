import type { UseFieldProps } from './use-field'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { composeRefs } from '../utils/compose-refs'
import { useField } from './use-field'

export type FieldRootProps = React.HTMLProps<HTMLDivElement> & UseFieldProps

const FieldContext = React.createContext<ReturnType<typeof useField> | null>(null)

export function useFieldContext() {
  return React.useContext(FieldContext)
}

const FieldRoot = React.forwardRef<any, FieldRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const field = useField(props)
    const mergedProps = mergeProps(field.getRootProps(), props)

    return (
      <FieldContext.Provider value={field}>
        <div
          {...mergedProps}
          className={cx(
            'invalid:pl-4 invalid:-ml-5 invalid:border-red-60v invalid:border-l-4',
            className,
          )}
          ref={composeRefs(field.refs.rootRef, forwardedRef)}
        />
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
        className={cx('block invalid:font-bold', className)}
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

    return field?.invalid
      ? (
          <div
            {...mergedProps}
            className={cx('mt-0.5 invalid:text-red-60v invalid:font-bold', className)}
            ref={forwardedRef}
          />
        )
      : null
  },
)

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  ErrorMessage: FieldErrorMessage,
}
