import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { CharacterCountApi, CharacterCountSchema } from './character-count.types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './character-count.anatomy'
import * as dom from './character-count.dom'

export function connect<T extends PropTypes>(
  service: Service<CharacterCountSchema>,
  normalize: NormalizeProps<T>,
): CharacterCountApi<T> {
  const { state, context, send, scope, computed } = service

  const focused = state.matches("focused")
  const isOverLimit = computed("isOverLimit")
  const countMessage = computed("countMessage")

  return {
    /* ----- State properties ----- */
    focused,
    isOverLimit,
    countMessage,
    srCountMessage: context.get("srCountMessage"),
    currentLength: computed("currentLength"),
    value: context.get("value"),

    /* ----- Root props ----- */
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    /* ----- Form group props ----- */
    //   formGroupEl.classList.toggle(FORM_GROUP_ERROR_CLASS, isOverLimit)
    getFormGroupProps() {
      return normalize.element({
        ...parts.formGroup.attrs,
        id: dom.getFormGroupId(scope),
        "data-invalid": dataAttr(isOverLimit),
      })
    },

    /* ----- Label props ----- */
    //   labelEl.classList.toggle(LABEL_ERROR_CLASS, isOverLimit)
    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        id: dom.getLabelId(scope),
        htmlFor: dom.getInputId(scope),
        "data-invalid": dataAttr(isOverLimit),
      })
    },

    /* ----- Input props ----- */
    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        id: dom.getInputId(scope),
        defaultValue: context.get("value"),
        "data-invalid": dataAttr(isOverLimit),
        //   [INPUT]() { updateCountMessage(this); }
        // Uses onInput (not onChange) per Zag convention for <input> elements.
        onInput(event) {
          const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement
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

    /* ----- Visual status props ----- */
    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        id: dom.getStatusId(scope),
        "aria-hidden": true,
        "data-invalid": dataAttr(isOverLimit),
      })
    },

    /* ----- Screen reader status props ----- */
    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        id: dom.getSrStatusId(scope),
        "aria-live": "polite",
      })
    },
  }
}
