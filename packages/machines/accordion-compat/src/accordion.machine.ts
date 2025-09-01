import type { AccordionSchema } from './accordion.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<AccordionSchema>({
  props({ props }) {
    return {
      multiple: false,
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable }) {
    return {
      value: bindable<string[]>(() => ({ defaultValue: [] })),
    }
  },

  states: {
    idle: {
      on: {
        TOGGLE: { actions: ['toggleItem'] },
        OPEN: { actions: ['openItem'] },
        CLOSE: { actions: ['closeItem'] },
      },
    },
  },

  implementations: {
    actions: {
      openItem({ context, event, prop }) {
        const { id } = event
        const value = context.get('value')
        const next = prop('multiple') ? [...value, id] : [id]
        context.set('value', Array.from(new Set(next)))
      },
      closeItem({ context, event }) {
        const { id } = event
        context.set('value', context.get('value').filter(v => v !== id))
      },
      toggleItem({ context, event, prop }) {
        const { id } = event
        const value = context.get('value')
        const isOpen = value.includes(id)
        if (isOpen) {
          context.set('value', value.filter(v => v !== id))
        }
        else {
          const next = prop('multiple') ? [...value, id] : [id]
          context.set('value', Array.from(new Set(next)))
        }
      },
    },
  },
})
