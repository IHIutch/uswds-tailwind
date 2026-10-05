import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'test'

const template = `<div data-scope="character-count" data-part="root" id="${rootId}">
  <div>
    <input data-part="input" pattern="[A-Za-z]+" maxlength="5"/>
    <div data-part="status"></div>
    <div data-part="sr-status"></div>
  </div>
</div>`

it('assert that input constraint validation adds a validation message', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  await userEvent.fill(input, 'abcd5')

  expect(input.validity.patternMismatch).toBe(true)
  expect(input.validity.customError).toBe(false)
})

it('assert that input constraint validation does not overwrite a custom message', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  input.setCustomValidity('There is an error')
  await userEvent.fill(input, 'abcd56')

  expect(input.validationMessage).toBe('There is an error')
})

it('should not affect the validation message when a custom error message is already present', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  input.setCustomValidity('There is an error')
  await userEvent.fill(input, 'abcdef')

  expect(input.validationMessage).toBe('There is an error')
})

it('should not affect the validation message when the input is already invalid', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  await userEvent.fill(input, 'abcde5')

  expect(input.validity.patternMismatch).toBe(true)
  expect(input.validity.customError).toBe(false)
})

it('should clear the validation message when input is only invalid by character count validation', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()

  await userEvent.fill(input, 'abcdef')

  expect(input.validationMessage).toBe('The content is too long.')

  await userEvent.clear(input)
  await userEvent.fill(input, 'abcde')

  await vi.waitFor(() => expect(input.validationMessage).toBe(''))
})
