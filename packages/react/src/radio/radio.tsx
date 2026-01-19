import type { VariantProps } from 'cva'
import type { GroupItemProps, UseRadioGroupProps } from './use-radio-group'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cva, cx } from '../cva.config'
import { useRadioGroup } from './use-radio-group'

const radioItemVariant = cva({
  base: 'flex',
  variants: {
    tile: {
      true: 'relative z-0 px-3 py-4',
    },
  },
})

const radioLabelVariant = cva({
  base: 'pl-3 cursor-pointer block peer-disabled:text-gray-60 peer-disabled:cursor-not-allowed ',
  variants: {
    tile: {
      true: 'pl-3 cursor-pointer block peer-disabled:text-gray-60 peer-disabled:cursor-not-allowed before:absolute before:-z-10 before:inset-0 before:bg-white before:border-2 before:border-gray-20 before:rounded peer-checked:before:border-blue-60v peer-checked:before:bg-blue-60v/10 peer-disabled:before:border-gray-10 peer-disabled:before:bg-white',
      false: '',
    },
  },
})

export type RadioRootProps = React.HTMLAttributes<HTMLDivElement> & UseRadioGroupProps & VariantProps<typeof radioItemVariant>
export type RadioItemProps = React.LabelHTMLAttributes<HTMLLabelElement> & GroupItemProps
export type RadioLabelProps = React.HTMLAttributes<HTMLDivElement>
export type RadioInputProps = React.InputHTMLAttributes<HTMLInputElement>
export type RadioControlProps = React.InputHTMLAttributes<HTMLInputElement>

export type RadioContextProps = ReturnType<typeof useRadioGroup> & VariantProps<typeof radioItemVariant>

const RadioGroupContext = React.createContext<RadioContextProps | null>(null)

export function useRadioGroupContext() {
  return React.useContext(RadioGroupContext)
}

const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioRootProps>(
  ({ className, tile, ...props }, forwardedRef) => {
    const radioGroup = useRadioGroup({
      defaultValue: props.defaultValue,
      value: props.value,
      disabled: props.disabled,
      readOnly: props.readOnly,
      invalid: props.invalid,
      ids: props.ids,
      id: props.id,
      name: props.name,
    })
    const mergedProps = mergeProps(radioGroup.getRootProps(), props)

    return (
      <RadioGroupContext.Provider value={{
        ...radioGroup,
        tile,
      }}
      >
        <div
          {...mergedProps}
          className={cx(
            'space-y-2',
            className,
          )}
          ref={forwardedRef}
        />
      </RadioGroupContext.Provider>
    )
  },
)

export interface RadioGroupItemContextProps {
  value: string
}

const RadioGroupItemContext = React.createContext<RadioGroupItemContextProps | null>(null)

function useRadioGroupItemContext() {
  const context = React.useContext(RadioGroupItemContext)

  if (!context) {
    throw new Error('RadioGroupItem components must be used within a RadioGroup.Item')
  }
  return context
}

const RadioGroupItem = React.forwardRef<HTMLLabelElement, RadioItemProps & RadioGroupItemContextProps>(
  ({ className, value, ...props }, forwardedRef) => {
    const radio = useRadioGroupContext()
    const mergedProps = mergeProps(radio?.getItemProps({
      value,
      disabled: props.disabled,
      invalid: props.invalid,
    }), props)

    return (
      <RadioGroupItemContext.Provider value={{ value }}>
        <label
          {...mergedProps}
          className={cx(
            radioItemVariant({
              tile: radio?.tile,
              className,
            }),
          )}
          ref={forwardedRef}
        />
      </RadioGroupItemContext.Provider>
    )
  },
)

const RadioGroupItemLabel = React.forwardRef<HTMLDivElement, RadioLabelProps>(
  ({ className, ...props }, forwardedRef) => {
    const radio = useRadioGroupContext()
    const radioItem = useRadioGroupItemContext()
    const mergedProps = mergeProps(radio?.getLabelProps(radioItem), props)

    return (
      <div
        {...mergedProps}
        className={cx(
          radioLabelVariant({
            tile: radio?.tile,
          }),
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

const RadioGroupItemInput = React.forwardRef<HTMLInputElement, RadioInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const radio = useRadioGroupContext()
    const radioItem = useRadioGroupItemContext()
    const mergedProps = mergeProps(radio?.getInputProps(radioItem), props)

    return (
      <input
        {...mergedProps}
        className={cx('sr-only peer', className)}
        ref={forwardedRef}
      />
    )
  },
)

const RadioGroupItemControl = React.forwardRef<HTMLInputElement, RadioControlProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const radio = useRadioGroupContext()
    const radioItem = useRadioGroupItemContext()
    const mergedProps = mergeProps(radio?.getControlProps(radioItem), props)

    return (
      <div
        {...mergedProps}
        className={cx(
          'flex items-center justify-center top-0.5 shrink-0 relative cursor-pointer text-blue-60v border-none size-5 rounded-full ring-2 ring-offset-0 ring-gray-90 peer-focus:ring-2 peer-focus:ring-offset-0 peer-focus:ring-gray-90 peer-focus:outline-4 peer-focus:outline-offset-4 peer-focus:outline-blue-40v peer-disabled:ring-gray-50 peer-disabled:cursor-not-allowed peer-disabled:peer-checked:text-gray-50 peer-checked:ring-blue-60v peer-focus:peer-checked:ring-blue-60v before:size-4 before:block before:rounded-full peer-checked:before:bg-blue-60v peer-checked:peer-disabled:before:bg-gray-50',
          className,
        )}
        ref={forwardedRef}
      >
      </div>
    )
  },
)

const RadioGroupItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        {...props}
        className={cx('block mt-1 text-sm', className)}
        ref={forwardedRef}
      />
    )
  },
)

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
  ItemLabel: RadioGroupItemLabel,
  ItemInput: RadioGroupItemInput,
  ItemControl: RadioGroupItemControl,
  ItemDescription: RadioGroupItemDescription,
}
