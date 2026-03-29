import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  label: string
  input: string
  status: string
  srStatus: string
}>

export interface CharacterCountProps extends CommonProperties {
  /**
   * The ids of the elements in the character count. Useful for composition.
   */
  ids?: ElementIds | undefined
  /**
   * The maximum number of characters allowed.
   *  @default undefined
   */
  maxLength?: number
  /**
   * The debounce duration (in milliseconds) for updating the screen-reader status text.
   * @default 1000 (1 second)
   */
  statusSrDebounce?: number
  /**
   * Function to generate the status text based on the character count and maximum length.
   * @param count - The current character count.
   * @param max - The maximum allowed characters.
   * @returns The status text to be displayed.
   */
  getStatusText?: (count: number, max: number) => string
  /**
   * Custom validation message to display when the input is invalid.
   */
  customValidation?: string
}

export interface CharacterCountSchema {
  props: RequiredBy<CharacterCountProps, 'getStatusText'>
  context: {
    charCount: number
    maxLength: number
    statusText: string
    srStatusText: string
    customValidation: string
  }
  state: 'valid' | 'invalid'
  action: 'updateCharCount' | 'updateStatus' | 'updateSrStatus' | 'toggleState' | 'setCustomValidity'
  event: EventObject
}

export type CharacterCountService = Service<CharacterCountSchema>
export type CharacterCountMachine = Machine<CharacterCountSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface CharacterCountApi<T extends PropTypes = PropTypes> {
  /**
   * The maximum number of characters allowed.
   */
  maxLength: number
  /**
   * The current state of the input
   */
  isInvalid: boolean
  /**
   * Set a custom validation message for the input
   * @param message - The custom validation message to set
   */
  setCustomValidity: (message: string) => void
  // /**
  //  * The debounce duration (in milliseconds) for updating the screen-reader status text.
  //  * @default 1000 (1 second)
  //  */
  // statusSrDebounce?: number
  // /**
  //  * Function to generate the status text based on the character count and maximum length.
  //  * @param count - The current character count.
  //  * @param max - The maximum allowed characters.
  //  * @returns The status text to be displayed.
  //  */
  // getStatusText: (count: number, max: number) => string

  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getInputProps: () => T['input']
  getStatusProps: () => T['element']
  getSrStatusProps: () => T['element']
}
