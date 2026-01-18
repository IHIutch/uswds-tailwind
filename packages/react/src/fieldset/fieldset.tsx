import type { UseFieldsetProps } from './use-fieldset'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldset } from './use-fieldset'

export type FieldsetRootProps = React.HTMLProps<HTMLFieldSetElement> & UseFieldsetProps

const FieldsetContext = React.createContext<ReturnType<typeof useFieldset> | null>(null)

export function useFieldsetContext() {
  return React.useContext(FieldsetContext)
}

const FieldsetRoot = React.forwardRef<any, FieldsetRootProps>(
  (props, forwardedRef) => {
    const fieldset = useFieldset(props)

    return (
      <FieldsetContext.Provider value={fieldset}>
        <fieldset
          {...props}
          ref={forwardedRef}
        />
      </FieldsetContext.Provider>
    )
  },
)

const FieldsetLegend = React.forwardRef<any, React.HTMLAttributes<HTMLLegendElement>>(
  ({ className, ...props }, forwardedRef) => {
    const fieldset = useFieldsetContext()
    const mergedProps = mergeProps(fieldset?.getLegendProps(), props)

    return (
      <legend
        {...mergedProps}
        className={cx('leading-snug max-w-mobile-lg mb-3', className)}
        ref={forwardedRef}
      />
    )
  },
)

const FieldsetDescription = React.forwardRef<any, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const fieldset = useFieldsetContext()
    const mergedProps = mergeProps(fieldset?.getDescriptionProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx('text-gray-500', className)}
        ref={forwardedRef}
      />
    )
  },
)

const FieldsetErrorMessage = React.forwardRef<any, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const fieldset = useFieldsetContext()
    const mergedProps = mergeProps(fieldset?.getErrorTextProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx('invalid:text-red-60v invalid:font-bold', className)}
        ref={forwardedRef}
      />
    )
  },
)

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
  ErrorMessage: FieldsetErrorMessage,
}
