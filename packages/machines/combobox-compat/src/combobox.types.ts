import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

export interface ComboboxOption {
  value: string
  text: string
  disabled?: boolean | undefined
}

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface ValueChangeDetails {
  value: string
  option: ComboboxOption | null
}

export interface InputValueChangeDetails {
  inputValue: string
}

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  label: string
  control: string
  input: string
  listbox: string
  trigger: string
  clearTrigger: string
  option: (value: string, index: number) => string
  status: string
}>

/* -----------------------------------------------------------------------------
 * Machine props
 * ----------------------------------------------------------------------------- */

export interface ComboboxProps extends CommonProperties {
  options?: ComboboxOption[] | undefined
  ids?: ElementIds | undefined
  disabled?: boolean | undefined
  defaultValue?: string | undefined
  value?: string | undefined
  defaultInputValue?: string | undefined
  inputValue?: string | undefined
  placeholder?: string | undefined
  required?: boolean | undefined
  ariaLabel?: string | undefined
  ariaLabelledby?: string | undefined
  filter?: string | undefined
  filterExtras?: Record<string, string> | undefined
  disableFiltering?: boolean | undefined
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  onInputValueChange?: ((details: InputValueChangeDetails) => void) | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

type PropsWithDefault
  = | 'options'
    | 'filter'
    | 'disableFiltering'
    | 'defaultValue'
    | 'defaultInputValue'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface ComboboxSchema {
  props: RequiredBy<ComboboxProps, PropsWithDefault>
  state: 'idle' | 'focused' | 'open'
  context: {
    value: string
    inputValue: string
    highlightedValue: string | null
    isPristine: boolean
  }
  computed: {
    isInteractive: boolean
    hasValue: boolean
    filteredOptions: ComboboxOption[]
  }
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type ComboboxService = Service<ComboboxSchema>
export type ComboboxMachine = Machine<ComboboxSchema>

/* -----------------------------------------------------------------------------
 * Option props for connect
 * ----------------------------------------------------------------------------- */

export interface OptionProps {
  option: ComboboxOption
  index: number
}

export interface OptionState {
  value: string
  disabled: boolean
  selected: boolean
  highlighted: boolean
}

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ComboboxApi<T extends PropTypes = PropTypes> {
  open: boolean
  focused: boolean
  value: string
  inputValue: string
  highlightedValue: string | null
  isPristine: boolean
  filteredOptions: ComboboxOption[]
  hasValue: boolean
  disabled: boolean
  statusMessage: string

  setValue: (value: string) => void
  setInputValue: (value: string) => void
  clearValue: () => void
  setOpen: (open: boolean) => void
  getOptionState: (props: OptionProps) => OptionState

  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getControlProps: () => T['element']
  getInputProps: () => T['input']
  getTriggerProps: () => T['button']
  getClearTriggerProps: () => T['button']
  getListboxProps: () => T['element']
  getOptionProps: (props: OptionProps) => T['element']
  getStatusProps: () => T['element']
}
