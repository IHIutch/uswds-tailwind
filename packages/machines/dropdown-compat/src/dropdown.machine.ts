import type { DropdownSchema } from './dropdown.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<DropdownSchema>({
  props({ props }) {
    return {
      dir: 'ltr',
      ...props,
    }
  },

  initialState({ prop }) {
    const open = prop('open') ?? prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  watch({ track, send, prop }) {
    track([() => prop('open')], () => {
      const controlled = prop('open')
      if (controlled === undefined)
        return
      send({ type: controlled ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
    })
  },

  states: {
    open: {
      entry: ['invokeOnOpen'],
      on: {
        'CLOSE': { target: 'closed', actions: ['invokeOnClose'] },
        'TOGGLE': { target: 'closed', actions: ['invokeOnClose'] },
        'CONTROLLED.CLOSE': { target: 'closed' },
      },
    },
    closed: {
      entry: [],
      on: {
        'OPEN': { target: 'open', actions: ['invokeOnOpen'] },
        'TOGGLE': { target: 'open', actions: ['invokeOnOpen'] },
        'CONTROLLED.OPEN': { target: 'open' },
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
    },
  },
})
