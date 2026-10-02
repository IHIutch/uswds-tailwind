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
  const resolvedPlacement = context.get('resolvedPlacement')

  const triggerId = dom.getTriggerId(scope)
  const contentId = dom.getContentId(scope)

  return {
    open,
    visible,
    placement: resolvedPlacement,
    setOpen(nextOpen) {
      send({ type: nextOpen ? 'SHOW' : 'HIDE' })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
        onMouseLeave() {
          send({ type: 'HIDE' })
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
          send({ type: 'SHOW' })
        },
        onFocus(event) {
          if (!dom.isOwnTriggerEvent(event))
            return
          send({ type: 'SHOW' })
        },
        onBlur(event) {
          if (!dom.isOwnTriggerEvent(event))
            return
          send({ type: 'HIDE' })
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
        'data-placement': resolvedPlacement ?? undefined,
        'data-wrap': dataAttr(context.get('wrap')),
        'style': {
          '--tooltip-top': context.get('styles')?.top ?? undefined,
          '--tooltip-bottom': context.get('styles')?.bottom ?? undefined,
          '--tooltip-left': context.get('styles')?.left ?? undefined,
          '--tooltip-right': context.get('styles')?.right ?? undefined,
          '--tooltip-margin': context.get('styles')?.margin ?? undefined,
        },
      })
    },
  }
}
