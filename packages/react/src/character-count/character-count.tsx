import type { UseCharacterCountProps } from './use-character-count'
import * as characterCount from '@uswds-tailwind/character-count-compat'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { Input } from '../input/input'
import { cn } from '../tv.config'
import { composeRefs } from '../utils/compose-refs'
import { useCharacterCount } from './use-character-count'

export type CharacterCountRootProps = UseCharacterCountProps & React.ComponentPropsWithoutRef<'div'>
export type CharacterCountInputProps = React.ComponentPropsWithoutRef<'input'>
export type CharacterCountStatusProps = React.ComponentPropsWithoutRef<'div'>
export type CharacterCountSrStatusProps = React.ComponentPropsWithoutRef<'div'>

const CharacterCountContext = React.createContext<characterCount.Api | null>(null)

function useCharacterCountContext() {
  const api = React.useContext(CharacterCountContext)
  if (!api) {
    throw new Error('CharacterCount components must be used within a CharacterCount.Root')
  }
  return api
}

const CharacterCountRoot = React.forwardRef<HTMLDivElement, CharacterCountRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const [machineProps, rest] = characterCount.splitProps(props)
    const api = useCharacterCount(machineProps as UseCharacterCountProps)
    const mergedProps = mergeProps(api.getRootProps(), rest)

    return (
      <CharacterCountContext.Provider value={api}>
        <div {...mergedProps} className={className} ref={forwardedRef} />
      </CharacterCountContext.Provider>
    )
  },
)

const CharacterCountInput = React.forwardRef<HTMLInputElement, CharacterCountInputProps>(
  (props, forwardedRef) => {
    const api = useCharacterCountContext()

    const mergedProps = mergeProps(api.getInputProps(), props)

    return (
      <Input
        {...mergedProps}
        ref={composeRefs(mergedProps.ref, forwardedRef)}
      />
    )
  },
)

function CharacterCountStatus({ className, ...props }: CharacterCountStatusProps) {
  const api = useCharacterCountContext()
  const field = useFieldContext()

  const mergedProps = mergeProps(api.getStatusProps(), field?.getDescriptionProps(), props)

  return (
    <div
      {...mergedProps}
      className={cn(
        'mt-1 text-gray-50 invalid:text-red-60v invalid:font-bold',
        className,
      )}
    >
      {api.statusText}
    </div>
  )
}

function CharacterCountSrStatus(props: CharacterCountSrStatusProps) {
  const api = useCharacterCountContext()

  const mergedProps = mergeProps(api.getSrStatusProps(), props)

  return (
    <div>
      <span className="sr-only">
        You can enter up to
        {' '}
        {api.maxLength}
        {' '}
        characters
      </span>
      <span {...mergedProps}>{api.srStatusText}</span>
    </div>
  )
}

CharacterCountRoot.displayName = 'CharacterCount.Root'
CharacterCountInput.displayName = 'CharacterCount.Input'
CharacterCountStatus.displayName = 'CharacterCount.Status'
CharacterCountSrStatus.displayName = 'CharacterCount.SrStatus'

export const CharacterCount = {
  Root: CharacterCountRoot,
  Input: CharacterCountInput,
  Status: CharacterCountStatus,
  SrStatus: CharacterCountSrStatus,
}
