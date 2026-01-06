import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { DatePicker } from '../../packages/compat/src/date-picker.js'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dates-of-use">Dates of use</label>
      <div data-part="date-picker-root" id="${rootId}" data-range-date="2020-05-22">
        <input data-part="date-picker-input" disabled id="input-dates-of-use" name="input-dates-of-use" type="text">
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

it('should not display the calendar when the button is clicked as it is disabled', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  // Force click the disabled button
  await userEvent.click(button, { force: true })

  expect(calendar.hidden).toBe(true)
})

it('should display the calendar when the button is clicked once the component is enabled', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  const instance = DatePicker.getInstance(rootId)

  await instance?.enable()

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
})
