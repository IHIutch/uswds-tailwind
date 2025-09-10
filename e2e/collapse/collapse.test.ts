import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { createDisposableCollapse } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <section data-part="collapse-root" id="${rootId}">
    <button data-part="collapse-trigger">
      Here's how you know
    </button>
    <div data-part="collapse-content">
      <p>Official websites use .gov</p>
      <p>Secure .gov websites use HTTPS</p>
    </div>
  </section>
`

it('initializes closed', () => {
  using component = createDisposableCollapse(rootId, TEMPLATE)

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeTruthy()
})

it('opens when you click the button', async () => {
  using component = createDisposableCollapse(rootId, TEMPLATE)
  await userEvent.click(component.elements.getTriggerEl()!)

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('open')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('true')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeFalsy()
})

it('closes when you click the button again', async () => {
  using component = createDisposableCollapse(rootId, TEMPLATE)
  await userEvent.click(component.elements.getTriggerEl()!)
  await userEvent.click(component.elements.getTriggerEl()!)

  expect(component.elements.getRootEl()?.getAttribute('data-state')).toBe('closed')
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('false')
  expect(component.elements.getContentEl()?.hasAttribute('hidden')).toBeTruthy()
})
