import type { ModalSchema } from './modal.types'
import { ariaHidden } from '@zag-js/aria-hidden'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
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
      closeOnEscape: true,
      closeOnInteractOutside: true,
      restoreFocus: true,
      initialFocusEl: () => dom.getContentEl(scope),
      ...props,
    }
  },

  initialState({ prop }) {
    return prop('open') ? 'open' : 'closed'
  },

  states: {
    open: {
      entry: ['focusContent', 'hideNonModals'],
      effects: ['trackDismissableElement', 'trapFocus', 'preventScroll'],
      on: {
        CLOSE: { target: 'closed', actions: ['restoreNonModals'] },
        TOGGLE: { target: 'closed', actions: ['restoreNonModals'] },
      },
    },
    closed: {
      on: {
        OPEN: { target: 'open', actions: ['hideNonModals'] },
        TOGGLE: { target: 'open', actions: ['hideNonModals'] },
      },
    },
  },

  implementations: {
    actions: {
      focusContent({ scope }) {
        const contentEl = dom.getContentEl(scope)
        contentEl?.focus()
      },
      hideNonModals({ scope }) {
        const nonModals = dom.getNonModals(scope)
        nonModals.forEach(el => el.setAttribute('aria-hidden', 'true'))
      },
      restoreNonModals({ scope }) {
        const hiddenNonModals = dom.getHiddenNonModals(scope)
        hiddenNonModals.forEach(el => el.removeAttribute('aria-hidden'))
      },
    },

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
        const contentEl = dom.getContentEl(scope)
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
  },
})
