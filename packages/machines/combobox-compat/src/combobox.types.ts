import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'
import type { ComboboxCustomFilter, ComboboxOptionData } from './combobox.utils'

export type { ComboboxOptionData }

export interface ValueChangeDetails {
  value: string

  label: string
}

export interface ComboboxOption {
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

export interface ComboboxProps extends DirectionProperty, CommonProperties, ComboboxAriaProps {
  ids?: ElementIds | undefined

  options?: ComboboxOptionData[] | undefined

  defaultValue?: string | undefined

  onValueChange?: ((details: ValueChangeDetails) => void) | undefined

  disableFiltering?: boolean | undefined

  /**
   * A specialized consumer can select and order the nonempty source options while the
   * combobox is actively filtering. It replaces the source filter and starts-with sort.
   * Return references from the provided options only. The combobox ignores unknown or
   * repeated entries and retains each accepted source option's label.
   */
  customFilter?: ComboboxCustomFilter | undefined

  placeholder?: string | undefined

  name?: string | undefined

  disabled?: boolean | undefined

  /** Emits disabled attributes while leaving the control operable. */
  ariaDisabled?: boolean | undefined

  required?: boolean | undefined

}

type PropsWithDefault = 'disableFiltering' | 'disabled' | 'ariaDisabled' | 'options'

export interface ComboboxSchema {
  props: RequiredBy<ComboboxProps, PropsWithDefault>
  state: 'closed' | 'open'
  tag: 'open' | 'closed'
  context: {

    value: string

    inputValue: string

    highlightedId: string | null

    isPristine: boolean

    filteredOptions: ComboboxOption[]

    // Completion clears this even when the list state does not change.
    srStatusText: string

  }
  refs: {
    focusCleanup: VoidFunction | null
    scrollCleanup: VoidFunction | null
  }
  guard: 'hasNextOption' | 'hasPrevOption'
  effect: 'trackFocusOut' | 'bridgeInitialDefaultValue'
  action:
    | 'syncInputValue'
    | 'openList'
    | 'closeList'
    | 'highlightNextOption'
    | 'highlightPrevOption'
    | 'highlightItem'
    | 'scrollHighlightedIntoView'
    | 'focusHighlightedOption'
    | 'cancelHighlightRafs'
    | 'focusInput'
    | 'commitSelection'
    | 'clearSelection'
    | 'resetSelection'
    | 'completeSelection'
  event: EventObject & (
    | { type: 'INPUT.CLICK' }
    | { type: 'INPUT.CHANGE', value: string }
    | { type: 'TRIGGER.CLICK' }
    | { type: 'CLEAR.CLICK' }
    | { type: 'ITEM.SELECT', value: string, label: string }
    | { type: 'ITEM.POINTER_MOVE', id: string }
    | { type: 'INPUT.ARROW_DOWN', focusHandled?: boolean }
    | { type: 'ITEM.ARROW_DOWN', id: string, focusHandled?: boolean }
    | { type: 'ITEM.ARROW_UP', id: string }
    | { type: 'INPUT.ENTER' }
    | { type: 'ESCAPE' }
    | { type: 'INTERACT_OUTSIDE' }
    | { type: 'VALUE.SET', value: string }
  )
}

export type ComboboxService = Service<ComboboxSchema>
export type ComboboxMachine = Machine<ComboboxSchema>

export interface ComboboxApi<T extends PropTypes = PropTypes> {
  open: boolean

  value: string

  inputValue: string

  options: ComboboxOption[]

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
  getItemProps: (details: { option: ComboboxOption }) => T['element']
  getStatusProps: () => T['element']
}
