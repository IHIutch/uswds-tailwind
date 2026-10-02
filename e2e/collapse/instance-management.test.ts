import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Collapse } from '../../packages/compat/src/collapse.js'
import { createDisposableCollapse } from './_utils.js'

const rootId = 'test'
const TEMPLATE = `
  <section data-scope="collapse" data-part="root" id="${rootId}">
    <button data-part="trigger">Toggle details</button>
    <div data-part="content">Details</div>
  </section>
`

it('rejects duplicate construction and keeps the original collapse usable', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)
  const { elements } = component
  const root = elements.getRootEl()!
  const original = elements.getInstance()

  expect(() => new Collapse(root, {}).init()).toThrow()
  expect(elements.getInstance()).toBe(original)

  await userEvent.click(elements.getTriggerEl()!)
  expect(elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('true')
  expect(elements.getContentEl()?.hasAttribute('hidden')).toBe(false)
  await userEvent.click(elements.getTriggerEl()!)
  expect(elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(elements.getContentEl()?.hasAttribute('hidden')).toBe(true)
})

it('reuses the existing collapse and toggles once per click', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)
  const { elements } = component
  const original = elements.getInstance()

  expect(Collapse.getOrCreateInstance(elements.getRootEl())).toBe(original)

  await userEvent.click(elements.getTriggerEl()!)
  expect(elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('true')
  expect(elements.getContentEl()?.hasAttribute('hidden')).toBe(false)
  await userEvent.click(elements.getTriggerEl()!)
  expect(elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(elements.getContentEl()?.hasAttribute('hidden')).toBe(true)
})
