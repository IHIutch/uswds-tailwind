import { visuallyHiddenStyle } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `<div data-scope="character-count" data-part="root" id="${rootId}">
    <label
      for="input-limit"
    >Text input</label>
    <div>
      <span id="input-hint">This is an input with a character counter.</span>
    </div>
    <div>
      <input
        data-part="input"
        id="input-limit"
        aria-describedby="input-hint character-count-hint"
        maxlength="20"
      />
    </div>
    <div>
      <span id="character-count-hint"></span>
      <span
        data-part="status"
        aria-hidden="true"
      ></span>
      <span data-part="sr-status"></span>
    </div>`

it('keeps an authored label associated with the input', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const label = component.elements.getLabelEl() as HTMLLabelElement
  const input = component.elements.getInputEl()

  expect(input.id).toBe('input-limit')
  expect(label.control).toBe(input)
})

it('hides the requirements hint for screen readers', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
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

it('creates a visual status message on init', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const visibleStatus = component.elements.getStatusEl()!
  expect(visibleStatus).toBeInTheDocument()
})

it('creates a screen reader status message on init', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const srStatus = component.elements.getSrStatusEl()
  expect(srStatus).toBeInTheDocument()
})

it('adds initial status message for the character count component', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const visibleStatus = component.elements.getStatusEl()!
  expect(visibleStatus.textContent).toBe('20 characters allowed')
})

it('informs the user how many more characters they are allowed', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1')
  expect(visibleStatus.textContent).toBe('19 characters left')
})

it('allows typing past the authored maxlength so the over-limit status can appear', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!

  await userEvent.type(input, '123456789012345678901')

  expect(input.value).toBe('123456789012345678901')
  expect(component.elements.getStatusEl()!.textContent).toBe('1 character over limit')
})

it('informs the user they are allowed a single character', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1234567890123456789')

  expect(visibleStatus.textContent).toBe('1 character left')
})

it('informs the user they are over the limit by a single character', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '123456789012345678901')
  expect(visibleStatus.textContent).toBe('1 character over limit')
})

it('informs the user how many characters they will need to remove', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1234567890123456789012345')
  expect(visibleStatus.textContent).toBe('5 characters over limit')
})

it('should show the component and input as valid when the input is under the limit', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!
  await userEvent.fill(input, '1')

  expect(input.validationMessage).toBe('')
  expect(visibleStatus.getAttribute('data-invalid')).toBeFalsy()
})

it('should show the component and input as invalid when the input is over the limit', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '123456789012345678901')

  expect(input.validationMessage).toBe('The content is too long.')
  expect(input.hasAttribute('data-invalid')).toBe(true)
  expect(visibleStatus.hasAttribute('data-invalid')).toBe(true)
})

it('should not allow for innerHTML of child elements', async () => {
  await using component = createDisposableCharacterCount(rootId, TEMPLATE)
  const visibleStatus = component.elements.getStatusEl()!

  Array.from(visibleStatus.childNodes).forEach((childNode) => {
    expect((childNode as Node).nodeType).toBe(Node.TEXT_NODE)
  })
})
