import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface ValueChangeDetails {
  value: string
  length: number
  isOverLimit: boolean
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  formGroup: string
  label: string
  input: string
  status: string
  srStatus: string
}>

/* -----------------------------------------------------------------------------
 * Machine props
 * ----------------------------------------------------------------------------- */

export interface CharacterCountProps extends CommonProperties {
  ids?: ElementIds | undefined
  maxLength?: number | undefined
  value?: string | undefined
  defaultValue?: string | undefined
  validationMessage?: string | undefined
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  // Customize the status message for both the visible and SR text. Useful
  // for i18n or alternative formats ("N of M", "N words remaining").
  getStatusText?: ((details: { count: number, max: number, isOverLimit: boolean }) => string) | undefined
}

type PropsWithDefault = 'defaultValue' | 'validationMessage'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface CharacterCountSchema {
  props: RequiredBy<CharacterCountProps, PropsWithDefault>
  state: 'idle' | 'focused'
  context: {
    value: string
    srStatusText: string
  }
  computed: {
    currentLength: number
    isOverLimit: boolean
    statusText: string
  }
  event:
    | { type: 'VALUE_CHANGE', value: string }
    | { type: 'INPUT.FOCUS' }
    | { type: 'INPUT.BLUR' }
  action: string
  effect: string
  guard: string
}

export type CharacterCountService = Service<CharacterCountSchema>
export type CharacterCountMachine = Machine<CharacterCountSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface CharacterCountApi<T extends PropTypes = PropTypes> {
  focused: boolean
  isOverLimit: boolean
  statusText: string
  srStatusText: string
  currentLength: number
  value: string

  getRootProps: () => T['element']
  getFormGroupProps: () => T['element']
  getLabelProps: () => T['label']
  getInputProps: () => T['input']
  getStatusProps: () => T['element']
  getSrStatusProps: () => T['element']
}
