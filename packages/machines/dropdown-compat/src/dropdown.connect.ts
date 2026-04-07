import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { DropdownApi, DropdownSchema } from './dropdown.types'
import { parts } from './dropdown.anatomy'
import * as dom from './dropdown.dom'

export function connect<T extends PropTypes>(
  service: Service<DropdownSchema>,
  normalize: NormalizeProps<T>,
): DropdownApi<T> {
  const { state, send, scope } = service

  const open = state.matches('open')

  return {
    open,
    setOpen(next) {
      if (open === next)
        return
      send({ type: next ? 'OPEN' : 'CLOSE' })
    },

    getRootProps() {
      // USWDS adds an onClick event to the <body>. That seems redundant to the onBlur event, so its been omitted (https://github.com/uswds/uswds/blob/develop/packages/usa-language-selector/src/index.js#L64)
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
        // USWDS uses onFocusout. However, in React onFocusout is not supported and onBlur === onFocusout
        onBlur(event) {
          const related = event.relatedTarget
          const root = dom.getRootEl(scope)
          if (root && !root.contains(related)) {
            send({ type: 'CLOSE' })
          }
        },
        onKeyDown(event) {
          switch (event.key) {
            case 'Escape': {
              event.preventDefault()
              send({ type: 'CLOSE' })
              dom.getTriggerEl(scope)?.focus()
              break
            }
          }
        },
      })
    },

    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'role': 'button',
        'aria-controls': dom.getContentId(scope),
        'aria-expanded': open ? 'true' : 'false',
        'data-state': open ? 'open' : 'closed',
        onClick() {
          send({ type: 'TOGGLE' })
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
      })
    },

    getItemProps() {
      return normalize.element({
        ...parts.item.attrs,
        onClick() {
          send({ type: 'CLOSE' })
          dom.getTriggerEl(scope)?.focus()
        },
      })
    },

    getIndicatorProps() {
      return normalize.element({
        ...parts.indicator.attrs,
        'data-state': open ? 'open' : 'closed',
      })
    },
  }
}
