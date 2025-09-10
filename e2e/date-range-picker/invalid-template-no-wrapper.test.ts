import { expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

const template = `
  <div>
    <!-- Inputs without proper date-range-picker-root wrapper -->
    <div class="usa-form-group">
      <input data-part="date-range-picker-start-input" id="start" type="text" />
    </div>
    <div class="usa-form-group">
      <input data-part="date-range-picker-end-input" id="end" type="text" />
    </div>
  </div>
`

it('should not find any date range picker components without proper wrapper', () => {
  document.body.innerHTML = template
  
  expect(() => dateRangePickerInit()).not.toThrow()
  
  const startInput = document.querySelector('[data-part="date-range-picker-start-input"]') as HTMLInputElement
  const endInput = document.querySelector('[data-part="date-range-picker-end-input"]') as HTMLInputElement
  
  expect(startInput).toBeTruthy()
  expect(endInput).toBeTruthy()
  
  expect(startInput.min).toBe('')
  expect(startInput.max).toBe('')
  expect(endInput.min).toBe('')
  expect(endInput.max).toBe('')
  
  document.body.innerHTML = ''
})