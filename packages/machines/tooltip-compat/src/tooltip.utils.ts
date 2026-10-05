import type { Placement } from './tooltip.types'
import { isInView } from '@zag-js/dom-query'

const TOOLTIP_OFFSET = 'var(--tooltip-offset, 5px)'
const PLACEMENTS: Placement[] = ['top', 'bottom', 'right', 'left']

function setVar(content: HTMLElement, name: string, value?: string): void {
  if (value === undefined)
    content.style.removeProperty(name)
  else content.style.setProperty(name, value)
}

function marginOffset(trigger: HTMLElement, side: 'top' | 'left', size: number, win: Window): number {
  const margin = Number.parseInt(win.getComputedStyle(trigger).getPropertyValue(`margin-${side}`), 10)
  return margin > 0 ? size - margin : size
}

function applyPlacement(content: HTMLElement, trigger: HTMLElement, placement: Placement, win: Window): void {
  // Clear the previous candidate before measuring the next one.
  setVar(content, '--tooltip-y')
  setVar(content, '--tooltip-x')

  let y: string
  let x: string
  let arrowY = '50%'
  let arrowX = '50%'

  switch (placement) {
    case 'top': {
      const height = marginOffset(trigger, 'top', content.offsetHeight, win)
      const width = marginOffset(trigger, 'left', content.offsetWidth, win)
      y = `calc(${-height}px - ${TOOLTIP_OFFSET})`
      x = `calc(50% - ${width / 2}px)`
      arrowY = '100%'
      break
    }
    case 'bottom': {
      const width = marginOffset(trigger, 'left', content.offsetWidth, win)
      y = `calc(${content.offsetTop}px + ${TOOLTIP_OFFSET})`
      x = `calc(50% - ${width / 2}px)`
      arrowY = '0'
      break
    }
    case 'right': {
      const height = marginOffset(trigger, 'top', content.offsetHeight, win)
      y = `calc(50% - ${height / 2}px)`
      x = `calc(${trigger.offsetLeft + trigger.offsetWidth}px + ${TOOLTIP_OFFSET})`
      arrowX = '0'
      break
    }
    case 'left': {
      const height = marginOffset(trigger, 'top', content.offsetHeight, win)
      const offset = trigger.offsetLeft > content.offsetWidth ? trigger.offsetLeft - content.offsetWidth : content.offsetWidth
      const width = marginOffset(trigger, 'left', offset, win)
      y = `calc(50% - ${height / 2}px)`
      x = `calc(${trigger.offsetLeft > content.offsetWidth ? width : -width}px - ${TOOLTIP_OFFSET})`
      arrowX = '100%'
      break
    }
  }

  setVar(content, '--tooltip-y', y)
  setVar(content, '--tooltip-x', x)
  setVar(content, '--arrow-y', arrowY)
  setVar(content, '--arrow-x', arrowX)
}

/** Applies USWDS placement probes synchronously so each viewport check sees the candidate's layout. */
export function positionTooltip(content: HTMLElement, trigger: HTMLElement, preferred: Placement, win: Window): Placement | null {
  if (!PLACEMENTS.includes(preferred))
    return null

  applyPlacement(content, trigger, preferred, win)
  if (isInView(content, win))
    return preferred

  let placement = preferred
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const candidate of PLACEMENTS) {
      placement = candidate
      applyPlacement(content, trigger, placement, win)
      if (isInView(content, win))
        return placement
    }
    content.setAttribute('data-wrap', '')
  }

  return placement
}
