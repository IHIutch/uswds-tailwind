import type { Params } from '@zag-js/core'
import type { Placement, TooltipSchema } from './tooltip.types'
import type { PositionStyles } from './tooltip.utils'
import { createMachine } from '@zag-js/core'
import { addDomEvent, raf } from '@zag-js/dom-query'
import * as dom from './tooltip.dom'
import { computePosition } from './tooltip.utils'

function reposition({ scope, context, prop }: Params<TooltipSchema>): (() => void) | undefined {
  const measure = (): (() => void) | undefined => {
    const body = dom.getContentEl(scope)
    const trigger = dom.getTriggerEl(scope)
    if (!body || !trigger)
      return raf(measure)

    const result = computePosition(body, trigger, prop('placement'), scope.getWin())
    if (result) {
      context.set('resolvedPlacement', result.placement)
      context.set('styles', result.styles)
      context.set('wrap', result.wrap)
    }
    return undefined
  }

  if (!dom.getContentEl(scope) || !dom.getTriggerEl(scope))
    return raf(measure)

  let cancelled = false
  queueMicrotask(() => {
    if (!cancelled)
      measure()
  })
  return () => {
    cancelled = true
  }
}

export const machine = createMachine<TooltipSchema>({
  props({ props }) {
    return { ...props, placement: props.placement ?? 'top' }
  },

  initialState({ prop }) {
    return (prop('open') ?? prop('defaultOpen')) ? 'open' : 'closed'
  },

  watch({ track, prop, action }) {
    track([() => prop('open')], () => action(['syncControlledOpen']))
  },

  context({ bindable }) {
    return {
      resolvedPlacement: bindable<Placement | null>(() => ({ defaultValue: null })),
      revealed: bindable(() => ({ defaultValue: false })),
      wrap: bindable(() => ({ defaultValue: false })),
      styles: bindable<PositionStyles | null>(() => ({ defaultValue: null })),
    }
  },

  states: {
    closed: {
      entry: ['clearVisibility'],
      on: {
        'SHOW': [
          { guard: 'isOpenControlled', actions: ['invokeOnOpen'] },
          { target: 'open', actions: ['invokeOnOpen'] },
        ],
        'CONTROLLED.OPEN': { target: 'open' },
      },
    },
    open: {
      effects: ['reposition', 'trackEscape', 'waitForReveal'],
      on: {
        'SHOW': { target: 'open', reenter: true },
        'HIDE': [
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
      clearVisibility({ context }) {
        context.set('wrap', false)
        context.set('revealed', false)
      },
    },
    effects: {
      reposition,
      waitForReveal({ context, scope }) {
        const id = scope.getWin().setTimeout(() => context.set('revealed', true), 20)
        return () => scope.getWin().clearTimeout(id)
      },
      trackEscape({ scope, send }) {
        return addDomEvent(scope.getDoc(), 'keydown', (event) => {
          if (event.key === 'Escape' && !event.shiftKey && !event.altKey && !event.metaKey)
            send({ type: 'HIDE' })
        })
      },
    },
  },
})
