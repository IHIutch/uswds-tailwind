import type { TooltipPlacement, TooltipPosition, TooltipSchema } from './tooltip.types'
import { createMachine } from '@zag-js/core'
import { getContentEl, getRootEl, getTriggerEl } from './tooltip.dom'
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
      initialPlacement: bindable<TooltipPlacement>(() => ({ defaultValue: prop('placement') })),
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
        const rootEl = getRootEl(scope)
        const triggerEl = getTriggerEl(scope)
        const contentEl = getContentEl(scope)

        if (!rootEl || !triggerEl || !contentEl)
          return

        contentEl.hidden = false
        const initialPlacement = context.get('initialPlacement')
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

        updatePosition(initialPlacement)

        const checkViewportCollision = () => {
          const pos = context.get('position')
          const contentWidth = contentEl.offsetWidth
          const contentHeight = contentEl.offsetHeight

          const containerRect = rootEl.getBoundingClientRect()
          const viewportX = containerRect.left + pos.x
          const viewportY = containerRect.top + pos.y

          return (
            viewportX >= 0
            && viewportY >= 0
            && viewportX + contentWidth <= window.innerWidth
            && viewportY + contentHeight <= window.innerHeight
          )
        }

        if (!checkViewportCollision()) {
          for (const altPlacement of alternatives[initialPlacement]) {
            updatePosition(altPlacement)
            if (checkViewportCollision()) {
              break
            }
          }
        }
      },
    },
  },
})
