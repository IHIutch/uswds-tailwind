import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const rootId = 'test'

const template = `
  <nav data-part="dropdown-root" id="${rootId}" class="usa-language">
    <button data-part="dropdown-trigger" type="button" class="usa-accordion__button usa-language__link">
      <span>Languages</span>
    </button>
    <ul data-part="dropdown-content" class="usa-language__submenu" id="language-options">
      <li data-part="dropdown-item" data-value="english">
        <a href="javascript:void(0)" class="usa-language__link">English</a>
      </li>
      <li data-part="dropdown-item" data-value="spanish">
        <a href="javascript:void(0)" class="usa-language__link">Español</a>
      </li>
      <li data-part="dropdown-item" data-value="french">
        <a href="javascript:void(0)" class="usa-language__link">Français</a>
      </li>
    </ul>
  </nav>
`

it('shows the language dropdown when the language button is clicked', async () => {
  using component = createDisposableDropdown(rootId, template)
  const content = component.elements.getContentEl()!
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(content.getAttribute('hidden')).toBe(null)
})

it('hides the visible language menu when the body is clicked', async () => {
  using component = createDisposableDropdown(rootId, template)
  const content = component.elements.getContentEl()!
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(content.getAttribute('hidden')).toBe(null)

  await userEvent.click(document.body, { position: { x: 0, y: 0 } })
  expect(content.hasAttribute('hidden')).toBe(true)
})

it('collapses dropdown when a language link is clicked', async () => {
  using component = createDisposableDropdown(rootId, template)
  const languageLink = component.elements.getContentEl()!.querySelector('a')!
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  await userEvent.click(languageLink)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

it('collapses dropdown when the Escape key is hit', async () => {
  using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  await userEvent.keyboard('{Escape}')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

it('contains a role of button', () => {
  using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()

  expect(trigger.getAttribute('role')).toBe('button')
})

it('contains aria-controls of language-options', () => {
  using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()

  expect(trigger.getAttribute('aria-controls')).toBe(`dropdown:${rootId}:content`)
})

it('contains an id of language-options', () => {
  using component = createDisposableDropdown(rootId, template)
  expect(component.elements.getContentEl()?.getAttribute('id')).toBe(`dropdown:${rootId}:content`)
})
