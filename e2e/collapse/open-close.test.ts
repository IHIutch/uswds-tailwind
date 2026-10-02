import { expect, it } from 'vitest'
import { createDisposableCollapse } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <section data-scope="collapse" data-part="root" id="${rootId}">
    <button data-part="trigger">
      Here's how you know
    </button>
    <div data-part="content">
      <p>Official websites use .gov</p>
      <p>Secure .gov websites use HTTPS</p>
    </div>
  </section>
`

it('open() opens the collapse and resolves once the DOM reflects it', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)
  await component.elements.getInstance()?.open()

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('open')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeFalsy()
})

it('close() closes the collapse and resolves once the DOM reflects it', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)
  await component.elements.getInstance()?.open()
  await component.elements.getInstance()?.close()

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeTruthy()
})

it('open() is a no-op when already open', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)
  await component.elements.getInstance()?.open()
  await component.elements.getInstance()?.open()

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('open')
})

it('close() is a no-op when already closed', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)
  await component.elements.getInstance()?.close()

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
})
