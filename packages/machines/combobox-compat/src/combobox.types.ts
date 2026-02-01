import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  label: string
  input: string
  list: string
  item: string
  emptyItem: string
  clearButton: string
  toggleButton: string
}>

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps extends CommonProperties {
  /**
   * The options to display in the combobox
   */
  options?: ComboboxOption[]
  /**
   * The selected value(s)
   */
  value?: string
  /**
   * Whether the combobox is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * Placeholder text for the input
   */
  placeholder?: string
  /**
   * Whether to show a clear button
   * @default true
   */
  showClearButton?: boolean
  /**
   * Whether to show a toggle button
   * @default true
   */
  showToggleButton?: boolean
  /**
   * Function called when selection changes
   */
  onSelectionChange?: (value: string) => void
  /**
   * Function called when input value changes
   */
  onInputChange?: (value: string) => void
  /**
   * Disable filtering of options; list always shows full options
   * @default false
   */
  disableFiltering?: boolean
}

export interface ComboboxSchema {
  props: Partial<ComboboxProps>
  context: {
    value: string
    disabled: boolean
    inputValue: string
    filteredOptions: ComboboxOption[]
    /**
     * Index of the item that has DOM focus (via keyboard navigation).
     * -1 when input has focus (no item is active).
     */
    activeIndex: number
    isOpen: boolean
    isDirty: boolean
  }
  state: 'idle' | 'focused' | 'open'
  action:
    | 'updateInputValue'
    | 'filterOptions'
    | 'selectOption'
    | 'clearSelection'
    | 'setOpen'
    | 'setClosed'
    | 'handleKeyDown'
    | 'syncInputWithSelection'
    | 'navigateNext'
    | 'navigatePrev'
    | 'selectActiveOrMatch'
    | 'handleEscape'
    | 'focusItem'
    | 'setValue'
  event: EventObject & (
    | { type: 'FOCUS' }
    | { type: 'OPEN' }
    | { type: 'CLOSE' }
    | { type: 'INPUT_CHANGE', value: string }
    | { type: 'SELECT_OPTION', option: ComboboxOption }
    | { type: 'CLEAR_SELECTION' }
    | { type: 'KEY_DOWN', key: string }
    | { type: 'HIGHLIGHT_ITEM', index: number }
    | { type: 'FOCUS_ITEM', index: number }
    | { type: 'ARROW_DOWN' }
    | { type: 'ARROW_UP' }
    | { type: 'ENTER' }
    | { type: 'ESCAPE' }
    | { type: 'SPACE' }
    | { type: 'RESET_INPUT' }
    | { type: 'VALUE.SET', value: string }
  )
}

export type ComboboxService = Service<ComboboxSchema>
export type ComboboxMachine = Machine<ComboboxSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface ComboboxApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the combobox is open
   */
  isOpen: boolean
  /**
   * Whether the combobox has any selected values
   */
  hasSelection: boolean
  /**
   * The current input value
   */
  inputValue: string
  /**
   * The currently selected values
   */
  value: string
  /**
   * The filtered options based on input
   */
  filteredOptions: ComboboxOption[]
  /**
   * The currently active option index (-1 when no item is active)
   */
  activeIndex: number
  /**
   * Whether there are no results to show
   */
  noResults: boolean

  setValue: (value: string) => void

  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getInputProps: () => T['input']
  getSelectProps: () => T['select']
  getListProps: () => T['element']
  getItemProps: (option: ComboboxOption, index: number) => T['button']
  getEmptyItemProps: () => T['element']
  getClearButtonProps: () => T['button']
  getToggleButtonProps: () => T['button']
}
