import type { CharacterCountSchema } from './character-count.types'
import { createMachine } from '@zag-js/core'
import { getInputEl } from './character-count.dom'

function debounce<T extends (...args: any[]) => void>(callback: T, wait: number) {
  let timeoutId: number | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}

const debounced = debounce((fn) => {
  fn()
}, 1000)

export const machine = createMachine<CharacterCountSchema>({
  props({ props }) {
    return {
      maxLength: Infinity,
      getStatusText: () => '',
      customValidation: 'The content is too long.',
      ...props,
    }
  },

  initialState() {
    return 'valid'
  },

  context({ bindable, prop }) {
    return {
      charCount: bindable(() => ({ defaultValue: 0 })),
      maxLength: bindable(() => ({ defaultValue: prop('maxLength') })),
      statusText: bindable(() => ({ defaultValue: prop('getStatusText')(0, prop('maxLength')) })),
      srStatusText: bindable(() => ({ defaultValue: prop('getStatusText')(0, prop('maxLength')) })),
      customValidation: bindable(() => ({ defaultValue: prop('customValidation') })),
    }
  },

  watch({ track, action, context }) {
    track([() => context.get('charCount')], () => {
      action(['toggleState', 'updateStatus', 'updateSrStatus'])
    })
  },

  states: {
    valid: {
      on: {
        INVALID: { target: 'invalid' },
      },
    },
    invalid: {
      on: {
        VALID: { target: 'valid' },
      },
    },
  },

  on: {
    INPUT: { actions: ['updateCharCount', 'updateStatus'] },
    SET_CUSTOM_VALIDITY: { actions: ['setCustomValidity'] },
  },

  implementations: {
    actions: {
      updateCharCount({ context, event }) {
        if ('value' in event) {
          context.set('charCount', event.value)
        }
      },
      updateStatus({ context, prop }) {
        const text = prop('getStatusText')(
          context.get('charCount'),
          context.get('maxLength'),
        )
        context.set('statusText', text)
      },
      updateSrStatus({ context, prop }) {
        debounced(() => {
          const text = prop('getStatusText')(
            context.get('charCount'),
            context.get('maxLength'),
          )
          context.set('srStatusText', text)
        })
      },
      toggleState({ context, send, prop, scope }) {
        const charCount = context.get('charCount')
        const maxLength = prop('maxLength')
        const inputEl = getInputEl(scope)
        const customValidation = context.get('customValidation')

        if (charCount > maxLength) {
          send({ type: 'INVALID' })
          if (inputEl && !inputEl.validationMessage) {
            inputEl.setCustomValidity(customValidation)
          }
        }
        else {
          send({ type: 'VALID' })
          if (inputEl && inputEl.validationMessage === customValidation) {
            inputEl.setCustomValidity('')
          }
        }
      },
      setCustomValidity({ context, event, scope }) {
        context.set('customValidation', event.value)

        const inputEl = getInputEl(scope)
        inputEl?.setCustomValidity(event.value)
      },
    },
  },
})
