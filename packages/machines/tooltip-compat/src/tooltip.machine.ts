import type { Params } from '@zag-js/core'
import type { Placement, TooltipSchema } from './tooltip.types'
import { createMachine } from '@zag-js/core'
import { addDomEvent, raf } from '@zag-js/dom-query'
import * as dom from './tooltip.dom'
import { positionTooltip } from './tooltip.utils'

function trackPositioning({ scope, context, prop }: Params<TooltipSchema>): () => void {
  const measure = (): (() => void) | undefined => {
    const content = dom.getContentEl(scope)
    const trigger = dom.getTriggerEl(scope)
    if (!content || !trigger)
      return raf(measure)

    context.set('currentPlacement', positionTooltip(content, trigger, prop('placement'), scope.getWin()))
    return undefined
  }

  return raf(measure)
}

export const machine = createMachine<TooltipSchema>({
  props({ props }) {
    return { ...props, placement: props.placement ?? 'top' }
  },

  initialState({ prop }) {
    return (prop('open') ?? prop('defaultOpen')) ? 'open' : 'closed'
  },

  watch({ track, prop, action }) {
    track([() => prop('open')], () => action(['toggleVisibility']))
  },

  context({ bindable }) {
    return {
      currentPlacement: bindable<Placement | null>(() => ({ defaultValue: null })),
      revealed: bindable(() => ({ defaultValue: false })),
    }
  },

  states: {
    closed: {
      entry: ['clearVisibility'],
      on: {
        'show': [
          { guard: 'isOpenControlled', actions: ['invokeOnOpen'] },
          { target: 'open', actions: ['invokeOnOpen'] },
        ],
        'controlled.open': { target: 'open' },
      },
    },
    open: {
      effects: ['trackPositioning', 'trackEscapeKey', 'waitForReveal'],
      on: {
        'show': { target: 'open', reenter: true },
        'hide': [
          { guard: 'isOpenControlled', actions: ['invokeOnClose'] },
          { target: 'closed', actions: ['invokeOnClose'] },
        ],
        'controlled.close': { target: 'closed' },
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
      toggleVisibility({ prop, send }) {
        const open = prop('open')
        if (open !== undefined)
          send({ type: open ? 'controlled.open' : 'controlled.close' })
      },
      clearVisibility({ context, scope }) {
        dom.getContentEl(scope)?.removeAttribute('data-wrap')
        context.set('revealed', false)
      },
    },
    effects: {
      trackPositioning,
      waitForReveal({ context, scope }) {
        const id = scope.getWin().setTimeout(() => context.set('revealed', true), 20)
        return () => scope.getWin().clearTimeout(id)
      },
      trackEscapeKey({ scope, send }) {
        return addDomEvent(scope.getDoc(), 'keydown', (event) => {
          if (event.key === 'Escape' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey)
            send({ type: 'hide' })
        })
      },
    },
  },
})
