import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <ul data-scope="accordion" data-part="root" id="${rootId}">
    <li data-part="item" data-value="a">
      <button data-part="item-trigger">Section A</button>
      <div data-part="item-content"></div>
    </li>
    <li data-part="item" data-value="b">
      <button data-part="item-trigger">Section B</button>
      <div data-part="item-content"></div>
    </li>
    <li data-part="item" data-value="c">
      <button data-part="item-trigger">Section C</button>
      <div data-part="item-content"></div>
    </li>
  </ul>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L47-L53 (expanding one item collapses the others)
it('opening a second item collapses the first and leaves the third closed', { tags: ['parity'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)
  const { getTriggerEl, getContentEl } = component.elements

  await userEvent.click(getTriggerEl('a')!)
  expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
  expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()

  await userEvent.click(getTriggerEl('b')!)
  expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
  expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
  expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()
  expect(getTriggerEl('c')?.getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl('c')?.hasAttribute('hidden')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L70-L72 (a click toggles the clicked button)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/toggle.js#L8-L10 (no target state inverts the current one)
it('clicking an open item closes it', { tags: ['parity'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)
  const { getTriggerEl, getContentEl } = component.elements

  await userEvent.click(getTriggerEl('b')!)
  expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')

  await userEvent.click(getTriggerEl('b')!)
  expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl('b')?.hasAttribute('hidden')).toBeTruthy()
  expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
  expect(getTriggerEl('c')?.getAttribute('aria-expanded')).toBe('false')
})
