import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { InputMaskApi, InputMaskSchema } from './input-mask.types'
import { ariaAttr, dataAttr } from '@zag-js/dom-query'
import { parts } from './input-mask.anatomy'
import * as dom from './input-mask.dom'

export function connect<T extends PropTypes>(
  service: Service<InputMaskSchema>,
  normalize: NormalizeProps<T>,
): InputMaskApi<T> {
  const { state, context, send, prop, scope, computed } = service

  const focused = state.matches('focused')
  const enteredText = computed('enteredText')
  const remainingPlaceholder = computed('remainingPlaceholder')
  const value = context.get('value')
  const pattern = prop('pattern')
  const maxLength = computed('maxLength')

  // `pattern` validation only applies once the input is fully filled.
  // Partial entries are "in progress" and shouldn't be flagged invalid.
  // Mirrors the react branch's additive validation on top of the mask.
  const isInvalid = Boolean(
    pattern && value.length === maxLength && !new RegExp(pattern).test(value),
  )

  return {
    /* ----- State properties ----- */
    focused,
    value,
    enteredText,
    remainingPlaceholder,
    isInvalid,

    /* ----- Root props ----- */
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    /* ----- Input props ----- */
    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'maxLength': maxLength,
        'value': value,
        // `pattern` validation: only emitted when a `pattern` prop is present
        // and the fully-filled value fails to match (additive — no USWDS analogue).
        'aria-invalid': ariaAttr(isInvalid),
        'data-invalid': dataAttr(isInvalid),
        // Uses onInput (not keyup) per Zag convention — fires on paste/cut too.
        onInput(event) {
          const target = event.currentTarget as HTMLInputElement
          send({ type: 'VALUE_CHANGE', value: target.value })
        },
        onFocus() {
          send({ type: 'INPUT.FOCUS' })
        },
        onBlur() {
          send({ type: 'INPUT.BLUR' })
        },
      })
    },

    /* ----- Mask display props ----- */
    getMaskProps() {
      return normalize.element({
        ...parts.mask.attrs,
        'id': dom.getMaskId(scope),
        'aria-hidden': true,
      })
    },
  }
}
