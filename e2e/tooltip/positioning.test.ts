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

// Bare markup has no tooltip styles; lay the content out from the machine's coordinates.
const CONTENT_STYLE = 'position: absolute; display: block; top: var(--tooltip-y); left: var(--tooltip-x); white-space: nowrap'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L220-L259 (a clipped placement falls back to the first one that fits)
it('flips a top tooltip clipped by the viewport to the bottom', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test'))
  const { getRootEl, getTriggerEl, getContentEl } = component.elements
  getRootEl().style.cssText = 'position: fixed; top: 0; left: 150px'
  getContentEl().style.cssText = CONTENT_STYLE

  await userEvent.hover(getTriggerEl())

  await expect.element(getContentEl()).toHaveAttribute('data-placement', 'bottom')
  expect(getContentEl().getBoundingClientRect().top).toBeGreaterThan(getTriggerEl().getBoundingClientRect().bottom)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L134-L137 (top is centered on the trigger)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L154-L155 (bottom is centered on the trigger)
for (const placement of ['top', 'bottom']) {
  it(`centers a ${placement} tooltip on its trigger`, { tags: ['parity'] }, async () => {
    await using component = createDisposableTooltip('test', TOOLTIP('test', placement))
    const { getRootEl, getTriggerEl, getContentEl } = component.elements
    getRootEl().style.cssText = 'position: fixed; top: 150px; left: 150px'
    getContentEl().style.cssText = CONTENT_STYLE

    await userEvent.hover(getTriggerEl())

    await expect.element(getContentEl()).toHaveAttribute('data-placement', placement)
    const content = getContentEl().getBoundingClientRect()
    const trigger = getTriggerEl().getBoundingClientRect()
    expect(content.left + content.width / 2).toBeCloseTo(trigger.left + trigger.width / 2, 0)
  })
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L65-L72 (old coordinates are cleared before measuring)
it('reopens a bottom tooltip in the same place', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test', 'bottom'))
  const { getRootEl, getTriggerEl, getContentEl } = component.elements
  getRootEl().style.cssText = 'position: fixed; top: 150px; left: 150px'
  getContentEl().style.cssText = CONTENT_STYLE
  await userEvent.hover(getTriggerEl())
  await expect.element(getContentEl()).toHaveAttribute('data-visible')
  const firstTop = getContentEl().getBoundingClientRect().top
  await userEvent.unhover(getTriggerEl())
  await expect.element(getContentEl()).toHaveAttribute('aria-hidden', 'true')

  await userEvent.hover(getTriggerEl())

  await expect.element(getContentEl()).toHaveAttribute('data-visible')
  expect(getContentEl().getBoundingClientRect().top).toBe(firstTop)
})

// USWDS places this tooltip away from the trigger: https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L192-L205
it('places a left tooltip next to a trigger with a wide left margin', { tags: ['new'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test', 'left'))
  const { getRootEl, getTriggerEl, getContentEl } = component.elements
  getRootEl().style.cssText = 'position: fixed; top: 150px; left: 100px'
  getTriggerEl().style.marginLeft = '200px'
  getContentEl().style.cssText = CONTENT_STYLE

  await userEvent.hover(getTriggerEl())

  await expect.element(getContentEl()).toHaveAttribute('data-placement', 'left')
  const gap = getTriggerEl().getBoundingClientRect().left - getContentEl().getBoundingClientRect().right
  expect(gap).toBeCloseTo(5, 0)
})
