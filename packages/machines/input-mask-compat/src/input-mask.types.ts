import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  content: string
  input: string
}>

export interface InputMaskProps extends CommonProperties {
  ids?: ElementIds | undefined
  /** The pattern to display and apply to the input. */
  mask: string
  /** When present, this pattern is used for matching and enables letter slots. */
  charset?: string | undefined
  defaultValue?: string | undefined
  value?: string | undefined
  onValueChange?: ((details: { value: string }) => void) | undefined
}

export interface InputMaskSchema {
  props: RequiredBy<InputMaskProps, 'defaultValue'>
  state: 'idle'
  context: { value: string }
  action: 'updateValue' | 'syncInput'
  event: { type: 'VALUE.SET', value: string }
  guard: never
  effect: never
}

export type InputMaskService = Service<InputMaskSchema>
export type InputMaskMachine = Machine<InputMaskSchema>

export interface InputMaskApi<T extends PropTypes = PropTypes> {
  value: string
  overlayValue: string
  mask: string
  remainingPlaceholder: string
  setValue: (value: string) => void
  getRootProps: () => T['element']
  getContentProps: () => T['element']
  getInputProps: () => T['input']
}
