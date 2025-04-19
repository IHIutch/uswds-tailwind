import type { ModalSchema } from './modal.types'
import { ariaHidden } from '@zag-js/aria-hidden'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { getComputedStyle, raf } from '@zag-js/dom-query'
import { trapFocus } from '@zag-js/focus-trap'
import { preventBodyScroll } from '@zag-js/remove-scroll'
import * as dom from './modal.dom'

export const machine = createMachine<ModalSchema>({
  props({ props, scope }) {
    return {
      role: 'dialog',
      modal: true,
      trapFocus: true,
      preventScroll: true,
      closeOnInteractOutside: true,
      closeOnEscape: true,
      restoreFocus: true,
      initialFocusEl: () => dom.getContentEl(scope),
      ...props,
    }
  },

  initialState({ prop }) {
    const open = prop('open') || prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  context({ bindable }) {
    return {
      rendered: bindable<{ title: boolean, description: boolean }>(() => ({
        defaultValue: { title: true, description: true },
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
      effects: ['trackDismissableElement', 'trapFocus', 'preventScroll'],
      on: {
        CLOSE: {
          target: 'closed',
          actions: ['invokeOnClose'],
        },
        TOGGLE: {
          target: 'closed',
          actions: ['invokeOnClose'],
        },
      },
    },

    closed: {
      on: {
        OPEN: {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
        TOGGLE: {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
      },
    },
  },

  implementations: {
    effects: {
      trackDismissableElement({ scope, send, prop }) {
        const getContentEl = () => dom.getContentEl(scope)
        return trackDismissableElement(getContentEl, {
          defer: true,
          pointerBlocking: prop('modal'),
          onInteractOutside(event) {
            prop('onInteractOutside')?.(event)
            if (!prop('closeOnInteractOutside')) {
              event.preventDefault()
            }
          },
          onEscapeKeyDown(event) {
            prop('onEscapeKeyDown')?.(event)
            if (!prop('closeOnEscape')) {
              event.preventDefault()
            }
          },
          onDismiss() {
            send({ type: 'CLOSE', src: 'interact-outside' })
          },
        })
      },

      preventScroll({ scope, prop }) {
        if (!prop('preventScroll'))
          return
        return preventBodyScroll(scope.getDoc())
      },

      trapFocus({ scope, prop }) {
        if (!prop('trapFocus') || !prop('modal'))
          return
        const contentEl = () => dom.getContentEl(scope)
        return trapFocus(contentEl, {
          preventScroll: true,
          returnFocusOnDeactivate: !!prop('restoreFocus'),
          initialFocus: prop('initialFocusEl'),
        })
      },

      hideContentBelow({ scope, prop }) {
        if (!prop('modal'))
          return
        const getElements = () => [dom.getContentEl(scope)]
        return ariaHidden(getElements, { defer: true })
      },
    },

    actions: {
      checkRenderedElements({ context, scope }) {
        context.set('rendered', {
          title: !!dom.getTitleEl(scope),
          description: !!dom.getDescriptionEl(scope),
        })
      },

      syncZIndex({ scope }) {
        raf(() => {
          const contentEl = dom.getContentEl(scope)
          if (!contentEl)
            return

          const styles = getComputedStyle(contentEl)
          const elems = [dom.getPositionerEl(scope), dom.getBackdropEl(scope)]
          elems.forEach((node) => {
            node?.style.setProperty('--z-index', styles.zIndex)
          })
        })
      },

      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },

      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },

      toggleVisibility({ prop, send }) {
        send({
          type: prop('open') ? 'CLOSE' : 'OPEN',
        })
      },
    },
  },
})
