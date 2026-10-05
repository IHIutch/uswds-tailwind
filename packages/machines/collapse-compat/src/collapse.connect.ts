import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { CollapseApi, CollapseSchema } from './collapse.types'
import { parts } from './collapse.anatomy'
import * as dom from './collapse.dom'

export function connect<T extends PropTypes>(
  service: Service<CollapseSchema>,
  normalize: NormalizeProps<T>,
): CollapseApi<T> {
  const { state, send, scope } = service
  const open = state.matches('open')

  return {
    open,

    setOpen(nextOpen) {
      if (open === nextOpen)
        return
      send(open ? { type: 'CLOSE' } : { type: 'OPEN' })
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
          event.preventDefault()
          send(open ? { type: 'CLOSE' } : { type: 'OPEN' })
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

    getIndicatorProps() {
      return normalize.element({
        ...parts.indicator.attrs,
        'id': dom.getIndicatorId(scope),
        'data-state': open ? 'open' : 'closed',
      })
    },
  }
}
