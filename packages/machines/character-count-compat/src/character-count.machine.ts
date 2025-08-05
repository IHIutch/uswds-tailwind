import type { CharacterCountSchema } from './character-count.types'
import { createMachine } from '@zag-js/core'

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
        INPUT: { actions: ['updateCharCount', 'updateStatus'] },
        INVALID: { target: 'invalid' },
      },
    },
    invalid: {
      on: {
        INPUT: { actions: ['updateCharCount', 'updateStatus'] },
        VALID: { target: 'valid' },
      },
    },
  },

  implementations: {
    actions: {
      updateCharCount({ context, event, prop }) {
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
      toggleState({ context, send, prop }) {
        const charCount = context.get('charCount')
        const maxLength = prop('maxLength')
        if (charCount > maxLength) {
          send({ type: 'INVALID' })
        }
        else {
          send({ type: 'VALID' })
        }
      },
    },
  },
})
