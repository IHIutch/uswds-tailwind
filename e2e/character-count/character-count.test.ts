import { userEvent } from '@vitest/browser/context'
import { visuallyHiddenStyle } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `<div data-part="character-count-root" id="${rootId}">
    <label
      data-part="character-count-label"
      for="input-limit"
    >Text input</label>
    <div>
      <span id="input-hint">This is an input with a character counter.</span>
    </div>
    <div>
      <input
        data-part="character-count-input"
        id="input-limit"
        aria-describedby="input-hint character-count-hint"
        maxlength="20"
      />
    </div>
    <div>
      <span id="character-count-hint"></span>
      <span
        data-part="character-count-status"
        aria-hidden="true"
      ></span>
      <span data-part="character-count-sr-status"></span>
    </div>`

it('hides the requirements hint for screen readers', () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const statusMessageSR = component.elements.getSrStatusEl()!

  Object.entries(visuallyHiddenStyle).forEach(([key, value]) => {
    const elStyle = statusMessageSR.style[key]
      .replace(/0px/g, '0')
      .replace(/,\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    expect(elStyle).toBe(value)
  })
})

it('creates a visual status message on init', () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const visibleStatus = component.elements.getStatusEl()!
  expect(visibleStatus).toBeInTheDocument()
})

it('creates a screen reader status message on init', () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const srStatus = component.elements.getSrStatusEl()
  expect(srStatus).toBeInTheDocument()
})

it('adds initial status message for the character count component', () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const visibleStatus = component.elements.getStatusEl()!
  expect(visibleStatus.textContent).toBe('20 characters allowed')
})

it('informs the user how many more characters they are allowed', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1')
  expect(visibleStatus.textContent).toBe('19 characters left')
})

it('informs the user they are allowed a single character', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1234567890123456789')

  expect(visibleStatus.textContent).toBe('1 character left')
})

it('informs the user they are over the limit by a single character', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '123456789012345678901')
  expect(visibleStatus.textContent).toBe('1 character over limit')
})

it('informs the user how many characters they will need to remove', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1234567890123456789012345')
  expect(visibleStatus.textContent).toBe('5 characters over limit')
})

it('should show the component and input as valid when the input is under the limit', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!
  await userEvent.fill(input, '1')

  expect(input.validationMessage).toBe('')
  expect(visibleStatus.getAttribute('data-invalid')).toBeFalsy()
})

it('should show the component and input as invalid when the input is over the limit', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!
  const label = component.elements.getLabelEl()!

  await userEvent.fill(input, '123456789012345678901')

  expect(input.validationMessage).toBe('The content is too long.')
  expect(label.getAttribute('data-invalid')).toBeTruthy()
  expect(input.getAttribute('data-invalid')).toBeTruthy()
  expect(visibleStatus.getAttribute('data-invalid')).toBeTruthy()
})

it('should not allow for innerHTML of child elements', async () => {
  using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const visibleStatus = component.elements.getStatusEl()!

  Array.from(visibleStatus.childNodes).forEach((childNode) => {
    expect((childNode as Node).nodeType).toBe(Node.TEXT_NODE)
  })
})
