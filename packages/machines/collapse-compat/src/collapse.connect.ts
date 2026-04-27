import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { CollapseApi, CollapseSchema } from './collapse.types'
import { parts } from './collapse.anatomy'
import * as dom from './collapse.dom'

export function connect<T extends PropTypes>(
  service: Service<CollapseSchema>,
  normalize: NormalizeProps<T>,
): CollapseApi<T> {
  const { state, send, prop, scope } = service
  const open = state.matches('open')

  return {
    open,

    // Programmatic control — mirrors toggle(button, expanded) call pattern
    setOpen(nextOpen) {
      if (open === nextOpen)
        return
      send({ type: 'TOGGLE' })
    },

    // Mirrors index.js L21: header.classList.toggle(EXPANDED_CLASS)
    // data-state replaces the usa-banner__header--expanded CSS class
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'dir': prop('dir'),
        'data-state': open ? 'open' : 'closed',
      })
    },

    // Mirrors toggle.js L12-24 + index.js L17-18
    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'dir': prop('dir'),
        'type': 'button',
        // Mirrors toggle.js L12: button.setAttribute(EXPANDED, safeExpanded)
        'aria-expanded': open,
        // Mirrors toggle.js L14: button.getAttribute(CONTROLS)
        'aria-controls': dom.getContentId(scope),
        'data-state': open ? 'open' : 'closed',
        // Mirrors index.js L17: event.preventDefault()
        onClick(event: { preventDefault: () => void }) {
          event.preventDefault()
          send({ type: 'TOGGLE' })
        },
      })
    },

    // Mirrors toggle.js L20-24: set/remove hidden on content
    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'dir': prop('dir'),
        // Mirrors toggle.js L22-24: controls.setAttribute(HIDDEN, "") / removeAttribute(HIDDEN)
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
      })
    },
  }
}
