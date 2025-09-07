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

  const isOpen = state.matches('open')

  return {
    isOpen,
    setOpen(nextOpen) {
      if (isOpen === nextOpen)
        return
      send({ type: nextOpen ? 'OPEN' : 'CLOSE' })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-state': isOpen ? 'open' : 'closed',
      })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'aria-controls': dom.getContentId(scope),
        'aria-expanded': isOpen ? 'true' : 'false',
        'type': 'button',
        onClick() {
          send({ type: 'TOGGLE' })
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'data-state': isOpen ? 'open' : 'closed',
        'hidden': !isOpen,
      })
    },
  }
}
