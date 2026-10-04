import type { DropdownSchema } from './dropdown.types'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import * as dom from './dropdown.dom'

export const machine = createMachine<DropdownSchema>({
  initialState({ prop }) {
    const open = prop('open') ?? prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  watch({ track, prop, action }) {
    track([() => prop('open')], () => {
      action(['syncControlledOpen'])
    })
  },

  states: {
    closed: {
      on: {
        'TRIGGER.CLICK': [
          { guard: 'isOpenControlled', actions: ['invokeOnOpen'] },
          { target: 'open', actions: ['invokeOnOpen'] },
        ],
        'OPEN': [
          { guard: 'isOpenControlled', actions: ['invokeOnOpen'] },
          { target: 'open', actions: ['invokeOnOpen'] },
        ],
        'CONTROLLED.OPEN': { target: 'open' },
      },
    },
    open: {
      effects: ['trackDismissableElement'],
      on: {
        'TRIGGER.CLICK': [
          { guard: 'isOpenControlled', actions: ['invokeOnClose'] },
          { target: 'closed', actions: ['invokeOnClose'] },
        ],
        'ESCAPE': [
          { guard: 'isOpenControlled', actions: ['invokeOnClose', 'focusTrigger'] },
          { target: 'closed', actions: ['invokeOnClose', 'focusTrigger'] },
        ],
        'ITEM.CLICK': [
          { guard: 'isOpenControlled', actions: ['invokeOnSelect', 'invokeOnClose', 'focusTrigger'] },
          { target: 'closed', actions: ['invokeOnSelect', 'invokeOnClose', 'focusTrigger'] },
        ],
        'CLOSE': [
          { guard: 'isOpenControlled', actions: ['invokeOnClose'] },
          { target: 'closed', actions: ['invokeOnClose'] },
        ],
        'CONTROLLED.CLOSE': { target: 'closed' },
      },
    },
  },

  implementations: {
    guards: {
      isOpenControlled: ({ prop }) => prop('open') !== undefined,
    },

    effects: {
      trackDismissableElement({ scope, send }) {
        return trackDismissableElement(() => dom.getContentEl(scope), {
          exclude: [dom.getTriggerEl(scope)],
          onEscapeKeyDown(event) {
            event.preventDefault()
            send({ type: 'ESCAPE' })
          },
          onDismiss() {
            send({ type: 'CLOSE' })
          },
        })
      },
    },

    actions: {
      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },
      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
      invokeOnSelect({ prop, event }) {
        if (event.value !== undefined)
          prop('onItemSelect')?.({ value: event.value })
      },
      syncControlledOpen({ prop, send }) {
        const open = prop('open')
        if (open !== undefined)
          send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
      },
      focusTrigger({ scope }) {
        queueMicrotask(() => {
          dom.getTriggerEl(scope)?.focus({ preventScroll: true })
        })
      },
    },
  },
})
