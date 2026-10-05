import type { Service } from '@zag-js/core'
import type { JSX, NormalizeProps, PropTypes } from '@zag-js/types'
import type { ModalApi, ModalSchema } from './modal.types'
import { compact } from '@zag-js/utils'
import { parts } from './modal.anatomy'
import * as dom from './modal.dom'

export function connect<T extends PropTypes>(
  service: Service<ModalSchema>,
  normalize: NormalizeProps<T>,
): ModalApi<T> {
  const { state, send, scope, context, prop } = service
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
        'style': compact<JSX.CSSProperties>({
          pointerEvents: 'none',
        }),
      })
    },

    getTriggerProps({ index}: { index?: number } = {}) {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope, index),
        'type': 'button',
        'data-ownedby': scope.id,
        'aria-controls': dom.getContentId(scope),
        'data-state': open ? 'open' : 'closed',
        'role': 'button',
        onClick(event) {
          if (event.defaultPrevented)
            return
          event.preventDefault()
          send({ type: 'TOGGLE', index })
        },
      })
    },

    getBackdropProps() {
      return normalize.element({
        ...parts.backdrop.attrs,
        'id': dom.getBackdropId(scope),
        'data-state': open ? 'open' : 'closed',
        'hidden': !open,
      })
    },

    getContentProps() {
      const rendered = context.get('rendered')
      const ariaLabel = prop('aria-label')
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'role': 'dialog',
        // React Aria doesn't use aria-modal because of a Safari iframe focus bug https://github.com/adobe/react-spectrum/blob/main/packages/react-aria/src/dialog/useDialog.ts#L116-L120.
        // Placing aria-hidden on elements outside the modal should suffice in place of aria-modal.
        // 'aria-modal': ariaAttr(true),
        'aria-label': ariaLabel || undefined,
        'aria-labelledby': ariaLabel || !rendered.title ? undefined : dom.getTitleId(scope),
        'aria-describedby': rendered.description ? dom.getDescriptionId(scope) : undefined,
        'data-state': open ? 'open' : 'closed',
        'tabIndex': -1,
        'hidden': !open,
      })
    },

    getPositionerProps() {
      return normalize.element({
        ...parts.positioner.attrs,
        'id': dom.getPositionerId(scope),
        'aria-controls': dom.getContentId(scope),
        'style': compact<JSX.CSSProperties>({
          pointerEvents: !open ? 'none' : undefined,
        }),
      })
    },

    getTitleProps() {
      return normalize.element({
        ...parts.title.attrs,
        id: dom.getTitleId(scope),
      })
    },

    getDescriptionProps() {
      return normalize.element({
        ...parts.description.attrs,
        id: dom.getDescriptionId(scope),
      })
    },

    getCloseTriggerProps({ index }: { index?: number } = {}) {
      return normalize.button({
        ...parts.closeTrigger.attrs,
        id: dom.getCloseTriggerId(scope, index),
        type: 'button',
        onClick(event) {
          if (event.defaultPrevented)
            return
          event.stopPropagation()
          send({ type: 'CLOSE' })
        },
      })
    },
  }
}
