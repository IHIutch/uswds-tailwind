import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip, TOOLTIP } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L63-L77 (another mouseover recalculates position)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L302-L306 (hide removes visibility and wrapping but retains coordinates)
it('repositions on another mouseover and keeps the last position after closing', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test'))
  const { getTriggerEl, getContentEl } = component.elements
  const trigger = getTriggerEl()
  const content = getContentEl()
  await userEvent.hover(trigger)
  await vi.waitFor(() => expect(content.style.getPropertyValue('--tooltip-y')).not.toBe(''))
  const firstY = content.style.getPropertyValue('--tooltip-y')
  trigger.style.margin = '30px'
  // Dispatch a repeated mouseover while already open; hovering the same element need not emit another one.
  trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  await vi.waitFor(() => expect(content.style.getPropertyValue('--tooltip-y')).not.toBe(firstY))
  const secondY = content.style.getPropertyValue('--tooltip-y')
  const placement = content.getAttribute('data-placement')

  await userEvent.unhover(trigger)

  expect(content.getAttribute('aria-hidden')).toBe('true')
  expect(content.getAttribute('data-placement')).toBe(placement)
  expect(content.style.getPropertyValue('--tooltip-y')).toBe(secondY)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L218-L251 (all placements are retried with wrapping as a last resort)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L302-L306 (hide clears wrapping)
it('drops the wrap marker on close after every placement is clipped', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test'))
  const { getRootEl, getTriggerEl, getContentEl } = component.elements
  const content = getContentEl()
  getRootEl().style.cssText = 'position: fixed; left: 100px; top: 100px; display: inline-block'
  // No placement can contain content wider than the viewport, even after the wrap marker is applied.
  content.style.cssText = 'position: absolute; top: var(--tooltip-y); left: var(--tooltip-x); width: 200vw; height: 20px; visibility: hidden'
  await userEvent.hover(getTriggerEl())
  await vi.waitFor(() => expect(content.hasAttribute('data-wrap')).toBe(true))
  expect(content.getAttribute('data-placement')).toBe('left')

  await userEvent.unhover(getTriggerEl())

  expect(content.getAttribute('aria-hidden')).toBe('true')
  expect(content.hasAttribute('data-wrap')).toBe(false)
  expect(content.getAttribute('data-placement')).toBe('left')
})
