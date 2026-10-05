import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip, TOOLTIP } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L286-L306 (delayed reveal and visibility cleanup on hide)
it('reveals after opening and removes visibility on leave', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test'))
  const { getTriggerEl, getContentEl } = component.elements
  const content = getContentEl()

  await userEvent.hover(getTriggerEl())
  expect(content.getAttribute('aria-hidden')).toBe('false')
  await vi.waitFor(() => expect(content.hasAttribute('data-visible')).toBe(true))

  await userEvent.unhover(getTriggerEl())
  expect(content.getAttribute('aria-hidden')).toBe('true')
  expect(content.hasAttribute('data-visible')).toBe(false)
})
