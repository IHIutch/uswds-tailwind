import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const rootId = 'test'

function TEMPLATE(state?: 'open' | 'closed') {
  return `
    <nav data-scope="dropdown" data-part="root" id="${rootId}"${state ? ` data-state="${state}"` : ''}>
      <button data-part="trigger" type="button">Languages</button>
      <ul data-part="content" style="position: absolute">
        <li data-part="item" data-value="english">
          <a href="#english">English</a>
        </li>
      </ul>
    </nav>
  `
}

it.each(['open', 'closed', undefined] as const)('starts closed with authored state %s and opens on click', { tags: ['new'] }, async (state) => {
  await using component = createDisposableDropdown(rootId, TEMPLATE(state))
  const { getRootEl, getTriggerEl, getContentEl } = component.elements

  expect(getRootEl()?.getAttribute('data-state')).toBe('closed')
  expect(getTriggerEl().getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl()?.hidden).toBe(true)

  await userEvent.click(getTriggerEl())

  expect(getRootEl()?.getAttribute('data-state')).toBe('open')
  expect(getTriggerEl().getAttribute('aria-expanded')).toBe('true')
  expect(getContentEl()?.hidden).toBe(false)
})
