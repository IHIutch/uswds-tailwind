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
  </ul>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L70-L72 (the click handler never checks event.defaultPrevented)
it('still toggles when another listener cancels the click', { tags: ['parity'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)
  const { getTriggerEl, getContentEl } = component.elements
  const cancel = (event: Event) => event.preventDefault()
  getTriggerEl('a')!.addEventListener('click', cancel, { capture: true })
  getTriggerEl('b')!.addEventListener('click', cancel, { capture: true })

  await userEvent.click(getTriggerEl('a')!)
  expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
  expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()

  await userEvent.click(getTriggerEl('b')!)
  expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
  expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
  expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()

  await userEvent.click(getTriggerEl('b')!)
  expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl('b')?.hasAttribute('hidden')).toBeTruthy()
})
