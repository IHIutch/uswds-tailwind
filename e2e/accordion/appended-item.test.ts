import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Accordion } from '../../packages/compat/src/accordion.js'
import { createDisposableAccordions } from './_utils.js'

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

// Dynamic markup is opt-in: insertion alone does not bind behavior. The caller explicitly refreshes
// the existing instance once its owned items have changed.
it('an item appended after init works after an explicit refresh', { tags: ['new'] }, async () => {
  await using component = createDisposableAccordions(TEMPLATE)
  const { getRootEl, getTriggerEl, getContentEl } = component.elements
  await userEvent.click(getTriggerEl(rootId, 'a')!)
  expect(getTriggerEl(rootId, 'a')?.getAttribute('aria-expanded')).toBe('true')

  getRootEl(rootId)!.insertAdjacentHTML('beforeend', `
    <li data-part="item" data-value="c">
      <button data-part="item-trigger">Section C</button>
      <div data-part="item-content" hidden></div>
    </li>
  `)

  await userEvent.click(getTriggerEl(rootId, 'c')!)
  expect(getTriggerEl(rootId, 'c')?.getAttribute('aria-expanded')).toBeNull()
  expect(getContentEl(rootId, 'c')?.hasAttribute('hidden')).toBeTruthy()
  expect(getTriggerEl(rootId, 'a')?.getAttribute('aria-expanded')).toBe('true')

  Accordion.getInstance(getRootEl(rootId))?.render()
  await userEvent.click(getTriggerEl(rootId, 'c')!)

  expect(getTriggerEl(rootId, 'c')?.getAttribute('aria-expanded')).toBe('true')
  expect(getContentEl(rootId, 'c')?.hasAttribute('hidden')).toBeFalsy()
  expect(getTriggerEl(rootId, 'a')?.getAttribute('aria-expanded')).toBe('false')
  expect(getContentEl(rootId, 'a')?.hasAttribute('hidden')).toBeTruthy()
  expect(getTriggerEl(rootId, 'b')?.getAttribute('aria-expanded')).toBe('false')
  expect(getTriggerEl(rootId, 'c')?.getAttribute('aria-controls')).toBe(getContentEl(rootId, 'c')?.id)
})
