import type { CharacterCountSchema } from './character-count.types'
import { createMachine } from '@zag-js/core'
import { addDomEvent } from '@zag-js/dom-query'
import * as dom from './character-count.dom'

const DEFAULT_STATUS_LABEL = "characters allowed"

const getCountMessage = (currentLength: number, maxLength: number) => {
  if (currentLength === 0) {
    return `${maxLength} ${DEFAULT_STATUS_LABEL}`
  }

  const difference = Math.abs(maxLength - currentLength)
  const characters = `character${difference === 1 ? "" : "s"}`
  const guidance = currentLength > maxLength ? "over limit" : "left"

  return `${difference} ${characters} ${guidance}`
}

/* -----------------------------------------------------------------------------
 * Machine
 * -----------------------------------------------------------------------------*/

export const machine = createMachine<CharacterCountSchema>({
  props({ props }) {
    return {
      defaultValue: "",
      validationMessage: "The content is too long.",
      ...props,
    }
  },

  initialState() {
    return "idle"
  },

  context({ prop, bindable }) {
    const maxLength = prop("maxLength")
    const defaultMessage = maxLength
      ? `${maxLength} ${DEFAULT_STATUS_LABEL}`
      : ""

    return {
      value: bindable<string>(() => ({
        defaultValue: prop("defaultValue"),
        value: prop("value"),
      })),
      // "${maxLength} characters allowed". SR message is debounced (L125-128).
      srStatusText: bindable<string>(() => ({
        defaultValue: defaultMessage,
      })),
    }
  },

  computed: {
    currentLength: ({ context }) => context.get("value").length,
    // Preserves the truthiness check on currentLength (0 is not over limit)
    isOverLimit: ({ context, prop }) => {
      const currentLength = context.get("value").length
      const maxLength = prop("maxLength")
      return !!currentLength && !!maxLength && currentLength > maxLength
    },
    // Consumer can override with `getStatusText` prop for i18n or alternate formats.
    statusText: ({ context, prop }) => {
      const maxLength = prop("maxLength")
      if (!maxLength) return ""
      const count = context.get("value").length
      const isOverLimit = !!count && count > maxLength
      const custom = prop("getStatusText")
      if (custom) return custom({ count, max: maxLength, isOverLimit })
      return getCountMessage(count, maxLength)
    },
  },

  states: {
    idle: {
      // Effect runs while in idle and focused.
      // on the input element handles setCustomValidity + SR debounce.
      effects: ["trackInputSideEffects"],
      on: {
        VALUE_CHANGE: {
          guard: "hasMaxLength",
          actions: ["setValue"],
        },
        "INPUT.FOCUS": {
          target: "focused",
        },
      },
    },
    focused: {
      effects: ["trackInputSideEffects"],
      on: {
        VALUE_CHANGE: {
          guard: "hasMaxLength",
          actions: ["setValue"],
        },
        "INPUT.BLUR": {
          target: "idle",
        },
      },
    },
  },

  implementations: {
    guards: {
      // Blocks VALUE_CHANGE if maxLength is not set or is 0.
      hasMaxLength: ({ prop }) => {
        const maxLength = prop("maxLength")
        return maxLength != null && maxLength > 0
      },
    },

    effects: {
      trackInputSideEffects({ context, prop, scope, computed }) {
        const inputEl = dom.getInputEl(scope)
        if (!inputEl) return

        let srTimer: ReturnType<typeof setTimeout> | undefined

        const cleanup = addDomEvent(inputEl, "input", () => {
          const maxLength = prop("maxLength")
          if (!maxLength) return

          const currentLength = inputEl.value.length
          const isOverLimit = !!currentLength && currentLength > maxLength
          const validationMessage = prop("validationMessage")

          if (isOverLimit && !inputEl.validationMessage) {
            inputEl.setCustomValidity(validationMessage)
          }

          if (!isOverLimit && inputEl.validationMessage === validationMessage) {
            inputEl.setCustomValidity("")
          }

          // Debounced SR status update (1000ms). Read `statusText` at
          // timer-firing time, not event time — the VALUE_CHANGE action runs
          // on a microtask, so the computed is still stale when this listener
          // fires.
          if (srTimer !== undefined) {
            clearTimeout(srTimer)
          }
          srTimer = setTimeout(() => {
            context.set("srStatusText", computed("statusText"))
            srTimer = undefined
          }, 1000)
        })

        return () => {
          cleanup()
          if (srTimer !== undefined) {
            clearTimeout(srTimer)
          }
        }
      },
    },

    actions: {
      setValue({ context, prop, event }) {
        const value = event.value as string
        context.set("value", value)

        // Fire callback manually after set (per gotcha: multiple context.set calls
        // + bindable onChange fires per-set, giving inconsistent snapshots)
        const maxLength = prop("maxLength")
        const length = value.length
        const isOverLimit = !!length && !!maxLength && length > maxLength
        prop("onValueChange")?.({ value, length, isOverLimit })
      },
    },
  },
})
