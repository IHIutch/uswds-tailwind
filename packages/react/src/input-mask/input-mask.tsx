import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { Input } from '../input'
import { type UseInputMaskProps, useInputMask } from './use-input-mask'

export interface InputMaskContextProps {
  api: inputMask.Api
  placeholder: inputMask.Props['placeholder']
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
  ({ className, children, charset, pattern, placeholder, maxlength, id, ...props }, forwardedRef) => {
    const { api } = useInputMask({ charset, pattern, placeholder, maxlength, id })
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <InputMaskContext.Provider value={{ api, placeholder }}>
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
      className={cx('block', className)}
    />
  )
}

export type InputMaskControlProps = React.ComponentPropsWithoutRef<'div'>

function InputMaskControl({ className, ...props }: InputMaskControlProps) {
  return (
    <div
      {...props}
      className={cx('relative mt-2', className)}
    />
  )
}

export type InputMaskPlaceholderProps = React.ComponentPropsWithoutRef<'span'>

function InputMaskPlaceholder({ className, ...props }: InputMaskPlaceholderProps) {
  const { api, placeholder } = useInputMaskContext()

  return placeholder
    ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 p-2 pointer-events-none border inline-flex whitespace-pre"
        >
          <span className="invisible">{api.getValue()}</span>
          <span {...props} className={cx('text-gray-50', className)}>
            {placeholder.slice(api.getValue().length)}
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
        className={cx('placeholder:invisible', className)}
        ref={forwardedRef}
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
