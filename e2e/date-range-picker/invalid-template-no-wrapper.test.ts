import { expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

const template = `
  <div>
    <!-- Inputs without proper date-range-picker-root wrapper -->
    <div class="usa-form-group">
      <input data-part="input" id="start" type="text" />
    </div>
    <div class="usa-form-group">
      <input data-part="input" id="end" type="text" />
    </div>
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L161-L165 (initialization only visits range wrappers)
it('should not find any date range picker components without proper wrapper', { tags: ['parity'] }, () => {
  document.body.innerHTML = template

  expect(() => dateRangePickerInit()).not.toThrow()

  const startInput = document.querySelector('[data-part="input"]') as HTMLInputElement
  const endInput = document.querySelectorAll('[data-part="input"]')[1] as HTMLInputElement

  expect(startInput).toBeTruthy()
  expect(endInput).toBeTruthy()

  expect(startInput.min).toBe('')
  expect(startInput.max).toBe('')
  expect(endInput.min).toBe('')
  expect(endInput.max).toBe('')

  document.body.innerHTML = ''
})
