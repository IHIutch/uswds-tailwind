import type { Position, TooltipSchema } from './tooltip.types'
import { createMachine } from '@zag-js/core'
import { addDomEvent, getComputedStyle, getDocumentElement, getWindow, raf } from '@zag-js/dom-query'
import { setRafTimeout } from '@zag-js/utils'
import * as dom from './tooltip.dom'

export const machine = createMachine<TooltipSchema>({
  initialState({ prop }) {
    const open = prop('open') || prop('defaultOpen')
    return open ? 'open' : 'closed'
  },

  props({ props }) {
    return {
      id: 'tooltip',
      position: 'top',
      closeOnEscape: true,
      ...props,
    }
  },

  context({ bindable }) {
    return {
      currentPosition: bindable<Position>(() => ({ defaultValue: 'top' })),
      isVisible: bindable<boolean>(() => ({ defaultValue: false })),
      isWrapped: bindable<boolean>(() => ({ defaultValue: false })),
      contentStyle: bindable<Record<string, string>>(() => ({ defaultValue: {} })),
    }
  },

  states: {
    closed: {
      on: {
        POINTER_ENTER: {
          target: 'open',
        },
        FOCUS: {
          target: 'open',
        },
      },
    },

    open: {
      effects: ['trackPositioning', 'trackEscapeKey', 'waitForVisible'],
      exit: ['clearPositioning'],
      on: {
        POINTER_LEAVE: {
          target: 'closed',
        },
        BLUR: {
          target: 'closed',
        },
        CLOSE: {
          target: 'closed',
        },
      },
    },
  },

  implementations: {
    guards: {},

    actions: {
      // Resets all positioning and visibility state when leaving open state.
      // and sets aria-hidden="true". Here we reset the context equivalents.
      clearPositioning: ({ context, prop }) => {
        context.set('isVisible', false)
        context.set('isWrapped', false)
        context.set('contentStyle', {})
        context.set('currentPosition', prop('position'))
      },
    },

    effects: {
      // and hides each one. In the machine model, each tooltip instance manages
      // its own escape listener — pressing Escape sends CLOSE to this instance.
      trackEscapeKey: ({ send, prop, scope }) => {
        if (!prop('closeOnEscape'))
          return

        const doc = scope.getDoc()
        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key !== 'Escape')
            return
          send({ type: 'CLOSE', src: 'keydown.escape' })
        }

        return addDomEvent(doc, 'keydown', onKeyDown, true)
      },

      // Runs on entering the open state. Defers to requestAnimationFrame to ensure
      // which sets opacity: 0 but allows measurement).
      //
      // Reads DOM measurements, computes positions mathematically, checks viewport
      // bounds without writing to the DOM, and stores computed styles in context.
      // The connect function then applies these styles as CSS variables.
      trackPositioning: ({ context, prop, scope }) => {
        const triggerEl = dom.getTriggerEl(scope)
        const contentEl = dom.getContentEl(scope)
        const rootEl = dom.getRootEl(scope)
        if (!triggerEl || !contentEl || !rootEl)
          return

        const TRIANGLE_SIZE = 5
        const maxAttempts = 2

        let cleanupRaf: VoidFunction | undefined

        const runPositioning = (attempt: number) => {
          const docEl = getDocumentElement(scope.getDoc())

          // --- DOM measurement reads (no writes) ---
          const contentWidth = contentEl.offsetWidth
          const contentHeight = contentEl.offsetHeight
          const triggerOffsetLeft = (triggerEl as HTMLElement).offsetLeft
          const triggerOffsetWidth = (triggerEl as HTMLElement).offsetWidth
          const wrapperRect = rootEl.getBoundingClientRect()
          const wrapperWidth = (rootEl as HTMLElement).offsetWidth
          const wrapperHeight = (rootEl as HTMLElement).offsetHeight
          const win = getWindow(triggerEl)
          const viewportWidth = win.innerWidth || docEl.clientWidth
          const viewportHeight = win.innerHeight || docEl.clientHeight

          // Reads computed margin values from the trigger element.
          const triggerMarginTop = Number.parseInt(
            getComputedStyle(triggerEl).getPropertyValue('margin-top'),
            10,
          ) || 0
          const triggerMarginLeft = Number.parseInt(
            getComputedStyle(triggerEl).getPropertyValue('margin-left'),
            10,
          ) || 0

          // If the trigger has a positive margin for the given position,
          // subtract it from the offset. Otherwise use the offset as-is.
          const calculateMarginOffset = (
            marginPosition: 'top' | 'left',
            tooltipBodyOffset: number,
          ) => {
            const marginValue = marginPosition === 'top' ? triggerMarginTop : triggerMarginLeft
            const offset
              = marginValue > 0
                ? tooltipBodyOffset - marginValue
                : tooltipBodyOffset
            return offset
          }

          // Checks if a computed viewport rect is fully within the viewport.
          const isInViewport = (rect: {
            top: number
            left: number
            bottom: number
            right: number
          }) => {
            return (
              rect.top >= 0
              && rect.left >= 0
              && rect.bottom <= viewportHeight
              && rect.right <= viewportWidth
            )
          }

          // --- Position computation functions ---
          // Each computes the CSS styles and the resulting viewport rect
          // without writing to the DOM. The viewport rect is derived from
          // the wrapper's position, the computed CSS offsets, and the content dimensions.

          const computeTop = () => {
            const topMargin = calculateMarginOffset('top', contentHeight)
            const leftMargin = calculateMarginOffset('left', contentWidth)
            const styles: Record<string, string> = {
              '--tooltip-top': `-${TRIANGLE_SIZE}px`,
              '--tooltip-left': `50%`,
              '--tooltip-margin': `-${topMargin}px 0 0 -${leftMargin / 2}px`,
              // Caret at bottom-center of tooltip body, pointing down at trigger.
              '--caret-top': `100%`,
              '--caret-left': `50%`,
            }
            const viewportRect = {
              top: wrapperRect.top + (-TRIANGLE_SIZE) + (-topMargin),
              left: wrapperRect.left + (wrapperWidth * 0.5) + (-leftMargin / 2),
              bottom: wrapperRect.top + (-TRIANGLE_SIZE) + (-topMargin) + contentHeight,
              right: wrapperRect.left + (wrapperWidth * 0.5) + (-leftMargin / 2) + contentWidth,
            }
            return { position: 'top' as const, styles, viewportRect }
          }

          // The element uses its static position, which is at the bottom of the trigger
          // (since the tooltip body follows the trigger in DOM order within the wrapper).
          const computeBottom = () => {
            const leftMargin = calculateMarginOffset('left', contentWidth)
            const styles: Record<string, string> = {
              '--tooltip-left': `50%`,
              '--tooltip-margin': `${TRIANGLE_SIZE}px 0 0 -${leftMargin / 2}px`,
              // Caret at top-center of tooltip body, pointing up at trigger.
              '--caret-top': `0`,
              '--caret-left': `50%`,
            }
            // Static position: content appears after trigger, so top = wrapperHeight
            const staticTop = wrapperHeight
            const viewportRect = {
              top: wrapperRect.top + staticTop + TRIANGLE_SIZE,
              left: wrapperRect.left + (wrapperWidth * 0.5) + (-leftMargin / 2),
              bottom: wrapperRect.top + staticTop + TRIANGLE_SIZE + contentHeight,
              right: wrapperRect.left + (wrapperWidth * 0.5) + (-leftMargin / 2) + contentWidth,
            }
            return { position: 'bottom' as const, styles, viewportRect }
          }

          const computeRight = () => {
            const topMargin = calculateMarginOffset('top', contentHeight)
            const leftPx = triggerOffsetLeft + triggerOffsetWidth + TRIANGLE_SIZE
            const styles: Record<string, string> = {
              '--tooltip-top': `50%`,
              '--tooltip-left': `${leftPx}px`,
              '--tooltip-margin': `-${topMargin / 2}px 0 0 0`,
              // Caret at left-center of tooltip body, pointing left at trigger.
              '--caret-top': `50%`,
              '--caret-left': `0`,
            }
            const viewportRect = {
              top: wrapperRect.top + (wrapperHeight * 0.5) + (-topMargin / 2),
              left: wrapperRect.left + leftPx,
              bottom: wrapperRect.top + (wrapperHeight * 0.5) + (-topMargin / 2) + contentHeight,
              right: wrapperRect.left + leftPx + contentWidth,
            }
            return { position: 'right' as const, styles, viewportRect }
          }

          const computeLeft = () => {
            const topMargin = calculateMarginOffset('top', contentHeight)

            // Checks if the trigger's left offset is greater than the content width
            const leftMarginOffset
              = triggerOffsetLeft > contentWidth
                ? triggerOffsetLeft - contentWidth
                : contentWidth
            const leftMargin = calculateMarginOffset('left', leftMarginOffset)

            const marginLeftValue
              = triggerOffsetLeft > contentWidth ? leftMargin : -leftMargin

            const styles: Record<string, string> = {
              '--tooltip-top': `50%`,
              '--tooltip-left': `-${TRIANGLE_SIZE}px`,
              '--tooltip-margin': `-${topMargin / 2}px 0 0 ${marginLeftValue}px`,
              // Caret at right-center of tooltip body, pointing right at trigger.
              '--caret-top': `50%`,
              '--caret-left': `100%`,
            }
            const viewportRect = {
              top: wrapperRect.top + (wrapperHeight * 0.5) + (-topMargin / 2),
              left: wrapperRect.left + (-TRIANGLE_SIZE) + marginLeftValue,
              bottom: wrapperRect.top + (wrapperHeight * 0.5) + (-topMargin / 2) + contentHeight,
              right: wrapperRect.left + (-TRIANGLE_SIZE) + marginLeftValue + contentWidth,
            }
            return { position: 'left' as const, styles, viewportRect }
          }

          const computePosition: Record<Position, () => {
            position: Position
            styles: Record<string, string>
            viewportRect: { top: number, left: number, bottom: number, right: number }
          }> = {
            top: computeTop,
            bottom: computeBottom,
            right: computeRight,
            left: computeLeft,
          }

          const positionOrder: Position[] = ['top', 'bottom', 'right', 'left']

          // Helper to store a position result in context
          const storeResult = (result: { position: Position, styles: Record<string, string> }) => {
            context.set('currentPosition', result.position)
            context.set('contentStyle', result.styles)
          }

          // --- Main positioning algorithm ---

          // Try the preferred position first
          const preferredPosition = prop('position')
          const preferred = computePosition[preferredPosition]()

          if (isInViewport(preferred.viewportRect)) {
            storeResult(preferred)
            return
          }

          // If the preferred position is clipped, try all positions in order.
          let hasVisiblePosition = false
          let lastResult = preferred

          // Recursive inner function that tries each position in order.
          // Preserves the original recursive structure.
          function tryPositions(i: number) {
            if (i < positionOrder.length) {
              const result = computePosition[positionOrder[i] as Position]()
              lastResult = result

              if (!isInViewport(result.viewportRect)) {
                tryPositions(i + 1)
              }
              else {
                hasVisiblePosition = true
              }
            }
          }

          tryPositions(0)

          if (hasVisiblePosition) {
            storeResult(lastResult)
            return
          }

          // If no position fits in the viewport, add the width-compression class
          // (usa-tooltip__body--wrap) and retry. The connect function applies
          // data-wrapped to constrain the content width via CSS.
          storeResult(lastResult)
          context.set('isWrapped', true)

          if (attempt <= maxAttempts) {
            // Wait for the framework to apply the wrap styling and the browser
            // to reflow before re-measuring content dimensions.
            cleanupRaf = raf(() => {
              runPositioning(attempt + 1)
            })
          }
        }

        // Defer to next animation frame to ensure the content element is laid out
        // and measurable after the framework sets hidden=false.
        cleanupRaf = raf(() => {
          runPositioning(1)
        })

        return () => {
          cleanupRaf?.()
        }
      },

      // to settle before transitioning opacity from 0 to 1.
      // The is-set class (opacity: 0) is applied first, positioning runs,
      // then is-visible (opacity: 1) is added after this delay.
      waitForVisible: ({ context }) => {
        return setRafTimeout(() => {
          context.set('isVisible', true)
        }, 20)
      },
    },
  },
})
