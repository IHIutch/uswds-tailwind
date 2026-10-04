import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const rootId = 'test'

const template = `
  <nav data-scope="dropdown" data-part="root" id="${rootId}" class="usa-language">
    <button data-part="trigger" type="button" role="button" class="usa-accordion__button usa-language__link">
      <span>Languages</span>
    </button>
    <ul data-part="content" class="usa-language__submenu" id="language-options">
      <li data-part="item" data-value="english">
        <a href="javascript:void(0)" class="usa-language__link">English</a>
      </li>
      <li data-part="item" data-value="spanish">
        <a href="javascript:void(0)" class="usa-language__link">Español</a>
      </li>
      <li data-part="item" data-value="french">
        <a href="javascript:void(0)" class="usa-language__link">Français</a>
      </li>
    </ul>
  </nav>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L49-L54
it('shows the language dropdown when the language button is clicked', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const content = component.elements.getContentEl()!
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(content.getAttribute('hidden')).toBe(null)
})

it('keeps its state when a trigger click is cancelled', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()
  const content = component.elements.getContentEl()!
  const cancelClick = (event: Event) => event.preventDefault()

  trigger.addEventListener('click', cancelClick, { capture: true })
  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(content.hasAttribute('hidden')).toBe(true)

  trigger.removeEventListener('click', cancelClick, { capture: true })
  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect(content.hasAttribute('hidden')).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L56-L63
it('hides the visible language menu when the body is clicked', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const content = component.elements.getContentEl()!
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(content.getAttribute('hidden')).toBe(null)

  // Click empty page below the menu, away from the frame's left edge, where the vitest runner's pane splitter takes the click.
  await userEvent.click(document.documentElement, { position: { x: innerWidth / 2, y: innerHeight - 5 } })
  await vi.waitFor(() => expect(content.hasAttribute('hidden')).toBe(true))
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L65-L69
it('collapses dropdown when a language link is clicked', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const languageLink = component.elements.getContentEl()!.querySelector('a')!
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  await userEvent.click(languageLink)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L71-L75
it('collapses dropdown when the Escape key is hit', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()

  await userEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  trigger.focus()
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'))
  expect(document.activeElement).toBe(trigger)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L107-L109
it('contains a role of button', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()

  expect(trigger.getAttribute('role')).toBe('button')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L111-L116
it('contains aria-controls of language-options', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  const trigger = component.elements.getTriggerEl()

  expect(trigger.getAttribute('aria-controls')).toBe(`dropdown:${rootId}:content`)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/test/language-selector.spec.js#L118-L120
it('contains an id of language-options', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDropdown(rootId, template)
  expect(component.elements.getContentEl()?.getAttribute('id')).toBe(`dropdown:${rootId}:content`)
})
