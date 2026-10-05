import type { EventObject, Machine, Service } from '@zag-js/core'
import type { AnimationFrame } from '@zag-js/dom-query'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'
import type { ComboboxCustomFilter, ComboboxOptionData } from './combobox.utils'

export type { ComboboxOptionData }

export interface ValueChangeDetails {
  value: string
  label: string
}

/** A rendered occurrence with its own ID, even when source option values repeat. */
export interface ComboboxItem {
  id: string
  value: string
  label: string
}

export type ElementIds = Partial<{
  root: string
  label: string
  hiddenSelect: string
  input: string
  list: string
  status: string
  trigger: string
  clearTrigger: string
}>

interface ComboboxAriaProps {
  /** Accessible name for the focusable input. */
  'aria-label'?: string | undefined

  /** Takes precedence over `aria-label` when supplied. */
  'aria-labelledby'?: string | undefined
}

export interface ComboboxProps extends CommonProperties, ComboboxAriaProps {
  ids?: ElementIds | undefined
  options?: ComboboxOptionData[] | undefined
  defaultValue?: string | undefined
  /** Called when the committed value changes. */
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  disableFiltering?: boolean | undefined
  /**
   * Internal hook for time-picker matching and ordering. Not a public API.
   * Public consumers should use `filter` and `filterExtras`.
   * @internal
   */
  customFilter?: ComboboxCustomFilter | undefined
  /**
   * Regex template matched against each option label, case-insensitively.
   * Defaults to `.*{{query}}.*`. Substitutions are escaped literal text, and
   * the resulting pattern is anchored to the whole label.
   * @example filter: '{{query}}.*' // Match labels starting with the input.
   */
  filter?: string | undefined
  /**
   * Maps template placeholder names to regexes that extract text from the input.
   * Each regex must include a capture group. Its first capture replaces the
   * matching placeholder; no match inserts an empty string.
   * `{{query}}` always inserts the full input and needs no entry here.
   * @example
   * filter: 'Item {{number}}',
   * filterExtras: { number: '(\\d+)' }
   * // Input "number 12" matches the label "Item 12".
   */
  filterExtras?: Record<string, string> | undefined
  placeholder?: string | undefined
  name?: string | undefined
  disabled?: boolean | undefined
  /** Emits disabled attributes while leaving the control operable. */
  ariaDisabled?: boolean | undefined
  required?: boolean | undefined

}

type PropsWithDefault = 'filter' | 'disableFiltering' | 'disabled' | 'ariaDisabled' | 'options'

export interface ComboboxSchema {
  props: RequiredBy<ComboboxProps, PropsWithDefault>
  state: 'closed' | 'open'
  tag: 'open' | 'closed'
  context: {
    value: string
    inputValue: string
    highlightedIndex: number | null
    isPristine: boolean
    items: ComboboxItem[]

  }
  refs: {
    focusFrame: AnimationFrame
    scrollFrame: AnimationFrame
  }
  effect: 'trackInteractOutside'
  action:
    | 'syncItems'
    | 'setInputValue'
    | 'resetList'
    | 'setHighlightedIndex'
    | 'cancelHighlightWork'
    | 'focusInput'
    | 'selectItem'
    | 'clearValue'
    | 'revertInputValue'
    | 'completeSelection'
  event: EventObject & (
    | { type: 'INPUT.CLICK' }
    | { type: 'INPUT.CHANGE', value: string }
    | { type: 'TRIGGER.CLICK' }
    | { type: 'VALUE.CLEAR' }
    | { type: 'ITEM.SELECT', value: string, label: string }
    | { type: 'HIGHLIGHTED_INDEX.SET', index: number, scroll: boolean, focusHandled?: boolean }
    | { type: 'INPUT.ARROW_DOWN', focusHandled?: boolean }
    | { type: 'CLOSE' }
    | { type: 'INPUT.ENTER' }
    | { type: 'LAYER.ESCAPE' }
    | { type: 'LAYER.INTERACT_OUTSIDE' }
    | { type: 'VALUE.SET', value: string }
  )
}

export type ComboboxService = Service<ComboboxSchema>
export type ComboboxMachine = Machine<ComboboxSchema>

export interface ComboboxApi<T extends PropTypes = PropTypes> {
  open: boolean

  value: string

  inputValue: string

  items: ComboboxItem[]

  /** Render this into the status part; the machine does not inject children. */
  srStatusText: string

  setValue: (value: string) => void

  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getHiddenSelectProps: () => T['select']
  getInputProps: () => T['input']
  getClearTriggerProps: () => T['button']
  getTriggerProps: () => T['button']
  getListProps: () => T['element']
  getItemProps: (props: { item: ComboboxItem }) => T['element']
  getStatusProps: () => T['element']
}
