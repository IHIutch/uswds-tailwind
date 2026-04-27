import type * as characterCount from '@uswds-tailwind/character-count-compat'
import type { UseCharacterCountProps } from './use-character-count'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { Input } from '../input/input'
import { useCharacterCount } from './use-character-count'

export type CharacterCountRootProps = UseCharacterCountProps & React.ComponentPropsWithoutRef<'div'>
export type CharacterCountLabelProps = React.ComponentPropsWithoutRef<'label'>
export type CharacterCountInputProps = React.ComponentPropsWithoutRef<'input'>
export type CharacterCountStatusProps = React.ComponentPropsWithoutRef<'div'>
export type CharacterCountSrStatusProps = React.ComponentPropsWithoutRef<'div'>

export interface CharacterCountContextProps {
  api: characterCount.Api
  maxLength: number | undefined
}

const CharacterCountContext = React.createContext<CharacterCountContextProps | null>(null)

function useCharacterCountContext() {
  const context = React.useContext(CharacterCountContext)
  if (!context) {
    throw new Error('CharacterCount components must be used within a CharacterCount.Root')
  }
  return context
}

const CharacterCountRoot = React.forwardRef<HTMLDivElement, CharacterCountRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api, maxLength } = useCharacterCount(props)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <CharacterCountContext.Provider value={{ api, maxLength }}>
        <div {...mergedProps} className={className} ref={forwardedRef} />
      </CharacterCountContext.Provider>
    )
  },
)

const CharacterCountInput = React.forwardRef<HTMLInputElement, CharacterCountInputProps>(
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

function CharacterCountStatus({ className, ...props }: CharacterCountStatusProps) {
  const { api } = useCharacterCountContext()
  const field = useFieldContext()

  const mergedProps = mergeProps(api.getStatusProps(), field?.getDescriptionProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx(
        'mt-1 text-gray-50 invalid:text-red-60v invalid:font-bold',
        className,
      )}
    >
      {api.statusText}
    </div>
  )
}

function CharacterCountSrStatus(props: CharacterCountSrStatusProps) {
  const { api, maxLength } = useCharacterCountContext()

  const mergedProps = mergeProps(api.getSrStatusProps(), props)

  return (
    <div>
      <span className="sr-only">
        You can enter up to
        {' '}
        {maxLength}
        {' '}
        characters
      </span>
      <span {...mergedProps}>{api.srStatusText}</span>
    </div>
  )
}

function CharacterCountLabel({ className, ...props }: CharacterCountLabelProps) {
  const { api } = useCharacterCountContext()

  const mergedProps = mergeProps(api.getLabelProps(), props)

  return (
    <label
      {...mergedProps}
      className={cx('block', className)}
    />
  )
}

CharacterCountRoot.displayName = 'CharacterCount.Root'
CharacterCountInput.displayName = 'CharacterCount.Input'
CharacterCountStatus.displayName = 'CharacterCount.Status'
CharacterCountSrStatus.displayName = 'CharacterCount.SrStatus'
CharacterCountLabel.displayName = 'CharacterCount.Label'

export const CharacterCount = {
  Root: CharacterCountRoot,
  Input: CharacterCountInput,
  Status: CharacterCountStatus,
  SrStatus: CharacterCountSrStatus,
  Label: CharacterCountLabel,
}
