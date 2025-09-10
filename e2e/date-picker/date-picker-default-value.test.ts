import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dates-of-use">Dates of use</label>
      <div data-part="date-picker-root" id="${rootId}" data-default-value="2020-05-22">
        <input data-part="date-picker-input" id="input-dates-of-use" name="input-dates-of-use" type="text">
        <button data-part="date-picker-trigger" type="button"></button>
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
      </div>
    </div>
  </div>
`

it('should set the input date of the calendar', () => {
  using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  expect(input.value).toBe('05/22/2020')
})

it('should display the selected date when the calendar is opened', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})
