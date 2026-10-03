import { query } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dates-of-use">Dates of use</label>
      <div data-scope="date-picker" data-part="root" id="${rootId}" data-default-value="2020-05-22">
        <input data-part="input" id="input-dates-of-use" name="input-dates-of-use" type="text">
        <input data-part="hidden-input" type="hidden">
        <button data-part="trigger" type="button"></button>
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
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-default-value.spec.js#L43
it('should set the input date of the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  expect(input.value).toBe('05/22/2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-default-value.spec.js#L51
it('should display the selected date when the calendar is opened', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})
