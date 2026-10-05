import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip } from './_utils.js'

// Migrated from https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/test/tooltips.spec.js
const rootId = 'tooltip-test'

const template = `
  <div data-scope="tooltip" data-part="root" id="${rootId}">
    <button data-part="trigger" class="usa-button" title="This is a tooltip">
      Button
    </button>
    <div data-part="content"></div>
  </div>
`

it('trigger is created', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  expect(trigger).toBeTruthy()
})

it('title attribute on trigger is removed', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  expect(trigger.getAttribute('title')).toBeFalsy()
})

it('tooltip content is created', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()
  expect(content).toBeTruthy()
  expect(content.textContent?.trim()).toBe('This is a tooltip')
})

it('tooltip is visible on focus', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  expect(content.getAttribute('aria-hidden')).toBe('false')
})

it('tooltip is hidden on blur', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  await userEvent.keyboard('{Tab}')
  expect(content.getAttribute('aria-hidden')).toBe('true')
})

it('tooltip is visible on mouseover', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  expect(content.getAttribute('aria-hidden')).toBe('false')
})

it('tooltip is hidden on mouseleave', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  await userEvent.unhover(trigger)
  expect(content.getAttribute('aria-hidden')).toBe('true')
})

it('tooltip content is hoverable', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()

  await userEvent.hover(trigger)
  await userEvent.hover(content)
  expect(content.getAttribute('aria-hidden')).toBe('false')
})

it('tooltip is hidden on escape keydown', { tags: ['legacy'] }, async () => {
  await using component = createDisposableTooltip(rootId, template)
  const content = component.elements.getContentEl()

  await userEvent.keyboard('{Tab}')
  await userEvent.keyboard('{Escape}')
  expect(content.getAttribute('aria-hidden')).toBe('true')
})

it('should not allow for innerHTML of child elements', { tags: ['legacy'] }, async () => {
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
