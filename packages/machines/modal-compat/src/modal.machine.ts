import type { ModalSchema } from './modal.types'
import { createMachine } from '@zag-js/core'
import { addDomEvent, raf } from '@zag-js/dom-query'
import * as dom from './modal.dom'

const FOCUSABLE
  = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

function getScrollbarWidth(doc: Document) {
  const outer = doc.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  ;(outer.style as any).msOverflowStyle = 'scrollbar'
  doc.body.appendChild(outer)

  const inner = doc.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

/* -----------------------------------------------------------------------------
 * Machine
 * ----------------------------------------------------------------------------- */

export const machine = createMachine<ModalSchema>({
  props({ props }) {
    return {
      forceAction: false,
      preventScroll: true,
      trapFocus: true,
      modal: true,
      role: 'dialog',
      restoreFocus: true,
      defaultOpen: false,
      ...props,
    }
  },

  // Modals start hidden by default. Honor controlled `open` at mount,
  // otherwise <Modal open={true}> renders closed on first paint.
  initialState({ prop }) {
    if (prop('open') !== undefined) {
      return prop('open') ? 'open' : 'closed'
    }
    return prop('defaultOpen') ? 'open' : 'closed'
  },

  context() {
    return {}
  },

  // Watch for controlled `open` prop changes
  // Mirrors Zag pattern for controlled components
  watch({ prop, send }) {
    const open = prop('open')
    if (open === undefined)
      return
    send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
  },

  states: {
    open: {
      // Entry: focus initial element
      entry: ['focusInitialEl'],
      effects: ['restoreFocus', 'trapFocus', 'preventScroll', 'hideContentBelow'],
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
            actions: ['invokeOnOpen'],
          },
          {
            target: 'open',
            actions: ['invokeOnOpen'],
          },
        ],
      },
    },
  },

  implementations: {
    guards: {
      // Controlled component: prop("open") is defined
      isOpenControlled: ({ prop }) => prop('open') !== undefined,
    },

    effects: {
      restoreFocus({ prop, scope }) {
        if (!prop('restoreFocus'))
          return

        const doc = scope.getDoc()
        const previouslyFocusedEl = doc.activeElement as HTMLElement | null

        return () => {
          if (previouslyFocusedEl && typeof previouslyFocusedEl.focus === 'function') {
            raf(() => {
              previouslyFocusedEl.focus()
            })
          }
        }
      },

      trapFocus({ prop, scope }) {
        if (!prop('trapFocus'))
          return

        const contentEl = dom.getContentEl(scope)
        if (!contentEl)
          return

        function handleKeyDown(event: KeyboardEvent) {
          if (event.key !== 'Tab')
            return

          const focusableElements = Array.from(
            contentEl!.querySelectorAll<HTMLElement>(FOCUSABLE),
          )

          if (focusableElements.length === 0) {
            event.preventDefault()
            return
          }

          const firstTabStop = focusableElements[0]!
          const lastTabStop = focusableElements[focusableElements.length - 1]!
          const doc = scope.getDoc()
          const active = doc.activeElement

          if (event.shiftKey) {
            // Shift+Tab: tabBack
            //   if (activeElement() === firstTabStop) → wrap to lastTabStop
            //   else if (!focusableElements.includes(activeElement())) → firstTabStop
            if (active === firstTabStop) {
              event.preventDefault()
              lastTabStop.focus()
            }
            else if (!focusableElements.includes(active as HTMLElement)) {
              // Focus is on container itself, not a focusable element
              event.preventDefault()
              firstTabStop.focus()
            }
          }
          else {
            // Tab: tabAhead
            //   if (activeElement() === lastTabStop) → wrap to firstTabStop
            if (active === lastTabStop) {
              event.preventDefault()
              firstTabStop.focus()
            }
          }
        }

        return addDomEvent(contentEl, 'keydown', handleKeyDown)
      },

      preventScroll({ prop, scope }) {
        if (!prop('preventScroll'))
          return

        const doc = scope.getDoc()
        const { body } = doc
        const win = doc.defaultView

        if (!win)
          return

        //   INITIAL_BODY_PADDING = getComputedStyle(body).paddingRight
        //   TEMPORARY_BODY_PADDING = parseInt(initial) + parseInt(scrollbarWidth) + "px"
        const initialPadding = win.getComputedStyle(body).getPropertyValue('padding-right')
        const scrollbarWidth = getScrollbarWidth(doc)
        const temporaryPadding = `${
          Number.parseInt(initialPadding.replace(/px/, ''), 10) + scrollbarWidth
        }px`

        body.style.paddingRight = temporaryPadding

        return () => {
          body.style.removeProperty('padding-right')
        }
      },

      hideContentBelow({ prop, scope }) {
        if (!prop('modal'))
          return

        const doc = scope.getDoc()
        const contentEl = dom.getContentEl(scope)
        if (!contentEl)
          return

        // Find the top-level ancestor of our modal (the element directly under body)
        let modalAncestor: HTMLElement | null = contentEl
        while (modalAncestor && modalAncestor.parentElement !== doc.body) {
          modalAncestor = modalAncestor.parentElement as HTMLElement | null
        }

        //   "body > *:not(.usa-modal-wrapper):not([aria-hidden])"
        const hiddenElements: HTMLElement[] = []
        const bodyChildren = doc.body.children

        for (let i = 0; i < bodyChildren.length; i++) {
          const child = bodyChildren[i] as HTMLElement
          if (child === modalAncestor)
            continue
          if (child.getAttribute('aria-hidden') === 'true')
            continue

          child.setAttribute('aria-hidden', 'true')
          child.setAttribute('data-modal-hidden', '')
          hiddenElements.push(child)
        }

        return () => {
          //   document.querySelectorAll(NON_MODALS_HIDDEN).forEach(nonModal => {
          //     nonModal.removeAttribute("aria-hidden");
          //     nonModal.removeAttribute(NON_MODAL_HIDDEN_ATTRIBUTE);
          //   })
          for (const el of hiddenElements) {
            el.removeAttribute('aria-hidden')
            el.removeAttribute('data-modal-hidden')
          }
        }
      },
    },

    actions: {
      focusInitialEl({ prop, scope }) {
        raf(() => {
          // Consumer can override via prop
          const customFocusEl = prop('initialFocusEl')?.()
          if (customFocusEl) {
            customFocusEl.focus()
            return
          }

          const contentEl = dom.getContentEl(scope)
          if (!contentEl)
            return

          const dataFocusEl = contentEl.querySelector<HTMLElement>('[data-focus]')
          if (dataFocusEl) {
            dataFocusEl.focus()
            return
          }

          // Fallback: focus the content element itself
          contentEl.focus()
        })
      },

      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },

      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
    },
  },
})
