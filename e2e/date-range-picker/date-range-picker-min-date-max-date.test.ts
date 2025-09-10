import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { createDisposableDateRangePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div data-part="date-range-picker-root" data-min-date="2020-05-22" data-max-date="2021-06-20" id="${rootId}">
        <div class="usa-form-group">
          <label class="usa-label" for="appointment-date-start">Appointment Date Start</label>
          <div class="usa-hint">mm/dd/yyyy</div>
          <input
            data-part="date-range-picker-start-input"
            class="usa-input"
            id="appointment-date-start"
            name="appointment-date-start"
            type="text"
            required
          />
          <button data-part="date-picker-trigger" data-target="start" type="button"></button>
        </div>

        <div class="usa-form-group">
          <label class="usa-label" for="appointment-date-end">Appointment Date End</label>
          <div class="usa-hint">mm/dd/yyyy</div>
          <input
            data-part="date-range-picker-end-input"
            class="usa-input"
            id="appointment-date-end"
            name="appointment-date-end"
            type="text"
            required
          />
          <button data-part="date-picker-trigger" data-target="end" type="button"></button>
        </div>

        <div data-part="date-picker-content" hidden>
          <div data-part="date-picker-day">
            <button data-part="date-picker-nav-prev" data-unit="year" type="button"></button>
            <button data-part="date-picker-nav-prev" data-unit="month" type="button"></button>
            <button data-part="date-view-trigger" data-value="month" type="button"></button>
            <button data-part="date-view-trigger" data-value="year" type="button"></button>
            <button data-part="date-picker-nav-next" data-unit="month" type="button"></button>
            <button data-part="date-picker-nav-next" data-unit="year" type="button"></button>
            <table>
              <thead>
                <tr>
                  <th data-part="date-picker-day-header"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <button data-part="date-picker-date-button"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div data-part="date-picker-month">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button data-part="date-picker-month-button"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div data-part="date-picker-year">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button data-part="date-picker-year-button"></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button data-part="date-picker-nav-prev" data-unit="decade"></button>
            <button data-part="date-picker-nav-next" data-unit="decade"></button>
          </div>
        </div>
        <div data-part="date-picker-status"></div>
        <div data-part="date-picker-start-status"></div>
        <div data-part="date-picker-end-status"></div>
      </div>
    </div>
  `


it('should enhance the date picker and identify the start and end date pickers', () => {
  using component = createDisposableDateRangePicker(rootId, template)
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

it('should not update the range end date picker properties when the range start date picker has an empty value', async () => {
  using component = createDisposableDateRangePicker(rootId, template)
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

it('should update the range end date picker properties to have a min date and range date when the range start date picker has an updated valid value', async () => {
  using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  
  await userEvent.fill(startInput, '12/12/2020')

  // End input should get updated min date but keep the default max date
  expect(endInput.min).toBe('2020-12-12')
  expect(endInput.max).toBe('2021-06-20')
  // expect(endInput.getAttribute('data-range-date')).toBe('2020-12-12')
})

it('should reset the range end date picker properties when the range start date picker has an updated invalid value', async () => {
  using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  
  await userEvent.fill(startInput, 'ab/dc/efg')

  // End input should revert to default min/max dates
  expect(endInput.min).toBe('2020-05-22')
  expect(endInput.max).toBe('2021-06-20')
  // expect(endInput.getAttribute('data-range-date')).toBeFalsy()
})

it('should not update the range start date picker properties when the range end date picker has an empty value', async () => {
  using component = createDisposableDateRangePicker(rootId, template)
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

it('should update the range start date picker properties to have a max date and range date when the range end date picker has an updated valid value', async () => {
  using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  
  await userEvent.fill(endInput, '12/11/2020')

  // Start input should get updated max date but keep the default min date
  expect(startInput.min).toBe('2020-05-22')
  expect(startInput.max).toBe('2020-12-11')
  // expect(startInput.getAttribute('data-range-date')).toBe('2020-12-11')
})

it('should not update the range start date picker properties when the range end date picker has an updated invalid value', async () => {
  using component = createDisposableDateRangePicker(rootId, template)
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  
  await userEvent.fill(endInput, '35/35/3535')

  // Start input should revert to default min/max dates
  expect(startInput.min).toBe('2020-05-22')
  expect(startInput.max).toBe('2021-06-20')
  // expect(startInput.getAttribute('data-range-date')).toBe('')
})
