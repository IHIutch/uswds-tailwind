import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { Input } from '../input'

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

type InputMaskRootProps = Omit<inputMask.Props, 'id'> & React.HTMLAttributes<HTMLDivElement>

function InputMaskRoot({ className, children, ...props }: InputMaskRootProps) {
  const field = useFieldContext()

  const service = useMachine(inputMask.machine, {
    id: React.useId(),
    ids: {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    ...props,
  })
  const api = inputMask.connect(service, normalizeProps)
  const mergedProps = mergeProps(api.getRootProps(), props)

  return (
    <InputMaskContext.Provider value={{ api, placeholder: props.placeholder }}>
      <div
        {...mergedProps}
        className={className}
      >
        {children}
      </div>
    </InputMaskContext.Provider>
  )
}

type InputMaskLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

function InputMaskLabel({ className, ...props }: InputMaskLabelProps) {
  const { api } = useInputMaskContext()
  const mergedProps = mergeProps(api.getLabelProps(), props)

  return (
    <label
      {...mergedProps}
      className={cx('block', className)}
    />
  )
}

type InputMaskDescriptionProps = React.HTMLAttributes<HTMLDivElement>

function InputMaskDescription({ className, ...props }: InputMaskDescriptionProps) {
  const { api } = useInputMaskContext()
  const mergedProps = mergeProps(api.getDescriptionProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('text-gray-50', className)}
    />
  )
}

type InputMaskControlProps = React.HTMLAttributes<HTMLDivElement>

function InputMaskControl({ className, ...props }: InputMaskControlProps) {
  return (
    <div
      {...props}
      className={cx('relative mt-2', className)}
    />
  )
}

type InputMaskPlaceholderProps = React.HTMLAttributes<HTMLSpanElement>

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

type InputMaskInputProps = React.InputHTMLAttributes<HTMLInputElement>

const InputMaskInput = React.forwardRef<HTMLInputElement, InputMaskInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useInputMaskContext()
    const { 'aria-describedby': _, ...inputProps } = api.getInputProps()
    const mergedProps = mergeProps(inputProps, props)

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
InputMaskDescription.displayName = 'InputMask.Description'
InputMaskControl.displayName = 'InputMask.Control'
InputMaskPlaceholder.displayName = 'InputMask.Placeholder'
InputMaskInput.displayName = 'InputMask.Input'

export const InputMask = {
  Root: InputMaskRoot,
  Label: InputMaskLabel,
  Description: InputMaskDescription,
  Control: InputMaskControl,
  Placeholder: InputMaskPlaceholder,
  Input: InputMaskInput,
}
