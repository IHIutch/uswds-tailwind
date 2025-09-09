import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { CharacterCount } from '../../packages/compat/src/character-count.js'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'test'

const template = `<div data-part="character-count-root" id="${rootId}">
  <div>
    <label data-part="character-count-label"></label>
    <input data-part="character-count-input" pattern="[A-Za-z]+" maxlength="5"/>
    <div data-part="character-count-status"></div>
    <div data-part="character-count-sr-status"></div>
  </div>
</div>`

it('assert that input constraint validation adds a validation message', async () => {
  using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  await userEvent.fill(input, 'abcd5')

  expect(input.validationMessage).toBe('Please match the requested format.')
})

it('assert that input constraint validation does not overwrite a custom message', async () => {
  using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  const instance = CharacterCount.getInstance(rootId)
  instance?.api.setCustomValidity('There is an error')
  await userEvent.fill(input, 'abcd56')

  expect(input.validationMessage).toBe('There is an error')
})

it('should not affect the validation message when a custom error message is already present', async () => {
  using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  const instance = CharacterCount.getInstance(rootId)
  instance?.api.setCustomValidity('There is an error')
  await userEvent.fill(input, 'abcdef')

  expect(input.validationMessage).toBe('There is an error')
})

it('should not affect the validation message when the input is already invalid', async () => {
  using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  await userEvent.fill(input, 'abcde5')

  expect(input.validationMessage).toBe('Please match the requested format.')
})

it('should clear the validation message when input is only invalid by character count validation', async () => {
  using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  await userEvent.fill(input, 'abcdef')

  expect(input.validationMessage).toBe('The content is too long.')

  await userEvent.clear(input)
  await userEvent.fill(input, 'abcde')

  expect(input.validationMessage).toBe('')
})
