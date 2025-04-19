import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { ModalApi, ModalSchema } from './modal.types'
import { parts } from './modal.anatomy'
import * as dom from './modal.dom'

export function connect<T extends PropTypes>(
  service: Service<ModalSchema>,
  normalize: NormalizeProps<T>,
): ModalApi<T> {
  const { state, send, prop, scope } = service
  const open = state.matches('open')

  return {
    open,
    setOpen(nextOpen: boolean) {
      send({ type: nextOpen ? 'OPEN' : 'CLOSE' })
    },
    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': dom.getContentId(scope),
        'data-state': open ? 'open' : 'closed',
        onClick() {
          send({ type: 'TOGGLE' })
        },
      })
    },
    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'role': prop('role'),
        'id': dom.getContentId(scope),
        'hidden': !open,
        'tabIndex': -1,
        'aria-modal': true,
        'data-state': open ? 'open' : 'closed',
      })
    },
    getPositionerProps() {
      return normalize.element({
        ...parts.positioner.attrs,
        id: dom.getPositionerId(scope),
        style: {
          pointerEvents: open ? undefined : 'none',
        },
      })
    },
    getBackdropProps() {
      return normalize.element({
        ...parts.backdrop.attrs,
        'id': dom.getBackdropId(scope),
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
      })
    },
    getCloseTriggerProps() {
      return normalize.button({
        ...parts.closeTrigger.attrs,
        'aria-label': 'Close dialog',
        'id': dom.getCloseTriggerId(scope),
        onClick() {
          send({ type: 'CLOSE' })
        },
      })
    },
  }
}
