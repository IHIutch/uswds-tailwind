import type { CollapseSchema } from './collapse.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<CollapseSchema>({
  initialState({ prop }) {
    const open = prop('open') || prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  context() {
    return {}
  },

  watch({ track, prop, action }) {
    track([() => prop('open')], () => {
      action(['toggleVisibility'])
    })
  },

  states: {
    closed: {
      on: {
        'TOGGLE': [
          {
            guard: 'isOpenControlled',
            actions: ['invokeOnOpenChange'],
          },
          {
            target: 'open',
            actions: ['invokeOnOpenChange'],
          },
        ],
        'controlled.open': {
          target: 'open',
        },
      },
    },
    open: {
      on: {
        'TOGGLE': [
          {
            guard: 'isOpenControlled',
            actions: ['invokeOnOpenChange'],
          },
          {
            target: 'closed',
            actions: ['invokeOnOpenChange'],
          },
        ],
        'controlled.close': {
          target: 'closed',
        },
      },
    },
  },

  implementations: {
    guards: {
      isOpenControlled: ({ prop }) => prop('open') !== undefined,
    },

    actions: {
      invokeOnOpenChange: ({ prop, state }) => {
        const nextOpen = !state.matches('open')
        prop('onOpenChange')?.({ open: nextOpen })
      },
      // Controlled mode: sync machine state to match open prop
      toggleVisibility: ({ prop, send }) => {
        send({ type: prop('open') ? 'controlled.open' : 'controlled.close' })
      },
    },
  },
})
