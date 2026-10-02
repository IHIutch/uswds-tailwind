import type { Placement } from './tooltip.types'
import { isInView } from '@zag-js/dom-query'

const TRIANGLE_SIZE = 5

export interface PositionStyles {
  top: string | null
  bottom: string | null
  left: string | null
  right: string | null
  margin: string | null
}

export interface PositioningResult {
  placement: Placement
  styles: PositionStyles
  wrap: boolean
}

function isPlacement(value: unknown): value is Placement {
  return value === 'top' || value === 'bottom' || value === 'right' || value === 'left'
}

const CLEARED: PositionStyles = { top: null, bottom: null, left: null, right: null, margin: null }

function publish(body: HTMLElement, styles: PositionStyles): void {
  setVar(body, '--tooltip-top', styles.top)
  setVar(body, '--tooltip-bottom', styles.bottom)
  setVar(body, '--tooltip-left', styles.left)
  setVar(body, '--tooltip-right', styles.right)
  setVar(body, '--tooltip-margin', styles.margin)
}

function setVar(body: HTMLElement, name: string, value: string | null): void {
  if (value === null)
    body.style.removeProperty(name)
  else body.style.setProperty(name, value)
}

function offsetMargin(target: HTMLElement, propertyValue: string, win: Window): number {
  return Number.parseInt(win.getComputedStyle(target).getPropertyValue(propertyValue), 10)
}

function calculateMarginOffset(
  marginPosition: string,
  tooltipBodyOffset: number,
  trigger: HTMLElement,
  win: Window,
): number {
  const margin = offsetMargin(trigger, `margin-${marginPosition}`, win)
  return margin > 0 ? tooltipBodyOffset - margin : tooltipBodyOffset
}

function positionTop(body: HTMLElement, trigger: HTMLElement, win: Window): PositionStyles {
  publish(body, CLEARED)
  const topMargin = calculateMarginOffset('top', body.offsetHeight, trigger, win)
  const leftMargin = calculateMarginOffset('left', body.offsetWidth, trigger, win)
  const styles: PositionStyles = {
    ...CLEARED,
    left: `50%`,
    top: `-${TRIANGLE_SIZE}px`,
    margin: `-${topMargin}px 0 0 -${leftMargin / 2}px`,
  }
  publish(body, styles)
  return styles
}

function positionBottom(body: HTMLElement, trigger: HTMLElement, win: Window): PositionStyles {
  publish(body, CLEARED)
  const leftMargin = calculateMarginOffset('left', body.offsetWidth, trigger, win)
  const styles: PositionStyles = {
    ...CLEARED,
    left: `50%`,
    margin: `${TRIANGLE_SIZE}px 0 0 -${leftMargin / 2}px`,
  }
  publish(body, styles)
  return styles
}

function positionRight(body: HTMLElement, trigger: HTMLElement, win: Window): PositionStyles {
  publish(body, CLEARED)
  const topMargin = calculateMarginOffset('top', body.offsetHeight, trigger, win)
  const styles: PositionStyles = {
    ...CLEARED,
    top: `50%`,
    left: `${trigger.offsetLeft + trigger.offsetWidth + TRIANGLE_SIZE}px`,
    margin: `-${topMargin / 2}px 0 0 0`,
  }
  publish(body, styles)
  return styles
}

function positionLeft(body: HTMLElement, trigger: HTMLElement, win: Window): PositionStyles {
  publish(body, CLEARED)
  const topMargin = calculateMarginOffset('top', body.offsetHeight, trigger, win)
  const leftMargin = calculateMarginOffset(
    'left',
    trigger.offsetLeft > body.offsetWidth ? trigger.offsetLeft - body.offsetWidth : body.offsetWidth,
    trigger,
    win,
  )
  const styles: PositionStyles = {
    ...CLEARED,
    top: `50%`,
    left: `-${TRIANGLE_SIZE}px`,
    margin: `-${topMargin / 2}px 0 0 ${trigger.offsetLeft > body.offsetWidth ? leftMargin : -leftMargin}px`,
  }
  publish(body, styles)
  return styles
}

const POSITION_FNS: Record<Placement, (b: HTMLElement, t: HTMLElement, win: Window) => PositionStyles> = {
  top: positionTop,
  bottom: positionBottom,
  right: positionRight,
  left: positionLeft,
}
const ORDER: Placement[] = ['top', 'bottom', 'right', 'left']

function findBestPosition(body: HTMLElement, trigger: HTMLElement, win: Window): { placement: Placement, styles: PositionStyles } {
  let landed!: { placement: Placement, styles: PositionStyles }

  for (let attempt = 0; attempt < 3; attempt++) {
    for (const placement of ORDER) {
      landed = { placement, styles: POSITION_FNS[placement](body, trigger, win) }
      if (isInView(body, win))
        return landed
    }
    body.setAttribute('data-wrap', '')
  }

  return landed
}

export function computePosition(
  body: HTMLElement,
  trigger: HTMLElement,
  intended: Placement,
  win: Window,
): PositioningResult
export function computePosition(
  body: HTMLElement,
  trigger: HTMLElement,
  intended: unknown,
  win: Window,
): PositioningResult | null
export function computePosition(
  body: HTMLElement,
  trigger: HTMLElement,
  intended: unknown,
  win: Window,
): PositioningResult | null {
  if (!isPlacement(intended))
    return null
  const intendedStyles = POSITION_FNS[intended](body, trigger, win)
  if (isInView(body, win)) {
    return { placement: intended, styles: intendedStyles, wrap: body.hasAttribute('data-wrap') }
  }
  const best = findBestPosition(body, trigger, win)
  return { placement: best.placement, styles: best.styles, wrap: body.hasAttribute('data-wrap') }
}
