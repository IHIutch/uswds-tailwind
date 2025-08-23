import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  input: string
}>

export interface InputMaskProps extends CommonProperties {
  /**
   * The pattern to validate input against
   */
  pattern?: string
  /**
   * The placeholder text to show
   */
  placeholder?: string
  /**
   * Custom character set for validation
   */
  charset?: string
  /**
   * Maximum length of the input
   */
  maxlength?: number
}

export interface InputMaskSchema {
  props: Partial<InputMaskProps>
  context: {
    value: string
    dynamicPlaceholder: string
  }
  state: 'idle'
  action: 'setValue' | 'updatePlaceholder'
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
  getPlaceholderProps: () => T['element']
  getValue: () => string
  getDynamicPlaceholder: () => string
}
