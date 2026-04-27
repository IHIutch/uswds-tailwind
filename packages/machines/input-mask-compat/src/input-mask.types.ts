import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * -----------------------------------------------------------------------------*/

export interface ValueChangeDetails {
  value: string
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * -----------------------------------------------------------------------------*/

export type ElementIds = Partial<{
  root: string
  input: string
  mask: string
}>

/* -----------------------------------------------------------------------------
 * Machine props
 * -----------------------------------------------------------------------------*/

export interface InputMaskProps extends CommonProperties {
  ids?: ElementIds | undefined
  placeholder: string
  charset?: string | undefined
  // Additive validation regex applied to the fully-entered value. Mismatch
  // sets aria-invalid + data-invalid on the input.
  pattern?: string | undefined
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
}

type PropsWithDefault = "defaultValue"

/* -----------------------------------------------------------------------------
 * Machine schema
 * -----------------------------------------------------------------------------*/

export interface InputMaskSchema {
  props: RequiredBy<InputMaskProps, PropsWithDefault>
  state: "idle" | "focused"
  context: {
    value: string
  }
  computed: {
    enteredText: string
    remainingPlaceholder: string
    maxLength: number
  }
  event:
    | { type: "VALUE_CHANGE"; value: string }
    | { type: "INPUT.FOCUS" }
    | { type: "INPUT.BLUR" }
  action: string
  effect: string
  guard: string
}

export type InputMaskService = Service<InputMaskSchema>
export type InputMaskMachine = Machine<InputMaskSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * -----------------------------------------------------------------------------*/

export interface InputMaskApi<T extends PropTypes = PropTypes> {
  focused: boolean
  value: string
  enteredText: string
  remainingPlaceholder: string
  // Whether the entered value fails the optional `pattern` regex. Always
  // false when `pattern` is not set or while the input isn't fully filled.
  isInvalid: boolean

  getRootProps: () => T["element"]
  getInputProps: () => T["input"]
  getMaskProps: () => T["element"]
}
