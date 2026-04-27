import type { Service } from '@zag-js/core'
import type { EventKeyMap, NormalizeProps, PropTypes } from '@zag-js/types'
import type { ModalApi, ModalSchema } from './modal.types'
import { getEventKey } from '@zag-js/dom-query'
import { parts } from './modal.anatomy'
import * as dom from './modal.dom'

export function connect<T extends PropTypes>(
  service: Service<ModalSchema>,
  normalize: NormalizeProps<T>,
): ModalApi<T> {
  const { state, send, prop, scope } = service

  const open = state.matches('open')
  const forceAction = !!prop('forceAction')

  return {
    /* ----- State properties ----- */
    open,

    /* ----- Imperative methods ----- */

    setOpen(nextOpen) {
      const currentOpen = state.matches('open')
      if (currentOpen === nextOpen)
        return
      send({ type: nextOpen ? 'OPEN' : 'CLOSE' })
    },

    /* ----- Trigger props ----- */
    //   All [aria-controls="${modalId}"] elements get click → toggleModal.
    //   Anchor triggers get role="button" and preventDefault.
    //
    // In the machine model, the consumer renders a button with these props.
    // a <button> element, not by the machine.
    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'type': 'button',
        // incomplete screen reader support. Preserving the comment's intent:
        // not setting aria-haspopup.
        'aria-controls': dom.getContentId(scope),
        'aria-expanded': open,
        'data-state': open ? 'open' : 'closed',

        onClick() {
          send({ type: 'TOGGLE' })
        },
      })
    },

    /* ----- Backdrop props ----- */
    //   overlayDiv.classList.add(OVERLAY_CLASSNAME)
    // CLOSERS selector (line 19):
    //   ".usa-modal-overlay:not([data-force-action])"
    // So overlay click closes modal UNLESS forceAction is set.
    getBackdropProps() {
      return normalize.element({
        ...parts.backdrop.attrs,
        'id': dom.getBackdropId(scope),
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',

        //   .usa-modal-overlay:not([data-force-action])
        // Overlay is a closer unless force-action is set.
        //   Click on overlay (outside .usa-modal) proceeds to toggle.
        onClick() {
          if (forceAction)
            return
          send({ type: 'CLOSE' })
        },
      })
    },

    /* ----- Content props ----- */
    //   role="dialog", id, aria-labelledby, aria-describedby on wrapper
    // And original element: tabindex="-1" (line 248)
    //
    // In the machine model, we put role=dialog on the content element which is
    // the semantic dialog container. This preserves the accessible dialog
    // boundary while matching the standard pattern. The wrapper/backdrop are
    // presentational.
    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'role': prop('role'),
        'aria-labelledby': dom.getTitleId(scope),
        'aria-describedby': dom.getDescriptionId(scope),
        'tabIndex': -1,
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',

        // When forceAction is false, FocusTrap binds Escape → onMenuClose (lines 151-153)
        // onMenuClose (lines 38-40) calls toggleModal(false)
        //
        // When forceAction is true, no Escape binding (line 149)
        //
        // We handle this in onKeyDown on the content element since that's where
        // the focus trap operates (all focus is within content).
        onKeyDown(event) {
          if (event.defaultPrevented)
            return

          const keymap: EventKeyMap = {
            //   Escape: onMenuClose
            // Only active when !forceAction (lines 148-154)
            Escape(event) {
              if (forceAction)
                return
              send({ type: 'CLOSE' })
              event.preventDefault()
            },
          }

          const key = getEventKey(event)
          const exec = keymap[key]
          exec?.(event)
        },
      })
    },

    /* ----- Title props ----- */
    //   const ariaLabelledBy = baseComponent.getAttribute("aria-labelledby")
    // The title element's ID is used for aria-labelledby on the content.
    getTitleProps() {
      return normalize.element({
        ...parts.title.attrs,
        id: dom.getTitleId(scope),
      })
    },

    /* ----- Description props ----- */
    //   const ariaDescribedBy = baseComponent.getAttribute("aria-describedby")
    // The description element's ID is used for aria-describedby on the content.
    getDescriptionProps() {
      return normalize.element({
        ...parts.description.attrs,
        id: dom.getDescriptionId(scope),
      })
    },

    /* ----- Close trigger props ----- */
    //   ".usa-modal-wrapper *[data-close-modal]"
    // And CLOSERS (line 19) which includes close buttons.
    // Click on close button → toggleModal (via init click binding, line 369)
    // toggleModal identifies it as a closer (lines 113-114):
    //   clickedElement.hasAttribute(CLOSER_ATTRIBUTE) ||
    //   clickedElement.closest(`[${CLOSER_ATTRIBUTE}]`)
    getCloseTriggerProps() {
      return normalize.button({
        ...parts.closeTrigger.attrs,
        'id': dom.getCloseTriggerId(scope),
        'type': 'button',
        'aria-controls': dom.getContentId(scope),
        'data-state': open ? 'open' : 'closed',

        onClick() {
          send({ type: 'CLOSE' })
        },
      })
    },
  }
}
