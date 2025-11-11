import type { TooltipPlacement, TooltipPosition, TooltipSchema } from './tooltip.types'
import { createMachine } from '@zag-js/core'
import { getContentEl, getTriggerEl } from './tooltip.dom'
import { calculatePosition } from './utils/calculate-position'

export const machine = createMachine<TooltipSchema>({
  props({ props }) {
    return {
      placement: 'top',
      ...props,
    }
  },

  initialState() {
    return 'closed'
  },

  context({ bindable, prop }) {
    return {
      placement: bindable<TooltipPlacement>(() => ({ defaultValue: prop('placement') })),
      content: bindable<string>(() => ({ defaultValue: '' })),
      position: bindable<TooltipPosition>(() => ({
        defaultValue: { x: 0, y: 0 },
      })),
    }
  },

  states: {
    closed: {
      on: {
        OPEN: { target: 'open' },
      },
    },
    open: {
      on: {
        CLOSE: { target: 'closed' },
      },
      entry: ['getPosition'],
    },
  },

  implementations: {
    actions: {
      async getPosition({ scope, context }) {
        const triggerEl = getTriggerEl(scope)
        const contentEl = getContentEl(scope)

        if (!triggerEl || !contentEl)
          return

        contentEl.hidden = false
        const placement = context.get('placement')
        const alternatives = {
          top: ['bottom', 'left', 'right'],
          bottom: ['top', 'left', 'right'],
          left: ['right', 'top', 'bottom'],
          right: ['left', 'top', 'bottom'],
        } as const

        const updatePosition = (placement: TooltipPlacement) => {
          const position = calculatePosition(triggerEl, contentEl, placement)
          context.set('position', {
            x: position.x,
            y: position.y,
          })
          context.set('placement', placement)
        }

        updatePosition(placement)

        const checkViewportCollision = () => {
          const pos = context.get('position')
          const contentWidth = contentEl.offsetWidth
          const contentHeight = contentEl.offsetHeight

          return (
            pos.x >= 0
            && pos.y >= 0
            && pos.x + contentWidth <= window.innerWidth
            && pos.y + contentHeight <= window.innerHeight
          )
        }

        if (!checkViewportCollision()) {
          for (const altPlacement of alternatives[placement]) {
            updatePosition(altPlacement)
            if (checkViewportCollision())
              break
          }
        }
      },
    },
  },
})
