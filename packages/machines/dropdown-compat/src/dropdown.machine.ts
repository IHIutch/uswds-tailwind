import type { DropdownSchema } from './dropdown.types'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { getPlacement } from '@zag-js/popper'
import * as dom from './dropdown.dom'

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
      effects: ['trackInteractOutside', 'trackPositioning'],
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
      // closeRootMenu({ refs }) {
      //   closeRootMenu({ parent: refs.get('parent') })
      // },
    },
    effects: {
      trackPositioning({ context, prop, scope }) {
        const positioning = {
          ...prop('positioning'),
        }
        context.set('currentPlacement', positioning.placement!)
        const getContentEl = () => dom.getContentEl(scope)
        const getTriggerEl = () => dom.getTriggerEl(scope)

        return getPlacement(getTriggerEl, getContentEl, {
          ...positioning,
          gutter: 0,
          defer: true,
          onComplete(data) {
            context.set('currentPlacement', data.placement)
          },
        })
      },
      trackInteractOutside({ scope, prop, send }) {
        const getContentEl = () => dom.getContentEl(scope)
        const restoreFocus = true
        return trackDismissableElement(getContentEl, {
          defer: true,
          exclude: [dom.getTriggerEl(scope)],
          onInteractOutside: prop('onInteractOutside'),
          onFocusOutside(event) {
            prop('onFocusOutside')?.(event)

            // const target = getEventTarget(event.detail.originalEvent)
            // const isWithinContextTrigger = contains(dom.getContextTriggerEl(scope), target)
            // if (isWithinContextTrigger) {
            //   event.preventDefault()
            //   return
            // }
          },
          onEscapeKeyDown(event) {
            prop('onEscapeKeyDown')?.(event)
            // closeRootMenu({ parent: refs.get('parent') })
          },
          onPointerDownOutside(event) {
            prop('onPointerDownOutside')?.(event)

            // const target = getEventTarget(event.detail.originalEvent)
            // const isWithinContextTrigger = contains(dom.getContextTriggerEl(scope), target)
            // if (isWithinContextTrigger && event.detail.contextmenu) {
            //   event.preventDefault()
            //   return
            // }
            // restoreFocus = !event.detail.focusable
          },
          onDismiss() {
            send({ type: 'CLOSE', src: 'interact-outside', restoreFocus })
          },
        })
      },
    },
  },
})
