import { expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

const template = `
  <div>
    <button type="button" data-part="date-picker-trigger"></button>
  </div>
`

it('should not error when trigger exists without wrapper', () => {
  document.body.innerHTML = template
  
  expect(() => datePickerInit()).not.toThrow()
  
  const rootEl = document.querySelector('[data-part="date-picker-root"]')
  expect(rootEl).toBeNull()
  
  document.body.innerHTML = ''
})