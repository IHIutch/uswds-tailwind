import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { Accordion } from '../../packages/compat/src/accordion.js'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'
const itemOne = 'item-1'
const itemTwo = 'item-2'

const TEMPLATE = `
  <ul data-part="accordion-root" id="${rootId}">
    <li data-part="accordion-item" data-value="${itemOne}">
      <button data-part="accordion-trigger">
        Section one
      </button>
      <div data-part="accordion-content"></div>
    </li>
    <li data-part="accordion-item" data-value="${itemTwo}">
      <button data-part="accordion-trigger">
        Section two
      </button>
      <div data-part="accordion-content"></div>
    </li>
  </ul>
`

it('has an "aria-expanded" attribute', () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)
  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBeTruthy()
})

it('has an "aria-controls" attribute', () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)
  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-controls')).toBeTruthy()
})

it('toggles button aria-expanded="true"', async () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)
  const instance = Accordion.getInstance(rootId)
  await instance?.open(itemOne)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('true')
})

it('toggles content "hidden" off', async () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)

  const instance = Accordion.getInstance(rootId)
  await instance?.open(itemOne)

  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeFalsy()
})

it('toggles button aria-expanded="false"', async () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)

  const instance = Accordion.getInstance(rootId)
  await instance?.close(itemOne)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('false')
})

it('toggles content "hidden" on', async () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)

  const instance = Accordion.getInstance(rootId)
  await instance?.close(itemOne)

  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeTruthy()
})

it('shows the second item when clicked', async () => {
  using component = createDisposableAccordion(rootId, TEMPLATE)

  await userEvent.click(component.elements.getTriggerEl(itemTwo)!)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeTruthy()

  expect(component.elements.getTriggerEl(itemTwo)?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl(itemTwo)?.hasAttribute('hidden')).toBeFalsy()
})

it('keeps multiple sections open with data-allow-multiple', async () => {
  using component = createDisposableAccordion(rootId, TEMPLATE.replace('data-part="accordion-root"', 'data-part="accordion-root" data-multiple'))

  await userEvent.click(component.elements.getTriggerEl(itemTwo)!)
  await userEvent.click(component.elements.getTriggerEl(itemOne)!)

  expect(component.elements.getTriggerEl(itemOne)?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl(itemOne)?.hasAttribute('hidden')).toBeFalsy()

  expect(component.elements.getTriggerEl(itemTwo)?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl(itemTwo)?.hasAttribute('hidden')).toBeFalsy()
})
