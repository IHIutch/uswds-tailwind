import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Collapse } from '../../packages/compat/src/collapse.js'
import { createDisposableCollapse } from './_utils.js'

const rootId = 'test'

function TEMPLATE({ defaultOpen = false }: { defaultOpen?: boolean } = {}) {
  return `
  <section data-scope="collapse" data-part="root" id="${rootId}"${defaultOpen ? ' data-state="open"' : ''}>
    <button data-part="trigger">
      Here's how you know
      <span data-part="indicator"></span>
    </button>
    <div data-part="content">
      <p>Official websites use .gov</p>
      <p>Secure .gov websites use HTTPS</p>
    </div>
  </section>
`
}

it('initializes closed', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE())

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeTruthy()
})

it('opens when you click the button', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE())
  await userEvent.click(component.elements.getTriggerEl()!)

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('open')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeFalsy()
})

it('closes when you click the button again', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE())
  await userEvent.click(component.elements.getTriggerEl()!)
  await userEvent.click(component.elements.getTriggerEl()!)

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeTruthy()
})

it('is open by default', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE({ defaultOpen: true }))
  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('open')

  await userEvent.click(component.elements.getTriggerEl()!)

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
})

it('prefers an explicit defaultOpen prop over authored state', { tags: ['new'] }, () => {
  document.body.innerHTML = TEMPLATE()
  const rootEl = document.getElementById(rootId)!
  const component = new Collapse(rootEl, { defaultOpen: true }).init()

  expect(rootEl.getAttribute('data-state')).toBe('open')

  component.destroy()
})

it('updates the indicator when opened and closed', { tags: ['new'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE())
  const indicator = component.elements.getRootEl()!.querySelector('[data-part="indicator"]')!

  expect(indicator.id).toBe(`collapse:${rootId}:indicator`)
  expect(indicator.getAttribute('data-state')).toBe('closed')

  await userEvent.click(component.elements.getTriggerEl()!)
  expect(indicator.getAttribute('data-state')).toBe('open')

  await userEvent.click(component.elements.getTriggerEl()!)
  expect(indicator.getAttribute('data-state')).toBe('closed')
})
