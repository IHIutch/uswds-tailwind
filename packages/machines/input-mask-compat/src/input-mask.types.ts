import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  input: string
}>

export interface InputMaskProps extends CommonProperties {
  /**
   * The mask pattern to apply. If `regex` is provided, it will be used instead.
   */
  mask?: string
  /**
   * Regex pattern for the mask. Takes precedence over `mask` if provided.
   */
  regex?: string
}

export interface InputMaskSchema {
  props: RequiredBy<InputMaskProps, 'mask'>
  context: {
    value: string
  }
  state: 'idle'
  action: 'setValue'
  event: {
    type: 'INPUT'
    value: string
  }
}

export type InputMaskService = Service<InputMaskSchema>
export type InputMaskMachine = Machine<InputMaskSchema>

export interface InputMaskApi<T extends PropTypes = PropTypes> {
  getRootProps: () => T['element']
  getInputProps: () => T['input']
}
