import { expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

const template = `
  <div>
    <div data-part="date-range-picker-root">
      <div class="usa-form-group">
        <label class="usa-label" for="appointment-date-start">Appointment Date Start</label>
        <div class="usa-hint">mm/dd/yyyy</div>
        <input
          data-part="date-range-picker-start-input"
          class="usa-input"
          id="appointment-date-start"
          name="appointment-date-start"
          type="text"
        />
      </div>
      <!-- Missing second input for end date -->
    </div>
  </div>
`

it('should throw an error when initialized without the required end input element', () => {
  document.body.innerHTML = template
  expect(() => dateRangePickerInit()).toThrow('Expected end input element to be defined')
})