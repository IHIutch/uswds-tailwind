import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

describe('Date range picker without second input', () => {
  let template: string

  const createInvalidTemplate = () => `
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

  beforeEach(() => {
    template = createInvalidTemplate()
    document.body.innerHTML = template
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should throw an error when initialized without the required end input element', () => {
    // The dateRangePickerInit function should throw an error when the end input element is missing
    expect(() => dateRangePickerInit()).toThrow('Expected end input element to be defined')
  })
})