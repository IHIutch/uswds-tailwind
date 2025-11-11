import type { TooltipPlacement } from '../tooltip.types'

const CARET_SIZE = 6

export function calculatePosition(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  placement: TooltipPlacement,
) {
  const triggerCenterX = triggerEl.offsetLeft + triggerEl.offsetWidth / 2
  const triggerCenterY = triggerEl.offsetTop + triggerEl.offsetHeight / 2
  const contentWidth = contentEl.offsetWidth
  const contentHeight = contentEl.offsetHeight

  switch (placement) {
    case 'top':
      return {
        x: triggerCenterX - contentWidth / 2,
        y: triggerEl.offsetTop - contentHeight - CARET_SIZE,
      }
    case 'bottom':
      return {
        x: triggerCenterX - contentWidth / 2,
        y: triggerEl.offsetTop + triggerEl.offsetHeight + CARET_SIZE,
      }
    case 'left':
      return {
        x: triggerEl.offsetLeft - contentWidth - CARET_SIZE,
        y: triggerCenterY - contentHeight / 2,
      }
    case 'right':
      return {
        x: triggerEl.offsetLeft + triggerEl.offsetWidth + CARET_SIZE,
        y: triggerCenterY - contentHeight / 2,
      }
  }
}
