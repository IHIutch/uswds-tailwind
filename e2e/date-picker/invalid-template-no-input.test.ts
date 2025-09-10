import { expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

const template = `
  <div>
    <div data-part="date-picker-root"></div>
  </div>
`

it('should throw an error when date picker is activated without an input', () => {
  document.body.innerHTML = template
  expect(() => datePickerInit()).toThrow('Expected input element to be defined')
})