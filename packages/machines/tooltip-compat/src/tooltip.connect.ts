import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { TooltipApi, TooltipSchema } from './tooltip.types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './tooltip.anatomy'
import * as dom from './tooltip.dom'

const ARROW_FLOATING_STYLE = {
  bottom: 'rotate(45deg)',
  left: 'rotate(135deg)',
  top: 'rotate(225deg)',
  right: 'rotate(315deg)',
} as const

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
    setOpen(nextOpen) {
      send({ type: nextOpen ? 'show' : 'hide' })
    },

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
        onMouseOver(event) {
          if (!dom.isOwnTriggerEvent(event))
            return
          send({ type: 'show' })
        },
        onFocus(event) {
          if (!dom.isOwnTriggerEvent(event))
            return
          send({ type: 'show' })
        },
        onBlur(event) {
          if (!dom.isOwnTriggerEvent(event))
            return
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
          '--arrow-transform': currentPlacement ? ARROW_FLOATING_STYLE[currentPlacement] : undefined,
        },
      })
    },
  }
}
