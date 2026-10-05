import type * as inputMask from '@uswds-tailwind/input-mask-compat'
import type { UseInputMaskProps } from './use-input-mask'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { Input } from '../input'
import { cn } from '../tv.config'
import { composeRefs } from '../utils/compose-refs'
import { useInputMask } from './use-input-mask'

export interface InputMaskContextProps {
  api: inputMask.Api
}

const InputMaskContext = React.createContext<InputMaskContextProps | null>(null)

function useInputMaskContext() {
  const context = React.useContext(InputMaskContext)
  if (!context) {
    throw new Error('InputMask components must be used within an InputMask.Root')
  }
  return context
}

export type InputMaskRootProps = UseInputMaskProps & React.ComponentPropsWithoutRef<'div'>

const InputMaskRoot = React.forwardRef<HTMLDivElement, InputMaskRootProps>(
  ({ className, children, id, ids, charset, placeholder, value, defaultValue, onValueChange, ...props }, forwardedRef) => {
    const { api } = useInputMask({ id, ids, charset, placeholder, value, defaultValue, onValueChange })
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <InputMaskContext.Provider value={{ api }}>
        <div
          {...mergedProps}
          className={className}
          ref={forwardedRef}
        >
          {children}
        </div>
      </InputMaskContext.Provider>
    )
  },
)

export type InputMaskLabelProps = React.ComponentPropsWithoutRef<'label'>

function InputMaskLabel({ className, ...props }: InputMaskLabelProps) {
  return (
    <label
      {...props}
      className={cn('block', className)}
    />
  )
}

export type InputMaskControlProps = React.ComponentPropsWithoutRef<'div'>

function InputMaskControl({ className, ...props }: InputMaskControlProps) {
  return (
    <div
      {...props}
      className={cn('relative mt-2', className)}
    />
  )
}

export type InputMaskPlaceholderProps = React.ComponentPropsWithoutRef<'span'>

function InputMaskPlaceholder({ className, ...props }: InputMaskPlaceholderProps) {
  const { api } = useInputMaskContext()
  const contentProps = api.getContentProps()

  return api.mask
    ? (
        <div
          {...contentProps}
          className="absolute inset-0 p-2 pointer-events-none border inline-flex whitespace-pre"
        >
          <i className="invisible">{api.overlayValue}</i>
          <span {...props} className={cn('text-gray-50', className)}>
            {api.remainingPlaceholder}
          </span>
        </div>
      )
    : null
}

export type InputMaskInputProps = React.ComponentPropsWithoutRef<'input'>

const InputMaskInput = React.forwardRef<HTMLInputElement, InputMaskInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useInputMaskContext()
    const mergedProps = mergeProps(api.getInputProps(), props)

    return (
      <Input
        {...mergedProps}
        className={cn('placeholder:invisible', className)}
        ref={composeRefs(mergedProps.ref, forwardedRef)}
      />
    )
  },
)

InputMaskRoot.displayName = 'InputMask.Root'
InputMaskLabel.displayName = 'InputMask.Label'
InputMaskControl.displayName = 'InputMask.Control'
InputMaskPlaceholder.displayName = 'InputMask.Placeholder'
InputMaskInput.displayName = 'InputMask.Input'

export const InputMask = {
  Root: InputMaskRoot,
  Label: InputMaskLabel,
  Control: InputMaskControl,
  Placeholder: InputMaskPlaceholder,
  Input: InputMaskInput,
}
