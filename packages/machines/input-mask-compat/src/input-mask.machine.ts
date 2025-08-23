import type { InputMaskSchema } from './input-mask.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<InputMaskSchema>({
  props({ props }) {
    return {
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    const placeholder = prop('placeholder') || ''
    return {
      value: bindable(() => ({ defaultValue: '' })),
      dynamicPlaceholder: bindable(() => ({ defaultValue: placeholder })),
    }
  },

  states: {
    idle: {
      on: {
        INPUT: { actions: ['setValue', 'updatePlaceholder'] },
      },
    },
  },

  implementations: {
    actions: {
      setValue({ context, event }) {
        if (event && 'value' in event) {
          context.set('value', event.value)
        }
      },
      
      updatePlaceholder({ context, prop }) {
        const placeholder = prop('placeholder') || ''
        const value = context.get('value')
        context.set('dynamicPlaceholder', placeholder.slice(value.length))
      },
    },
  },
})
