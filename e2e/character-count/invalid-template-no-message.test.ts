import { describe, expect, it } from 'vitest'
import { characterCountInit } from '../../packages/compat/src/character-count.js'

const TEMPLATE = `<div data-part="character-count-root">
  <div>
    <label data-part="character-count-label"></label>
    <input data-part="character-count-input" maxlength="20" />
  </div>
</div>`

describe('character count component without message', () => {
  const { body } = document

  it('should throw an error when a character count component is created with no message element', () => {
    body.innerHTML = TEMPLATE
    expect(() => characterCountInit()).toThrow('Expected statusEl to be defined')
  })
})
