import { expect, it } from 'vitest'
import { characterCountInit } from '../../packages/compat/src/character-count.js'

const template = `<div>
  <div>
    <label></label>
    <input maxlength="20" />
    <span></span>
  </div>
</div>`

it('should not initialize when no character count root element is found', () => {
  document.body.innerHTML = template
  expect(() => characterCountInit()).not.toThrow()
})
