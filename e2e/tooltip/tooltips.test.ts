import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip } from './_utils.js'

const rootId = 'tooltip-test'

const template = `
  <div data-scope="tooltip" data-part="root" id="${rootId}">
    <button data-part="trigger" class="usa-button" title="This is a tooltip">
      Button
    </button>
    <div data-part="content"></div>
  </div>
`

it('trigger is created', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  expect(trigger).toBeTruthy()
})

it('title attribute on trigger is removed', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  expect(trigger.getAttribute('title')).toBeFalsy()
})

it('tooltip body is created', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()
  expect(content).toBeTruthy()
  expect(content.textContent?.trim()).toBe('This is a tooltip')
})

it('tooltip is visible on focus', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  expect(content.getAttribute('data-state')).toBe('open')
})

it('tooltip is hidden on blur', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  await userEvent.keyboard('{Tab}')
  expect(content.getAttribute('data-state')).toBe('closed')
})

it('tooltip is visible on mouseover', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  expect(content.getAttribute('data-state')).toBe('open')
})

it('tooltip is hidden on mouseleave', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  await userEvent.unhover(trigger)
  expect(content.getAttribute('data-state')).toBe('closed')
})

it('tooltip content is hoverable', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  await userEvent.hover(content)
  expect(content.getAttribute('data-state')).toBe('open')
})

it('tooltip is hidden on escape keydown', async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  await userEvent.keyboard('{Escape}')
  expect(content.getAttribute('data-state')).toBe('closed')
})

it('should not allow for innerHTML of child elements', async () => {
  const unsafeContent = 'Apricot &lt;img src=\'\' onerror=alert(\'ouch\')&gt;'
  const maliciousTemplate = `
  <div data-scope="tooltip" data-part="root" id="${rootId}">
    <button data-part="trigger" class="usa-button" title="${unsafeContent}">
      Button
    </button>
    <div data-part="content"></div>
  </div>
  `

  await using component = createDisposableTooltip(rootId, maliciousTemplate)
  const content = component.elements.getContentEl()

  expect(content.innerHTML).toBe(unsafeContent)
})
