import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Accordion } from '../../packages/compat/src/accordion.js'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'
const itemOne = 'item-1'
const itemTwo = 'item-2'

const TEMPLATE = `
  <ul data-scope="accordion" data-part="root" id="${rootId}">
    <li data-part="item" data-value="${itemOne}">
      <button data-part="item-trigger">
        Section one
      </button>
      <div data-part="item-content"></div>
    </li>
    <li data-part="item" data-value="${itemTwo}">
      <button data-part="item-trigger">
        Section two
      </button>
      <div data-part="item-content"></div>
    </li>
  </ul>
`

it('has an "aria-expanded" attribute', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)
  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBeTruthy()
})

it('has an "aria-controls" attribute', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)
  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-controls')).toBeTruthy()
})

it('toggles button aria-expanded="true"', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)
  const instance = Accordion.getInstance(component.elements.getRootEl())
  await instance?.open(itemOne)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('true')
})

it('toggles content "hidden" off', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)

  const instance = Accordion.getInstance(component.elements.getRootEl())
  await instance?.open(itemOne)

  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeFalsy()
})

// These remain as separate assertions to mirror the USWDS accordion.hide() tests. The source opens
// the item before hiding it; omitting that setup would only verify the already-closed initial state.
// instance-methods.test.ts provides stronger combined coverage of the same close transition.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/test/accordion.spec.js#L69-L82
it('toggles button aria-expanded="false"', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)

  const instance = Accordion.getInstance(component.elements.getRootEl())
  await instance?.open(itemOne)
  await instance?.close(itemOne)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('false')
})

it('toggles content "hidden" on', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)

  const instance = Accordion.getInstance(component.elements.getRootEl())
  await instance?.open(itemOne)
  await instance?.close(itemOne)

  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeTruthy()
})

it('shows the second item when clicked', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE)

  await userEvent.click(component.elements.getTriggerEl(itemTwo)!)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeTruthy()

  expect(component.elements.getTriggerEl(itemTwo)?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl(itemTwo)?.hasAttribute('hidden')).toBeFalsy()
})

it('keeps multiple sections open with data-allow-multiple', { tags: ['legacy'] }, async () => {
  await using component = createDisposableAccordion(rootId, TEMPLATE.replace('data-scope="accordion" data-part="root"', 'data-scope="accordion" data-part="root" data-multiple'))

  await userEvent.click(component.elements.getTriggerEl(itemTwo)!)
  await userEvent.click(component.elements.getTriggerEl(itemOne)!)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeFalsy()

  expect(component.elements.getTriggerEl(itemTwo)?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl(itemTwo)?.hasAttribute('hidden')).toBeFalsy()
})
