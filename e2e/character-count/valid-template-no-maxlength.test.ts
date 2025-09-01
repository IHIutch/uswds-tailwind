import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { characterCountInit } from '../../packages/compat/src/character-count.js'

const TEMPLATE = `<div data-part="character-count-root">
  <div>
    <label data-part="character-count-label"></label>
    <input data-part="character-count-input" />
    <span data-part="character-count-message"></span>
    <div data-part="character-count-status"></div>
    <div data-part="character-count-sr-status"></div>
  </div>
</div>`

describe('character count component without maxlength', () => {
  const { body } = document

  let root
  let input
  let requirementsMessage

  beforeEach(async () => {
    body.innerHTML = TEMPLATE
    characterCountInit()

    root = document.querySelector('[data-part="character-count-root"]')
    input = root.querySelector('[data-part="character-count-input"]')
    requirementsMessage = root.querySelector('[data-part="character-count-message"]')
  })

  it('should not update an initial message for the character count component', () => {
    expect(requirementsMessage.innerHTML).toBe('')
  })

  it('should not inform the user of remaining characters when typing', async () => {
    await userEvent.fill(input, '1')

    expect(requirementsMessage.innerHTML).toBe('')
  })
})
