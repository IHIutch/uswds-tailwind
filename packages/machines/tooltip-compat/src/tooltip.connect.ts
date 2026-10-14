import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { TooltipApi, TooltipSchema } from './tooltip.types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './tooltip.anatomy'
import * as dom from './tooltip.dom'

export function connect<T extends PropTypes>(service: Service<TooltipSchema>, normalize: NormalizeProps<T>): TooltipApi<T> {
  const { context, prop, scope, send, state } = service

  const open = state.matches('open')
  const visible = context.get('revealed')
  const currentPlacement = context.get('currentPlacement')

  const triggerId = dom.getTriggerId(scope)
  const contentId = dom.getContentId(scope)

  return {
    open,
    visible,
    placement: currentPlacement,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
        onMouseLeave() {
          send({ type: 'hide' })
        },
      })
    },

    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'id': triggerId,
        'aria-describedby': contentId,
        'tabIndex': 0,
        'data-placement': prop('placement'),
        onMouseOver() {
          send({ type: 'show' })
        },
        onFocus() {
          send({ type: 'show' })
        },
        onBlur() {
          send({ type: 'hide' })
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': contentId,
        'role': 'tooltip',
        'aria-hidden': open ? 'false' : 'true',
        'data-state': open ? 'open' : 'closed',
        'data-visible': dataAttr(visible),
        'data-placement': currentPlacement ?? undefined,
        'style': {
          '--arrow-offset': '-50%',
        },
      })
    },
  }
}
