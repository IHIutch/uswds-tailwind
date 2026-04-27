import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { TooltipApi, TooltipSchema } from './tooltip.types'
import { parts } from './tooltip.anatomy'
import * as dom from './tooltip.dom'

export function connect<T extends PropTypes>(
  service: Service<TooltipSchema>,
  normalize: NormalizeProps<T>,
): TooltipApi<T> {
  const { state, context, send, scope } = service

  const open = state.matches('open')
  const isVisible = context.get('isVisible')
  const currentPosition = context.get('currentPosition')
  const isWrapped = context.get('isWrapped')
  const contentStyle = context.get('contentStyle')

  const rootId = dom.getRootId(scope)
  const triggerId = dom.getTriggerId(scope)
  const contentId = dom.getContentId(scope)

  return {
    open,

    setOpen(nextOpen) {
      if (open === nextOpen)
        return
      send({ type: nextOpen ? 'POINTER_ENTER' : 'CLOSE' })
    },

    // Created by setUpAttributes (lines 317, 336-341)
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: rootId,
        // is added to the wrapper. When the mouse leaves the entire wrapper area
        // (which contains both trigger and content), the tooltip hides.
        onPointerLeave() {
          send({ type: 'POINTER_LEAVE' })
        },
      })
    },

    // Attributes set by setUpAttributes (lines 328-333)
    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'id': triggerId,
        'tabIndex': 0,
        // Only link to content when tooltip is open (accessible pattern)
        'aria-describedby': open ? contentId : undefined,
        'data-state': open ? 'open' : 'closed',
        // Both events call showToolTip, which transitions the machine to open.
        onPointerEnter() {
          send({ type: 'POINTER_ENTER' })
        },
        onFocus() {
          send({ type: 'FOCUS' })
        },
        // Calls hideToolTip, which transitions the machine to closed.
        onBlur() {
          send({ type: 'BLUR' })
        },
      })
    },

    // Attributes set by setUpAttributes (lines 349-356) and showToolTip/hideToolTip
    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': contentId,
        'role': 'tooltip',
        // showToolTip sets aria-hidden="false", hideToolTip sets aria-hidden="true"
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        // Maps to position classes: usa-tooltip__body--top/bottom/right/left
        'data-placement': currentPosition,
        // Applied when no position fits and width compression is needed
        'data-wrapped': isWrapped ? '' : undefined,
        // Added after 20ms delay to trigger opacity transition
        'data-visible': isVisible ? '' : undefined,
        // Positioning styles from context, applied as CSS custom properties.
        // The CSS should use these to position the content element:
        //   top: var(--tooltip-top);
        //   left: var(--tooltip-left);
        //   margin: var(--tooltip-margin);
        // These replace the inline styles set by positionTop/Bottom/Right/Left
        'style': {
          ...contentStyle,
        },
      })
    },
  }
}
