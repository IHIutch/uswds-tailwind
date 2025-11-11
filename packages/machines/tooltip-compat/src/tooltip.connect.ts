import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { TooltipApi, TooltipSchema } from './tooltip.types'
import { parts } from './tooltip.anatomy'
import * as dom from './tooltip.dom'

export function connect<T extends PropTypes>(
  service: Service<TooltipSchema>,
  normalize: NormalizeProps<T>,
): TooltipApi<T> {
  const { context, send, state, scope } = service

  const isOpen = state.matches('open')

  return {
    isOpen,
    placement: context.get('placement'),

    setPlacement(placement) {
      send({ type: 'SET_PLACEMENT', placement })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'aria-describedby': dom.getContentId(scope),
        'tabIndex': 0,
        onMouseEnter() {
          send({ type: 'OPEN' })
        },
        onMouseLeave() {
          send({ type: 'CLOSE' })
        },
        onFocus() {
          send({ type: 'OPEN' })
        },
        onBlur() {
          send({ type: 'CLOSE' })
        },
        onKeyDown(event) {
          if (event.key === 'Escape') {
            send({ type: 'CLOSE' })
          }
        },
      })
    },

    getContentProps() {
      const { x, y } = context.get('position')
      const placement = context.get('placement')

      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'role': 'tooltip',
        'aria-hidden': !isOpen,
        'data-state': isOpen ? 'open' : 'closed',
        'data-placement': context.get('placement'),
        'hidden': !isOpen,
        'style': {
          'position': 'absolute',
          'left': 0,
          'top': 0,
          'transform': `translate(${x}px, ${y}px)`,
          '--caret-top': placement === 'left' || placement === 'right' ? '50%' : placement === 'top' ? '100%' : '0',
          '--caret-left': placement === 'top' || placement === 'bottom' ? '50%' : placement === 'left' ? '100%' : '0',
          '--caret-translate': '-50%',
        },
      })
    },
  }
}
