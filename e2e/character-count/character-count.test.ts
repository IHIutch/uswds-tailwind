import { userEvent } from '@vitest/browser/context'
import { visuallyHiddenStyle } from '@zag-js/dom-query'
import { beforeEach, describe, expect, it } from 'vitest'
import { characterCountInit } from '../../packages/compat/src/character-count.js'

const TEMPLATE = `<div data-part="character-count-root">
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

describe('character count component', () => {
  const { body } = document

  let root
  let label
  let input
  let statusMessageVisual
  let statusMessageSR

  beforeEach(async () => {
    body.innerHTML = TEMPLATE
    characterCountInit()

    root = document.querySelector('[data-part="character-count-root"]')
    label = root.querySelector('[data-part="character-count-label"]')
    input = root.querySelector('[data-part="character-count-input"]')
    statusMessageVisual = root.querySelector('[data-part="character-count-status"]')
    statusMessageSR = root.querySelector('[data-part="character-count-sr-status"]')
  })

  it('hides the requirements hint for screen readers', () => {
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
    const visibleStatus = document.querySelectorAll('[data-part="character-count-status"]')
    expect(visibleStatus.length).toBe(1)
  })

  it('creates a screen reader status message on init', () => {
    const srStatus = document.querySelectorAll('[data-part="character-count-sr-status"]')
    expect(srStatus.length).toBe(1)
  })

  it('adds initial status message for the character count component', () => {
    expect(statusMessageVisual.innerHTML).toBe('20 characters allowed')
    expect(statusMessageSR.innerHTML).toBe('20 characters allowed')
  })

  it('informs the user how many more characters they are allowed', async () => {
    await userEvent.fill(input, '1')

    expect(statusMessageVisual.innerHTML).toBe('19 characters left')
  })

  it('informs the user they are allowed a single character', async () => {
    await userEvent.fill(input, '1234567890123456789')

    expect(statusMessageVisual.innerHTML).toBe('1 character left')
  })

  it('informs the user they are over the limit by a single character', async () => {
    await userEvent.fill(input, '123456789012345678901')

    expect(statusMessageVisual.innerHTML).toBe('1 character over limit')
  })

  it('informs the user how many characters they will need to remove', async () => {
    await userEvent.fill(input, '1234567890123456789012345')

    expect(statusMessageVisual.innerHTML).toBe('5 characters over limit')
  })

  it('should show the component and input as valid when the input is under the limit', async () => {
    await userEvent.fill(input, '1')

    expect(input.validationMessage).toBe('')
    expect(statusMessageVisual.getAttribute('data-invalid')).toBeFalsy()
  })

  it('should show the component and input as invalid when the input is over the limit', async () => {
    await userEvent.fill(input, '123456789012345678901')

    expect(input.validationMessage).toBe('The content is too long.')
    expect(label.getAttribute('data-invalid')).toBeTruthy()
    expect(input.getAttribute('data-invalid')).toBeTruthy()
    expect(statusMessageVisual.getAttribute('data-invalid')).toBeTruthy()
  })

  it('should not allow for innerHTML of child elements', async () => {
    Array.from(statusMessageVisual.childNodes).forEach((childNode) => {
      expect((childNode as Node).nodeType).toBe(Node.TEXT_NODE)
    })
  })
})
