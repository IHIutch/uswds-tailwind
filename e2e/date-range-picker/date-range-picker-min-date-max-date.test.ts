import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDateRangePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div data-scope="date-range-picker" data-part="root" data-min-date="2020-05-22" data-max-date="2021-06-20" id="${rootId}">
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
          <div data-part="view" data-view="day">
          <div data-part="view-control">
            <button data-part="prev-trigger" data-unit="year" type="button"></button>
            <button data-part="prev-trigger" data-unit="month" type="button"></button>
            <button data-part="view-trigger" data-view="month" type="button"></button>
            <button data-part="view-trigger" data-view="year" type="button"></button>
            <button data-part="next-trigger" data-unit="month" type="button"></button>
            <button data-part="next-trigger" data-unit="year" type="button"></button>
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
                    <button data-part="table-cell-trigger"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div data-part="view" data-view="month">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button data-part="table-cell-trigger"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div data-part="view" data-view="year">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button data-part="table-cell-trigger"></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button data-part="prev-trigger" data-view="year"></button>
            <button data-part="next-trigger" data-view="year"></button>
          </div>
        </div>
        <div data-part="status"></div>
      </div>
    </div>
  `

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L50
it('should enhance the date picker and identify the start and end date pickers', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  expect(startInput).toBeTruthy()
  expect(endInput).toBeTruthy()

  // Both inputs should have the default min/max date constraints
  expect(startInput.min).toBe('2020-05-22')
  expect(startInput.max).toBe('2021-06-20')
  expect(endInput.min).toBe('2020-05-22')
  expect(endInput.max).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L78
it('should not update the range end date picker properties when the range start date picker has an empty value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  // Set initial value then clear it
  await userEvent.fill(startInput, '12/12/2020')
  await userEvent.clear(startInput)

  // End input should maintain default min/max dates (not be cleared)
  expect(endInput.min).toBe('2020-05-22')
  expect(endInput.max).toBe('2021-06-20')
  // expect(endInput.getAttribute('data-range-date')).toBeFalsy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L101
it('should update the range end date picker properties to have a min date and range date when the range start date picker has an updated valid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(startInput, '12/12/2020')

  // End input should get updated min date but keep the default max date
  expect(endInput.min).toBe('2020-12-12')
  expect(endInput.max).toBe('2021-06-20')
  // expect(endInput.getAttribute('data-range-date')).toBe('2020-12-12')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L128
it('should reset the range end date picker properties when the range start date picker has an updated invalid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(startInput, 'ab/dc/efg')

  // End input should revert to default min/max dates
  expect(endInput.min).toBe('2020-05-22')
  expect(endInput.max).toBe('2021-06-20')
  // expect(endInput.getAttribute('data-range-date')).toBeFalsy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L151
it('should not update the range start date picker properties when the range end date picker has an empty value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  // Set initial value then clear it
  await userEvent.fill(endInput, '12/11/2020')
  await userEvent.clear(endInput)

  // Start input should maintain default min/max dates (not be cleared)
  expect(startInput.min).toBe('2020-05-22')
  expect(startInput.max).toBe('2021-06-20')
  // expect(startInput.getAttribute('data-range-date')).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L174
it('should update the range start date picker properties to have a max date and range date when the range end date picker has an updated valid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(endInput, '12/11/2020')

  // Start input should get updated max date but keep the default min date
  expect(startInput.min).toBe('2020-05-22')
  expect(startInput.max).toBe('2020-12-11')
  // expect(startInput.getAttribute('data-range-date')).toBe('2020-12-11')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/date-range-picker-min-date-max-date.spec.js#L201
it('should not update the range start date picker properties when the range end date picker has an updated invalid value', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!

  await userEvent.fill(endInput, '35/35/3535')

  // Start input should revert to default min/max dates
  expect(startInput.min).toBe('2020-05-22')
  expect(startInput.max).toBe('2021-06-20')
  // expect(startInput.getAttribute('data-range-date')).toBe('')
})
