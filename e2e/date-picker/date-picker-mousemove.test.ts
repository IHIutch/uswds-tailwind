import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div>
        <label for="input-dob">Date of birth</label>
        <div data-part="date-picker-root" id="${rootId}">
          <input data-part="date-picker-input" id="input-dob" name="input-dob" type="text">
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


it('should ignore mouse move events over disabled days', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const getCalendarEl = () => root.querySelector('[data-part="date-picker-content"]') as HTMLElement
  
  // Set min/max date constraints to disable certain days
  root.setAttribute('data-min-date', '2020-06-01')
  root.setAttribute('data-max-date', '2020-06-24')
  
  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(button)
  
  // Verify initial focus on June 20
  const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-06-20')
  
  // Try to hover over a disabled date (day 26 should be disabled due to max date)
  const disabledDate = getCalendarEl().querySelector('[data-value="2020-06-26"]')
  if (disabledDate) {
    await userEvent.hover(disabledDate as HTMLElement)
  }
  
  // Focus should remain on June 20 since disabled days should be ignored
  const stillFocusedDate = getCalendarEl().querySelector('[data-focus="true"]')
  expect(stillFocusedDate?.getAttribute('data-value')).toBe('2020-06-20')
})

it('should handle mouse event on the same day efficiently', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const getCalendarEl = () => root.querySelector('[data-part="date-picker-content"]') as HTMLElement
  
  root.setAttribute('data-min-date', '2020-06-01')
  root.setAttribute('data-max-date', '2020-06-24')
  
  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(button)
  
  // Mark calendar for re-render test
  getCalendarEl().setAttribute('data-test-render', 'true')
  
  // Verify initial focus on June 20
  const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-06-20')
  
  // Hover over the same date (should not cause unnecessary re-render)
  const sameDate = getCalendarEl().querySelector('[data-value="2020-06-20"]')
  if (sameDate) {
    await userEvent.hover(sameDate as HTMLElement)
  }
  
  // Calendar should not have re-rendered unnecessarily
  expect(getCalendarEl().getAttribute('data-test-render')).toBe('true')
  
  // Focus should remain on June 20
  const stillFocusedDate = getCalendarEl().querySelector('[data-focus="true"]')
  expect(stillFocusedDate?.getAttribute('data-value')).toBe('2020-06-20')
})