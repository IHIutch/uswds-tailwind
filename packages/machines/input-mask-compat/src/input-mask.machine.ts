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

  context({ bindable }) {
    return {
      value: bindable(() => ({ defaultValue: '' })),
    }
  },

  states: {
    idle: {
      on: {
        INPUT: { actions: ['setValue'] },
      },
    },
  },

  implementations: {
    actions: {
      setValue({ context, event }) {
        context.set('value', event.value)
      },
    },
  },
})
