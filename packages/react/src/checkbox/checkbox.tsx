import type { VariantProps } from 'cva'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cva, cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { useCheckbox } from './use-checkbox'

export type CheckboxRootProps = React.ComponentPropsWithoutRef<'label'>
export type CheckboxGroupProps = React.ComponentPropsWithoutRef<'div'>
export type CheckboxLabelProps = React.ComponentPropsWithoutRef<'div'>
export type CheckboxInputProps = React.ComponentPropsWithoutRef<'input'>
export type CheckboxControlProps = React.ComponentPropsWithoutRef<'input'>

export type CheckboxContextProps = ReturnType<typeof useCheckbox> & {
  tile?: boolean
}

const CheckboxContext = React.createContext<CheckboxContextProps | null>(null)

export function useCheckboxContext() {
  return React.useContext(CheckboxContext)
}

const checkboxRootVariant = cva({
  base: 'flex',
  variants: {
    tile: {
      true: 'relative z-0 px-3 py-4',
    },
  },
})

const CheckboxRoot = React.forwardRef<HTMLLabelElement, CheckboxRootProps & VariantProps<typeof checkboxRootVariant>>(
  ({ className, id, tile, ...props }, forwardedRef) => {
    const checkbox = useCheckbox()
    const mergedProps = mergeProps(checkbox.getRootProps(), props)

    return (
      <CheckboxContext.Provider value={{
        ...checkbox,
        tile,
      }}
      >
        <label
          {...mergedProps}
          className={cx(
            checkboxRootVariant({
              tile,
              className,
            }),
          )}
          ref={forwardedRef}
        />
      </CheckboxContext.Provider>
    )
  },
)

function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return (
    <div
      {...props}
      className={cx(
        'space-y-2',
        className,
      )}
    />
  )
}

const checkboxLabelVariant = cva({
  base: 'pl-3 cursor-pointer block peer-disabled:text-gray-60 peer-disabled:cursor-not-allowed ',
  variants: {
    tile: {
      true: 'before:absolute before:-z-10 before:inset-0 before:bg-white before:border-2 before:border-gray-20 before:rounded peer-checked:before:border-blue-60v peer-checked:before:bg-blue-60v/10 peer-disabled:before:border-gray-10 peer-disabled:before:bg-white',
      false: '',
    },
  },
})

function CheckboxLabel({ className, ...props }: CheckboxLabelProps) {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(checkbox?.getLabelProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx(
        checkboxLabelVariant({
          tile: checkbox?.tile,
        }),
        className,
      )}
    />
  )
}

const CheckboxInput = React.forwardRef<HTMLInputElement, CheckboxInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const checkbox = useCheckboxContext()
    const field = useFieldContext()
    const mergedProps = mergeProps(checkbox?.getInputProps(), field?.getInputProps(), props)

    return (
      <input
        {...mergedProps}
        className={cx('sr-only peer', className)}
        ref={forwardedRef}
      />
    )
  },
)

const CheckboxControl = React.forwardRef<HTMLInputElement, CheckboxControlProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const checkbox = useCheckboxContext()
    const mergedProps = mergeProps(checkbox?.getControlProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx(
          'flex items-center justify-center top-0.5 relative shrink-0 cursor-pointer text-transparent peer-checked:text-white border-none size-5 rounded-sm ring-2 ring-offset-0 ring-gray-90 peer-focus:ring-2 peer-focus:ring-offset-0 peer-focus:ring-gray-90 peer-focus:outline-4 peer-focus:outline-offset-4 peer-focus:outline-blue-40v peer-disabled:ring-gray-50 peer-disabled:cursor-not-allowed peer-checked:ring-blue-60v peer-checked:bg-blue-60v peer-disabled:peer-checked:bg-gray-50 peer-focus:peer-checked:ring-blue-60v',
          className,
        )}
        ref={forwardedRef}
      >
        {children ?? (
          <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="65" height="50" viewBox="0 0 65 50">
            <path fill="currentColor" fillRule="evenodd" d="M63.268 7.063l-5.616-5.61C56.882.685 55.946.3 54.845.3s-2.038.385-2.808 1.155L24.951 28.552 12.81 16.385c-.77-.77-1.707-1.155-2.808-1.155-1.1 0-2.037.385-2.807 1.154l-5.616 5.61C.81 22.764.425 23.7.425 24.8s.385 2.035 1.155 2.805l14.947 14.93 5.616 5.61c.77.77 1.706 1.154 2.807 1.154s2.038-.384 2.808-1.154l5.616-5.61 29.894-29.86c.77-.77 1.157-1.707 1.157-2.805 0-1.101-.385-2.036-1.156-2.805l-.001-.002z" />
          </svg>
        )}
      </div>
    )
  },
)

function CheckboxDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx('block mt-1 text-sm', className)}
    />
  )
}

CheckboxRoot.displayName = 'Checkbox.Root'
CheckboxGroup.displayName = 'Checkbox.Group'
CheckboxLabel.displayName = 'Checkbox.Label'
CheckboxInput.displayName = 'Checkbox.Input'
CheckboxControl.displayName = 'Checkbox.Control'
CheckboxDescription.displayName = 'Checkbox.Description'

export const Checkbox = {
  Root: CheckboxRoot,
  Group: CheckboxGroup,
  Label: CheckboxLabel,
  Input: CheckboxInput,
  Control: CheckboxControl,
  Description: CheckboxDescription,
}
