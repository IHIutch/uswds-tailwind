import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { InputMaskApi, InputMaskSchema } from './input-mask.types'
import { parts } from './input-mask.anatomy'
import * as dom from './input-mask.dom'

export function connect<T extends PropTypes>(
  service: Service<InputMaskSchema>,
  normalize: NormalizeProps<T>,
): InputMaskApi<T> {
  const { state, context, send, scope, computed } = service

  const focused = state.matches("focused")
  const enteredText = computed("enteredText")
  const remainingPlaceholder = computed("remainingPlaceholder")

  return {
    /* ----- State properties ----- */
    focused,
    value: context.get("value"),
    enteredText,
    remainingPlaceholder,

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
        id: dom.getInputId(scope),
        maxLength: computed("maxLength"),
        defaultValue: context.get("value"),
        // Uses onInput (not keyup) per Zag convention — fires on paste/cut too.
        onInput(event) {
          const target = event.currentTarget as HTMLInputElement
          send({ type: "VALUE_CHANGE", value: target.value })
        },
        onFocus() {
          send({ type: "INPUT.FOCUS" })
        },
        onBlur() {
          send({ type: "INPUT.BLUR" })
        },
      })
    },

    /* ----- Mask display props ----- */
    getMaskProps() {
      return normalize.element({
        ...parts.mask.attrs,
        id: dom.getMaskId(scope),
        "aria-hidden": true,
      })
    },
  }
}
