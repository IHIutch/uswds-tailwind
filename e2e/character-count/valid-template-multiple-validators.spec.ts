import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { CharacterCount, characterCountInit } from '../../packages/compat/src/character-count.js'

const TEMPLATE = `<div  data-part="character-count-root" id="test">
  <div >
    <label data-part="character-count-label"></label>
    <input data-part="character-count-input" pattern="[A-Za-z]+" maxlength="5"/>
    <span data-part="character-count-message"></span>
    <div data-part="character-count-status"></div>
    <div data-part="character-count-sr-status"></div>
  </div>
</div>`

describe('character count component with multiple validators', () => {
  const { body } = document

  let root
  let input
  let characterCountId

  beforeEach(async () => {
    body.innerHTML = TEMPLATE
    characterCountInit()

    root = document.querySelector('[data-part="character-count-root"]')
    input = root.querySelector('[data-part="character-count-input"]')
    characterCountId = root.id.split(':')[1]
  })

  it('assert that input constraint validation adds a validation message', async () => {
    await userEvent.fill(input, 'abcd5')

    expect(input.validationMessage).toBe('Please match the requested format.')
  })

  it('assert that input constraint validation does not overwrite a custom message', async () => {
    // input.setCustomValidity('There is an error')
    const instance = CharacterCount.getInstance(characterCountId)
    instance?.api.setCustomValidity('There is an error')
    await userEvent.fill(input, 'abcd56')

    expect(input.validationMessage).toBe('There is an error')
  })

  it('should not affect the validation message when a custom error message is already present', async () => {
    // input.setCustomValidity('There is an error')
    const instance = CharacterCount.getInstance(characterCountId)
    instance?.api.setCustomValidity('There is an error')
    await userEvent.fill(input, 'abcdef')

    expect(input.validationMessage).toBe('There is an error')
  })

  it('should not affect the validation message when the input is already invalid', async () => {
    await userEvent.fill(input, 'abcde5')

    expect(input.validationMessage).toBe('Please match the requested format.')
  })

  it('should clear the validation message when input is only invalid by character count validation', async () => {
    await userEvent.fill(input, 'abcdef')

    expect(input.validationMessage).toBe('The content is too long.')

    await userEvent.clear(input)
    await userEvent.fill(input, 'abcde')

    expect(input.validationMessage).toBe('')
  })
})
