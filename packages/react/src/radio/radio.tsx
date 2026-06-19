import type { VariantProps } from '../tv.config'
import type { GroupItemProps, UseRadioGroupProps } from './use-radio-group'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { cn, tv } from '../tv.config'
import { composeRefs } from '../utils/compose-refs'
import { useRadioGroup } from './use-radio-group'

// ============================================================================
// Types
// ============================================================================

export type RadioRootProps = React.ComponentPropsWithoutRef<'div'> & UseRadioGroupProps & VariantProps<typeof radioVariants>
export type RadioItemProps = React.ComponentPropsWithoutRef<'label'> & GroupItemProps
export type RadioLabelProps = React.ComponentPropsWithoutRef<'div'>
export type RadioInputProps = React.ComponentPropsWithoutRef<'input'>
export type RadioControlProps = React.ComponentPropsWithoutRef<'input'>
export type RadioDescriptionProps = React.ComponentPropsWithoutRef<'div'>

export type RadioContextProps = ReturnType<typeof useRadioGroup> & VariantProps<typeof radioVariants>

export interface RadioGroupItemContextProps {
  value: string
}

// ============================================================================
// Variants (CVA)
// ============================================================================

const radioVariants = tv({
  slots: {
    item: 'flex',
    label: 'pl-3 cursor-pointer block peer-disabled:text-gray-60 peer-disabled:cursor-not-allowed',
  },
  variants: {
    tile: {
      true: {
        item: 'relative z-0 px-3 py-4',
        label: 'pl-3 cursor-pointer block peer-disabled:text-gray-60 peer-disabled:cursor-not-allowed before:absolute before:-z-10 before:inset-0 before:bg-white before:border-2 before:border-gray-20 before:rounded peer-checked:before:border-blue-60v peer-checked:before:bg-blue-60v/10 peer-disabled:before:border-gray-10 peer-disabled:before:bg-white',
      },
      false: '',
    },
  },
})

// ============================================================================
// Context & Hooks
// ============================================================================

const RadioGroupContext = React.createContext<RadioContextProps | null>(null)
const RadioGroupItemContext = React.createContext<RadioGroupItemContextProps | null>(null)

export function useRadioGroupContext() {
  return React.useContext(RadioGroupContext)
}

function useRadioGroupItemContext() {
  const context = React.useContext(RadioGroupItemContext)
  if (!context) {
    throw new Error('RadioGroupItem components must be used within a RadioGroup.Item')
  }
  return context
}

// ============================================================================
// Components
// ============================================================================

const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioRootProps>(
  ({ className, tile, ...props }, forwardedRef) => {
    const radioGroup = useRadioGroup(props)
    const mergedProps = mergeProps(radioGroup.getRootProps(), props)

    return (
      <RadioGroupContext.Provider value={{ ...radioGroup, tile }}>
        <div
          {...mergedProps}
          className={cn('space-y-2', className)}
          ref={composeRefs(radioGroup.refs.rootRef, forwardedRef)}
        />
      </RadioGroupContext.Provider>
    )
  },
)

const RadioGroupItem = React.forwardRef<HTMLLabelElement, RadioItemProps & RadioGroupItemContextProps>(
  ({ className, value, ...props }, forwardedRef) => {
    const radio = useRadioGroupContext()
    const mergedProps = mergeProps(radio?.getItemProps({ value }), props)
    const { item } = radioVariants({ tile: radio?.tile })

    return (
      <RadioGroupItemContext.Provider value={{ value }}>
        <label
          {...mergedProps}
          className={item({ className })}
          ref={forwardedRef}
        />
      </RadioGroupItemContext.Provider>
    )
  },
)

const RadioGroupItemInput = React.forwardRef<HTMLInputElement, RadioInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const radio = useRadioGroupContext()
    const radioItem = useRadioGroupItemContext()
    const field = useFieldContext()
    const mergedProps = mergeProps(radio?.getInputProps(radioItem), field?.getInputProps(), props)

    return (
      <input
        {...mergedProps}
        className={cn('sr-only peer', className)}
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
        className={cn(
          'flex items-center justify-center top-0.5 shrink-0 relative cursor-pointer text-blue-60v border-none size-5 rounded-full ring-2 ring-offset-0 ring-gray-90 peer-focus:ring-2 peer-focus:ring-offset-0 peer-focus:ring-gray-90 peer-focus:outline-4 peer-focus:outline-offset-4 peer-focus:outline-blue-40v peer-disabled:ring-gray-50 peer-disabled:cursor-not-allowed peer-disabled:peer-checked:text-gray-50 peer-checked:ring-blue-60v peer-focus:peer-checked:ring-blue-60v before:size-4 before:block before:rounded-full peer-checked:before:bg-blue-60v peer-checked:peer-disabled:before:bg-gray-50',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

function RadioGroupItemLabel({ className, ...props }: RadioLabelProps) {
  const radio = useRadioGroupContext()
  const radioItem = useRadioGroupItemContext()
  const mergedProps = mergeProps(radio?.getLabelProps(radioItem), props)
  const { label } = radioVariants({ tile: radio?.tile })

  return (
    <div
      {...mergedProps}
      className={label({ className })}
    />
  )
}

function RadioGroupItemDescription({ className, ...props }: RadioDescriptionProps) {
  return (
    <div
      {...props}
      className={cn('block mt-1 text-sm', className)}
    />
  )
}

// ============================================================================
// Exports
// ============================================================================

RadioGroupRoot.displayName = 'RadioGroup.Root'
RadioGroupItem.displayName = 'RadioGroup.Item'
RadioGroupItemInput.displayName = 'RadioGroup.ItemInput'
RadioGroupItemControl.displayName = 'RadioGroup.ItemControl'
RadioGroupItemLabel.displayName = 'RadioGroup.ItemLabel'
RadioGroupItemDescription.displayName = 'RadioGroup.ItemDescription'

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
  ItemInput: RadioGroupItemInput,
  ItemControl: RadioGroupItemControl,
  ItemLabel: RadioGroupItemLabel,
  ItemDescription: RadioGroupItemDescription,
}
