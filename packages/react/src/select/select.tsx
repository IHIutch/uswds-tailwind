import type { UseSelectProps } from './use-select'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { useSelect } from './use-select'

export type SelectContextProps = ReturnType<typeof useSelect>

const SelectContext = React.createContext<SelectContextProps | null>(null)

export function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('Select components must be used within a Select.Root')
  }
  return context
}

// ============================================================================
// Types
// ============================================================================

export type SelectRootProps = React.ComponentPropsWithoutRef<'div'> & UseSelectProps
export type SelectProps = React.ComponentPropsWithoutRef<'select'>
export type SelectIconProps = React.ComponentPropsWithoutRef<'div'>

// ============================================================================
// Components
// ============================================================================

const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, className, ...props }, forwardedRef) => {
    const select = useSelect(props)
    return (
      <SelectContext.Provider value={select}>
        <div
          {...select.getRootProps()}
          className={cx(
            'relative flex items-center mt-2',
            className,
          )}
          ref={forwardedRef}
        >
          {children}
        </div>
      </SelectContext.Provider>
    )
  },
)

const SelectField = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, forwardedRef) => {
    const select = useSelectContext()
    const field = useFieldContext()
    const mergedProps = mergeProps(select.getFieldProps(), field?.getSelectProps(), props)

    return (
      <select
        {...mergedProps}
        className={cx('peer appearance-none p-2 w-full h-10 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v invalid:border-red-60v invalid:border-4 invalid:py-1 valid:border-green-cool-40v valid:border-4 valid:py-1 disabled:text-gray-70 disabled:cursor-not-allowed disabled:bg-gray-20', className)}
        ref={forwardedRef}
      />
    )
  },
)

const SelectIcon = React.forwardRef<HTMLDivElement, SelectIconProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const select = useSelectContext()
    const mergedProps = mergeProps(select.getIconProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx('select-none pointer-events-none h-full absolute right-0 whitespace-nowrap px-2 flex items-center text-gray-90 peer-disabled:text-gray-70', className)}
        ref={forwardedRef}
      >
        {children || (
          <div className="icon-[material-symbols--unfold-more] size-5" />
        )}
      </div>
    )
  },
)

// ============================================================================
// Compound Component Export
// ============================================================================

SelectRoot.displayName = 'Select.Root'
SelectField.displayName = 'Select.Field'
SelectIcon.displayName = 'Select.Icon'

export const Select = {
  Root: SelectRoot,
  Field: SelectField,
  Icon: SelectIcon,
}
