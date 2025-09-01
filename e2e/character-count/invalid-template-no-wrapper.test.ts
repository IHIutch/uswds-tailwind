import { describe, expect, it } from 'vitest'
import { characterCountInit } from '../../packages/compat/src/character-count.js'

const TEMPLATE = `<div>
  <div>
    <label></label>
    <input maxlength="20" />
    <span></span>
  </div>
</div>`

describe('character count input without wrapping element', () => {
  const { body } = document

  it('should not initialize when no character count root element is found', () => {
    body.innerHTML = TEMPLATE

    expect(() => characterCountInit()).not.toThrow()
  })
})
