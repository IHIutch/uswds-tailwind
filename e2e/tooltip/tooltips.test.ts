import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip } from './_utils.js'

const rootId = 'tooltip-test'

const template = `
  <div data-part="tooltip-root" id="${rootId}">
    <button data-part="tooltip-trigger" class="usa-button">
      Button
    </button>
    <div data-part="tooltip-content">
      This is a tooltip
    </div>
  </div>
`

it('trigger is created', () => {
  using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  expect(trigger).toBeTruthy()
})

it('title attribute on trigger is removed', () => {
  using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  expect(trigger.getAttribute('title')).toBeFalsy()
})

it('tooltip body is created', () => {
  using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()
  expect(content).toBeTruthy()
  expect(content.textContent?.trim()).toBe('This is a tooltip')
})

it('tooltip is visible on focus', async () => {
  using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  expect(content.getAttribute('data-state')).toBe('open')
})

it('tooltip is hidden on blur', async () => {
  using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  await userEvent.keyboard('{Tab}')
  expect(content.getAttribute('data-state')).toBe('closed')
})

it('tooltip is visible on mouseover', async () => {
  using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  expect(content.getAttribute('data-state')).toBe('open')
})

it('tooltip is hidden on mouseleave', async () => {
  using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  await userEvent.unhover(trigger)
  expect(content.getAttribute('data-state')).toBe('closed')
})

it('tooltip content is hoverable', async () => {
  using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  await userEvent.hover(content)
  expect(content.getAttribute('data-state')).toBe('open')
})

it('tooltip is hidden on escape keydown', async () => {
  using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  await userEvent.keyboard('{Escape}')
  expect(content.getAttribute('data-state')).toBe('closed')
})

it('should not allow for innerHTML of child elements', async () => {
  const maliciousTemplate = `
  <div data-part="tooltip-root" id="${rootId}">
    <button data-part="tooltip-trigger" class="usa-button">
      Button
    </button>
    <div data-part="tooltip-content">
      <img src='' onerror=alert('ouch') />
    </div>
  </div>
  `

  using component = createDisposableTooltip(rootId, maliciousTemplate)
  const content = component.elements.getContentEl()

  expect(content.innerHTML).toBe('&lt;img src=\'\' onerror=alert(\'ouch\') /&gt;')
})
