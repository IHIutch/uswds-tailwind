import type { Machine, Service } from '@zag-js/core'
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
   * The maximum number of characters allowed.
   *  @default Infinity
   */
  maxLength: number
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
  getStatusText: (count: number, max: number) => string
}

export interface CharacterCountSchema {
  props: RequiredBy<CharacterCountProps, 'maxLength' | 'getStatusText'> // Added getStatusText
  context: {
    charCount: number
    maxLength: number
    statusText: string
    srStatusText: string
  }
  state: 'valid' | 'invalid'
  action: 'updateCharCount' | 'updateStatus' | 'updateSrStatus' | 'toggleState'
  event: {
    type: 'INVALID' | 'VALID'
  } | {
    type: 'INPUT'
    value: number
  }
}

export type CharacterCountService = Service<CharacterCountSchema>
export type CharacterCountMachine = Machine<CharacterCountSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface CharacterCountApi<T extends PropTypes = PropTypes> {
  // /**
  //  * The maximum number of characters allowed.
  //  */
  // maxLength: number
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
  /**
   * The current state of the input
   */
  isInvalid: boolean

  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getInputProps: () => T['input']
  getStatusProps: () => T['element']
  getSrStatusProps: () => T['element']
}
