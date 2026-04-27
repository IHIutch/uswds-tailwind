import type { DropdownSchema } from './dropdown.types'
import { createMachine } from '@zag-js/core'
import { addDomEvent, raf } from '@zag-js/dom-query'
import * as dom from './dropdown.dom'

export const machine = createMachine<DropdownSchema>({
  props({ props }) {
    return {
      closeOnSelect: true,
      ...props,
    }
  },

  initialState() {
    return 'closed'
  },

  context() {
    return {}
  },

  states: {
    closed: {
      on: {
        TRIGGER_CLICK: { target: 'open', actions: ['invokeOnOpen'] },
        OPEN: { target: 'open', actions: ['invokeOnOpen'] },
      },
    },
    open: {
      effects: ['trackInteractOutside'],
      on: {
        TRIGGER_CLICK: { target: 'closed', actions: ['invokeOnClose'] },
        ESCAPE: { target: 'closed', actions: ['focusTrigger', 'invokeOnClose'] },
        FOCUS_OUTSIDE: { target: 'closed', actions: ['invokeOnClose'] },
        CLOSE: { target: 'closed', actions: ['invokeOnClose'] },
        // Item click — close if closeOnSelect is true, otherwise stay open
        ITEM_CLICK: [
          { guard: 'closeOnSelect', target: 'closed', actions: ['invokeOnSelect', 'invokeOnClose'] },
          { actions: ['invokeOnSelect'] },
        ],
      },
    },
  },

  implementations: {
    guards: {
      closeOnSelect({ prop }) {
        return !!prop('closeOnSelect')
      },
    },
    effects: {
      trackInteractOutside({ scope, send }) {
        const doc = scope.getDoc()
        return addDomEvent(doc, 'click', (event) => {
          const rootEl = dom.getRootEl(scope)
          if (rootEl && !rootEl.contains(event.target as Node)) {
            send({ type: 'CLOSE' })
          }
        })
      },
    },
    actions: {
      focusTrigger({ scope }) {
        raf(() => dom.focusTriggerEl(scope))
      },
      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },
      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
      invokeOnSelect({ prop, event }) {
        prop('onSelect')?.({ value: (event as any).value })
      },
    },
  },
})
