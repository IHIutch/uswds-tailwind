import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'test'

const template = `<div data-part="character-count-root" id="${rootId}">
  <div>
    <label data-part="character-count-label"></label>
    <input data-part="character-count-input" />
    <div data-part="character-count-status"></div>
    <div data-part="character-count-sr-status"></div>
  </div>
</div>`

it('should not update an initial message for the character count component', () => {
  using component = createDisposableCharacterCount(rootId, template)
  const visibleStatus = component.elements.getStatusEl()!
  expect(visibleStatus.textContent).toBe('')
})

it('should not inform the user of remaining characters when typing', async () => {
  using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()
  const visibleStatus = component.elements.getStatusEl()!

  await userEvent.fill(input, '1')

  expect(visibleStatus.textContent).toBe('')
})
