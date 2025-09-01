import type { ModalSchema } from './modal.types'
import { ariaHidden } from '@zag-js/aria-hidden'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { trapFocus } from '@zag-js/focus-trap'
import { preventBodyScroll } from '@zag-js/remove-scroll'
import * as dom from './modal.dom'

export const machine = createMachine<ModalSchema>({
  props({ props }) {
    return {
      role: 'dialog',
      modal: true,
      trapFocus: true,
      preventScroll: true,
      closeOnEscape: true,
      restoreFocus: true,
      forceAction: false,
      ...props,
    }
  },

  initialState({ prop }) {
    return prop('open') ? 'open' : 'closed'
  },

  context({ bindable, prop }) {
    return {
      isOpen: bindable(() => ({ defaultValue: prop('open') })),
    }
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
        const positionerEl = dom.getPositionerEl(scope)
        const backdropEl = dom.getBackdropEl(scope)
        const nonModals = Array.from(scope.getDoc().body.children).filter(
          el => el !== positionerEl && el !== backdropEl && !el.hasAttribute('aria-hidden'),
        )
        nonModals.forEach((el) => {
          el.setAttribute('aria-hidden', 'true')
          el.setAttribute('data-modal-hidden', 'true')
        })
      },
      restoreNonModals({ scope }) {
        const hiddenNonModals = Array.from(scope.getDoc().querySelectorAll('[data-modal-hidden]'))
        hiddenNonModals.forEach((el) => {
          el.removeAttribute('aria-hidden')
          el.removeAttribute('data-modal-hidden')
        })
      },
    },

    effects: {
      trackDismissableElement({ scope, send, prop }) {
        const getContentEl = () => dom.getContentEl(scope)
        return trackDismissableElement(getContentEl, {
          // defer: true,
          // pointerBlocking: prop('modal'),
          onEscapeKeyDown(event) {
            prop('onEscapeKeyDown')?.(event)
            if (prop('forceAction')) {
              event.preventDefault()
            }
          },
          onDismiss() {
            send({ type: 'CLOSE' })
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
          initialFocus: contentEl || undefined,
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
