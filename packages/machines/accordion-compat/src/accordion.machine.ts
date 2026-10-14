import type { AccordionSchema } from './accordion.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import { add, remove } from '@zag-js/utils'
import * as dom from './accordion.dom'

export const machine = createMachine<AccordionSchema>({
  props({ props }) {
    return {
      defaultValue: [],
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  exit: ['cancelScrollIntoView'],

  context({ prop, bindable }) {
    return {
      value: bindable<string[]>(() => ({
        defaultValue: prop('defaultValue'),
        value: prop('value'),
        onChange(value) {
          prop('onValueChange')?.({ value })
        },
      })),
    }
  },

  // Global events always handled regardless of state
  on: {
    'TRIGGER.EXPAND': {
      actions: ['expand'],
    },
    'TRIGGER.COLLAPSE': {
      actions: ['collapse'],
    },
  },

  states: {
    idle: {
      on: {
        'TRIGGER.CLICK': [
          {
            guard: 'isExpanded',
            actions: ['collapse'],
          },
          {
            actions: ['expand', 'scrollIntoView'],
          },
        ],
      },
    },
  },

  implementations: {
    guards: {
      isExpanded: ({ context, event }) => context.get('value').includes(event.value),
    },

    actions: {
      expand({ context, prop, event }) {
        const next = prop('multiple') ? add<string>(context.get('value'), event.value) : [event.value]
        context.set('value', next)
      },
      collapse({ context, event }) {
        context.set('value', remove<string>(context.get('value'), event.value))
      },
      scrollIntoView({ scope, event, refs, context }) {
        const value = event.value
        refs.get('scrollCleanup')?.()
        refs.set('scrollCleanup', raf(() => {
          if (!context.get('value').includes(value)) {
            return
          }
          dom.scrollIntoView(scope, value)
        }))
      },
      cancelScrollIntoView({ refs }) {
        refs.get('scrollCleanup')?.()
        refs.set('scrollCleanup', null)
      },
    },
  },
})
