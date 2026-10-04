import type { ModalSchema } from './modal.types'
import { ariaHidden } from '@zag-js/aria-hidden'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { getInitialFocus, query, raf } from '@zag-js/dom-query'
import { trapFocus } from '@zag-js/focus-trap'
import { preventBodyScroll } from '@zag-js/remove-scroll'
import * as dom from './modal.dom'

export const machine = createMachine<ModalSchema>({
  props({ props }) {
    return {
      forceAction: false,
      ...props,
    }
  },

  initialState({ prop }) {
    return prop('open') ? 'open' : 'closed'
  },

  context({ bindable }) {
    return {
      rendered: bindable<{ title: boolean, description: boolean }>(() => ({
        defaultValue: { title: true, description: true },
      })),
      triggerIndex: bindable<number | null>(() => ({
        defaultValue: null,
      })),
    }
  },

  watch({ track, action, prop }) {
    track([() => prop('open')], () => {
      action(['toggleVisibility'])
    })
  },

  states: {
    open: {
      entry: ['checkRenderedElements'],
      effects: ['trackDismissableElement', 'preventScroll', 'hideContentBelow', 'trapFocus'],
      on: {
        'CONTROLLED.CLOSE': {
          target: 'closed',
        },
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
        'TOGGLE': [
          {
            guard: 'isOpenControlled',
            actions: ['invokeOnClose'],
          },
          {
            target: 'closed',
            actions: ['invokeOnClose'],
          },
        ],
      },
    },

    closed: {
      on: {
        'CONTROLLED.OPEN': {
          target: 'open',
        },
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
        'TOGGLE': [
          {
            guard: 'isOpenControlled',
            actions: ['invokeOnOpen', 'setTriggerIndex'],
          },
          {
            target: 'open',
            actions: ['invokeOnOpen', 'setTriggerIndex'],
          },
        ],
      },
    },
  },

  implementations: {
    guards: {
      isOpenControlled: ({ prop }) => prop('open') !== undefined,
    },

    effects: {
      trackDismissableElement({ scope, send, prop }) {
        const getContentEl = () => dom.getContentEl(scope)
        return trackDismissableElement(getContentEl, {
          defer: true,
          pointerBlocking: true,
          layerStyleTargets: [() => dom.getBackdropEl(scope), () => dom.getPositionerEl(scope)],
          exclude: [dom.getTriggerEl(scope), ...dom.getTriggerEls(scope)].filter(Boolean) as HTMLElement[],
          onInteractOutside(event) {
            if (prop('forceAction')) {
              event.preventDefault()
            }
          },
          onEscapeKeyDown(event) {
            if (prop('forceAction')) {
              event.preventDefault()
            }
          },
          onDismiss() {
            send({ type: 'CLOSE' })
          },
        })
      },

      preventScroll({ scope }) {
        return preventBodyScroll(scope.getDoc())
      },
      hideContentBelow({ scope }) {
        const getElements = () => [dom.getContentEl(scope)]
        return ariaHidden(getElements, { defer: true })
      },

      trapFocus({ scope, context }) {
        return trapFocus(() => dom.getContentEl(scope), {
          preventScroll: true,
          // Returns focus to the trigger that opened the modal, else the first trigger, else whatever was
          // focused before. A WebKit click does not focus the button, so the trap alone would land on body.
          setReturnFocus: el => dom.getActiveTriggerEl(scope, context.get('triggerIndex')) ?? el,
          initialFocus: () => getInitialFocus({
            root: dom.getContentEl(scope),
            getInitialEl: () => query(dom.getContentEl(scope), '[data-focus]'),
          }),
        })
      },
    },

    actions: {
      checkRenderedElements({ context, scope }) {
        raf(() => {
          context.set('rendered', {
            title: !!dom.getTitleEl(scope),
            description: !!dom.getDescriptionEl(scope),
          })
        })
      },
      setTriggerIndex({ context, event }) {
        context.set('triggerIndex', event.type === 'TOGGLE' ? event.index ?? null : null)
      },
      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },
      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
      toggleVisibility({ prop, send }) {
        const open = prop('open')
        if (open !== undefined)
          send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
      },
    },
  },
})
