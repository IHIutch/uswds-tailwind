import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDateRangePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div data-scope="date-range-picker" data-part="root" id="${rootId}">
      <div class="usa-form-group">
        <label class="usa-label" for="appointment-date-start">Appointment Date Start</label>
        <div class="usa-hint">mm/dd/yyyy</div>
        <input
          data-part="input"
          class="usa-input"
          id="appointment-date-start"
          name="appointment-date-start"
          type="text"
          required
        />
        <input data-part="hidden-input" type="text" aria-hidden="true" />
        <button data-part="trigger" data-target="start" type="button"></button>
      </div>

      <div class="usa-form-group">
        <label class="usa-label" for="appointment-date-end">Appointment Date End</label>
        <div class="usa-hint">mm/dd/yyyy</div>
        <input
          data-part="input"
          class="usa-input"
          id="appointment-date-end"
          name="appointment-date-end"
          type="text"
          required
        />
        <input data-part="hidden-input" type="text" aria-hidden="true" />
        <button data-part="trigger" data-target="end" type="button"></button>
      </div>

      <div data-part="content" hidden>
        <div data-part="day-view">
          <div data-part="view-control">
          <button data-part="prev-year-trigger" type="button"></button>
          <button data-part="prev-month-trigger" type="button"></button>
          <button data-part="month-trigger" type="button"></button>
          <button data-part="year-trigger" type="button"></button>
          <button data-part="next-month-trigger" type="button"></button>
          <button data-part="next-year-trigger" type="button"></button>
          </div>
          <table>
            <thead>
              <tr>
                <th data-part="table-header"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <button data-part="cell-trigger"></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div data-part="month-view">
          <table>
            <tbody>
              <tr>
                <td>
                  <button data-part="cell-trigger"></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div data-part="year-view">
          <table>
            <tbody>
              <tr>
                <td>
                  <button data-part="cell-trigger"></button>
                </td>
              </tr>
            </tbody>
          </table>
          <button data-part="prev-year-chunk-trigger"></button>
          <button data-part="next-year-chunk-trigger"></button>
        </div>
      </div>
      <div data-part="status"></div>
    </div>
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L50
it('should enhance the date picker and identify the start and end date pickers', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  expect(startInput).toBeTruthy()
  expect(endInput).toBeTruthy()
  expect(startInput.id).toBe('appointment-date-start')
  expect(endInput.id).toBe('appointment-date-end')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L57
it('should reset the range end date picker properties when the range start date picker has an empty value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(startInput, '1/1/2020')
  await userEvent.clear(startInput)

  expect(endInput.getAttribute('min')).toBeFalsy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L75
it('should update the range end date picker properties to have a min date and range date when the range start date picker has an updated valid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  await userEvent.fill(startInput, '12/12/2020')

  expect(endInput.min).toBe('2020-12-12')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L836-L847 (invalid visible dates receive custom validity)
it('should validate the range start date picker on change', { tags: ['parity'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!

  await userEvent.fill(startInput, '13/1/2020')
  await userEvent.click(document.body, { position: { x: 0, y: 0 } })

  expect(startInput.validationMessage).toBe('Please enter a valid date')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L97
it('should reset the range end date picker properties when the range start date picker has an updated invalid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  await userEvent.fill(startInput, 'ab/dc/efg')

  expect(endInput.min).toBe('')
  // expect(endInput.getAttribute('data-range-date')).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L115
it('should reset the range start date picker properties when the range end date picker has an empty value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(endInput, '12/11/2020')
  await userEvent.clear(endInput)

  expect(startInput.max).toBe('')
  // expect(startInput.getAttribute('data-range-date')).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L129
it('should update the range start date picker properties to have a max date and range date when the range end date picker has an updated valid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(endInput, '12/11/2020')

  expect(startInput.max).toBe('2020-12-11')
  // expect(startInput.getAttribute('data-range-date')).toBe('2020-12-11')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker.spec.js#L151
it('should reset the range start date picker properties when the range end date picker has an updated invalid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(endInput, '35/35/3535')

  expect(startInput.max).toBe('')
  // expect(startInput.getAttribute('data-range-date')).toBe('')
})
