import { query } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dates-of-use">Dates of use</label>
      <div data-scope="date-picker" data-part="root" id="${rootId}" data-default-date="2020-05-22">
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-default-date.spec.js#L44
it('should display the input date when an input date is present', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2020')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-default-date.spec.js#L62
it('should display the default date when the input date is empty', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.clear(input)
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-default-date.spec.js#L80
it('should display the default date when the input date is invalid', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, 'invalid-date')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})
