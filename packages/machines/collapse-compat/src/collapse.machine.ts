import type { CollapseSchema } from './collapse.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<CollapseSchema>({
  initialState({ prop }) {
    const open = prop('open') ?? prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  context() {
    return {}
  },

  watch({ track, prop, action }) {
    track([() => prop('open')], () => {
      action(['syncControlledOpen'])
    })
  },

  states: {
    closed: {
      on: {
        'OPEN': [
          {
            guard: 'isOpenControlled',
            actions: ['invokeOnOpen'],
          },
          {
            target: 'open',
            actions: ['invokeOnOpen'],
          },
        ],
        'CONTROLLED.OPEN': { target: 'open' },
      },
    },
    open: {
      on: {
        'CLOSE': [
          {
            guard: 'isOpenControlled',
            actions: ['invokeOnClose'],
          },
          {
            target: 'closed',
            actions: ['invokeOnClose'],
          },
        ],
        'CONTROLLED.CLOSE': { target: 'closed' },
      },
    },
  },

  implementations: {
    guards: {
      isOpenControlled: ({ prop }) => prop('open') !== undefined,
    },

    actions: {
      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },
      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
      syncControlledOpen({ prop, send }) {
        const open = prop('open')
        if (open !== undefined)
          send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
      },
    },
  },
})
