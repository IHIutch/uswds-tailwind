import { expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

const template = `
  <div>
    <div data-part="date-range-picker-root">
      <!-- Missing required input elements -->
    </div>
  </div>
`

it('should throw an error when initialized without required input elements', () => {
  document.body.innerHTML = template
  expect(() => dateRangePickerInit()).toThrow('Expected start input element to be defined')
})