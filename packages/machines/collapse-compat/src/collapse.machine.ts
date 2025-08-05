import type { CollapseSchema } from './collapse.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<CollapseSchema>({
  props({ props }) {
    return {
      ...props,
    }
  },

  initialState({ prop }) {
    const open = prop('open') ?? prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  watch({ track, action, prop }) {
    track([() => prop('open')], () => {
      action(['toggleVisibility'])
    })
  },

  states: {
    open: {
      on: {
        CLOSE: { target: 'closed', actions: ['invokeOnClose'] },
        TOGGLE: { target: 'closed', actions: ['invokeOnClose'] },
      },
    },
    closed: {
      on: {
        OPEN: { target: 'open', actions: ['invokeOnOpen'] },
        TOGGLE: { target: 'open', actions: ['invokeOnOpen'] },
      },
    },
  },

  implementations: {
    actions: {
      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },
      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
      toggleVisibility({ prop, send }) {
        if (prop('open') === undefined)
          return
        send({ type: prop('open') ? 'OPEN' : 'CLOSE' })
      },
    },
  },
})
