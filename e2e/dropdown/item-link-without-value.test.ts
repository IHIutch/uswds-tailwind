import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const id = 'test'

const TEMPLATE = `
  <nav data-scope="dropdown" data-part="root" id="${id}">
    <button data-part="trigger" type="button">Open ${id}</button>
    <ul data-part="content" style="position: absolute">
      <li data-part="item">
        <a href="#no-value">No value</a>
      </li>
    </ul>
  </nav>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/index.js#L60 (any click in the body closes the active menu, links included)
it('a link in an item without a value closes the menu', { tags: ['parity'] }, async () => {
  await using component = createDisposableDropdown(id, TEMPLATE)
  const trigger = component.elements.getTriggerEl()
  const link = component.elements.getContentEl()!.querySelector('a')!

  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  await userEvent.click(link)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl()?.hidden).toBe(true)
})
