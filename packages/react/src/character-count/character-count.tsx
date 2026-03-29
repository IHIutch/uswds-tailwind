import * as characterCount from '@uswds-tailwind/character-count-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { Input } from '../input/input'

export type CharacterCountRootProps = Omit<characterCount.Props, 'id'> & React.HTMLAttributes<HTMLElement>
export type CharacterCountLabelProps = React.HTMLAttributes<HTMLLabelElement>
export type CharacterCountInputProps = React.InputHTMLAttributes<HTMLInputElement>
export type CharacterCountStatusProps = React.HTMLAttributes<HTMLElement>

export interface CharacterCountContextProps {
  api: characterCount.Api
  context: characterCount.Service['context']
}

const CharacterCountContext = React.createContext<CharacterCountContextProps | null>(null)

function useCharacterCountContext() {
  const context = React.useContext(CharacterCountContext)
  if (!context) {
    throw new Error('CharacterCount components must be used within a CharacterCount.Root')
  }
  return context
}

const CharacterCountRoot = React.forwardRef<any, CharacterCountRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const field = useFieldContext()

    const service = useMachine(characterCount.machine, {
      id: React.useId(),
      ids: {
        label: field?.ids.label,
        input: field?.ids.control,
      },
      maxLength: props.maxLength,
    })

    const api = characterCount.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <CharacterCountContext.Provider value={{ api, context: service.context }}>
        <div {...mergedProps} className={className} ref={forwardedRef} />
      </CharacterCountContext.Provider>
    )
  },
)

const CharacterCountInput = React.forwardRef<any, CharacterCountInputProps>(
  (props, forwardedRef) => {
    const { api } = useCharacterCountContext()

    const mergedProps = mergeProps(api.getInputProps(), props)

    return (
      <Input
        {...mergedProps}
        ref={forwardedRef}
      />
    )
  },
)

const CharacterCountStatus = React.forwardRef<any, CharacterCountStatusProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api, context } = useCharacterCountContext()

    const mergedProps = mergeProps(api.getStatusProps(), props)

    return (
      <div>
        <span className="sr-only">
          You can enter up to
          {api.maxLength}
          {' '}
          characters
        </span>
        <span
          {...mergedProps}
          className={cx(
            'text-gray-50 invalid:text-red-60v invalid:font-bold',
            className,
          )}
          ref={forwardedRef}
        >
          {context.get('statusText')}
        </span>
        <span {...api.getSrStatusProps()}>{context.get('srStatusText')}</span>
      </div>
    )
  },
)

const CharacterCountLabel = React.forwardRef<any, CharacterCountLabelProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useCharacterCountContext()

    const mergedProps = mergeProps(api.getLabelProps(), props)

    return (
      <label
        {...mergedProps}
        className={cx('block', className)}
        ref={forwardedRef}
      />
    )
  },
)

export const CharacterCount = {
  Root: CharacterCountRoot,
  Input: CharacterCountInput,
  Status: CharacterCountStatus,
  Label: CharacterCountLabel,
}
