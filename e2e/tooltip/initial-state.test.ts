import { expect, it } from 'vitest'
import { createDisposableTooltip, TOOLTIP } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L321-L355 (initial placement, trigger description, and hidden content)
it('renders the trigger, description link, and hidden content', { tags: ['parity'] }, async () => {
  await using component = createDisposableTooltip('test', TOOLTIP('test'))
  const { getTriggerEl, getContentEl } = component.elements
  const trigger = getTriggerEl()
  const content = getContentEl()
  expect(trigger.getAttribute('tabindex')).toBe('0')
  expect(trigger.getAttribute('aria-describedby')).toBe(content.id)
  expect(trigger.getAttribute('data-placement')).toBe('top')
  expect(content.getAttribute('role')).toBe('tooltip')
  expect(content.getAttribute('aria-hidden')).toBe('true')
  expect(content.textContent).toBe('Tooltip test')
})
