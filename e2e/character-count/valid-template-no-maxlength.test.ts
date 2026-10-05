import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'test'

const template = `<div data-scope="character-count" data-part="root" id="${rootId}">
  <div>
    <input data-part="input" />
    <div data-part="status"></div>
    <div data-part="sr-status"></div>
  </div>
</div>`

it('should not update an initial message for the character count component', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const visibleStatus = component.elements.getStatusEl()!
  expect(visibleStatus.textContent).toBe('')
})

it('should not inform the user of remaining characters when typing', async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1')

  expect(visibleStatus.textContent).toBe('')
})
