import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { DatePicker } from '../../packages/compat/src/date-picker.js'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dates-of-use">Dates of use</label>
      <div data-scope="date-picker" data-part="root" id="${rootId}" data-range-date="2020-05-22">
        <input data-part="input" disabled id="input-dates-of-use" name="input-dates-of-use" type="text">
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-disabled.spec.js#L41
it('should not display the calendar when the button is clicked as it is disabled', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  // Force click the disabled button
  await userEvent.click(button, { force: true })

  expect(calendar.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-disabled.spec.js#L51
it('should display the calendar when the button is clicked once the component is enabled', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  const instance = DatePicker.getInstance(component.elements.getRootEl())

  expect(instance).not.toBeNull()
  await instance!.enable()

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
})
