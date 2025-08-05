import type { InputMaskSchema } from './input-mask.types'
import { createMachine } from '@zag-js/core'
import Inputmask from 'inputmask'
import * as dom from './input-mask.dom'

export const machine = createMachine<InputMaskSchema>({
  props({ props }) {
    return {
      mask: '',
      regex: undefined,
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
      effects: ['setupMask'],
      on: {
        INPUT: { actions: ['setValue'] },
      },
    },
  },

  implementations: {
    actions: {
      setValue({ context, event }) {
        if ('value' in event) {
          context.set('value', event.value)
        }
      },
    },
    effects: {
      setupMask({ scope, prop }) {
        const inputEl = dom.getInputEl(scope)
        if (!inputEl)
          return
        const mask = prop('regex') ? { regex: prop('regex')! } : prop('mask')
        const im = new Inputmask(mask as any)
        im.mask(inputEl)
        return () => {
          im.remove()
        }
      },
    },
  },
})
