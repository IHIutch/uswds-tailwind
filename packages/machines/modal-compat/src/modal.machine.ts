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
      modal: true,
      trapFocus: true,
      preventScroll: true,
      restoreFocus: true,
      forceAction: false,
      ...props,
    }
  },

  initialState() {
    return 'closed'
  },

  states: {
    open: {
      entry: ['focusContent'],
      effects: ['trackDismissableElement', 'trapFocus', 'preventScroll', 'hideContentBelow'],
      on: {
        CLOSE: { target: 'closed' },
      },
    },
    closed: {
      on: {
        OPEN: { target: 'open' },
      },
    },
  },

  implementations: {
    actions: {
      focusContent({ scope }) {
        const contentEl = dom.getContentEl(scope)
        contentEl?.focus()
      },
    },

    effects: {
      trackDismissableElement({ scope, send, prop }) {
        const getContentEl = () => dom.getContentEl(scope)
        return trackDismissableElement(getContentEl, {
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
      trapFocus({ scope }) {
        const contentEl = dom.getContentEl(scope)
        return trapFocus(contentEl, {
          preventScroll: true,
          initialFocus: contentEl || undefined,
        })
      },
      hideContentBelow({ scope }) {
        const getElements = () => [dom.getContentEl(scope)]
        return ariaHidden(getElements, { defer: true })
      },
    },
  },
})
