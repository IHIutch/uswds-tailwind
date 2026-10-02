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

    setOpen(nextOpen) {
      send({ type: nextOpen ? 'OPEN' : 'CLOSE' })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-state': open ? 'open' : 'closed',
      })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'type': 'button',
        'aria-expanded': open,
        'aria-controls': dom.getContentId(scope),
        'data-state': open ? 'open' : 'closed',
        onClick(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'TRIGGER.CLICK' })
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

    getItemProps(itemProps) {
      return normalize.element({
        ...parts.item.attrs,
        'data-value': itemProps.value,
      })
    },

    getItemLinkProps(itemProps) {
      return normalize.element({
        onClick(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'ITEM.CLICK', value: itemProps.value })
        },
      })
    },
  }
}
