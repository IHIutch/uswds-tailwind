import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltips, TOOLTIP } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L364-L371 (Escape hides every active tooltip)
it('closes both a focused tooltip and a hovered sibling on Escape', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltips(TOOLTIP('first') + TOOLTIP('second'))
  const { getTriggerEl, getContentEl } = component.elements
  // Move the pointer away first, so leaving the first root cannot hide its focus-opened tooltip.
  await userEvent.unhover(getTriggerEl('first'))
  getTriggerEl('first').focus()
  await vi.waitFor(() => expect(getContentEl('first').getAttribute('aria-hidden')).toBe('false'))
  await userEvent.hover(getTriggerEl('second'))
  expect(getContentEl('first').getAttribute('aria-hidden')).toBe('false')
  expect(getContentEl('second').getAttribute('aria-hidden')).toBe('false')

  await userEvent.keyboard('{Escape}')

  expect(getContentEl('first').getAttribute('aria-hidden')).toBe('true')
  expect(getContentEl('second').getAttribute('aria-hidden')).toBe('true')
})
