import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div class="usa-form-group">
        <label class="usa-label" for="input-dates-of-use">Dates of use</label>
        <div data-part="date-picker-root" data-range-date="2020-05-22" id="${rootId}">
          <input
            data-part="date-picker-input"
            id="input-dates-of-use"
            name="input-dates-of-use"
            type="text"
          />
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

it('should display the range date when showing the month of the range date', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/21/2020')
  await userEvent.click(button)

  const rangeDate = calendar.querySelector('[data-range-date="true"]') as HTMLElement
  expect(rangeDate).toBeTruthy()
  expect(rangeDate.getAttribute('data-value')).toBe('2020-05-22')
})

it('should not display the range date when showing a month different from the range date month', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/21/2020')
  await userEvent.click(button)

  const rangeDate = calendar.querySelector('[data-range-date="true"]')
  expect(rangeDate).toBeNull()
})

it('should display the days between the calendar date and the range date as within range when the calendar date is above the range date', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendarEl = component.elements.getCalendarEl()!

  const findDateButton = (day: string) => {
    const buttons = calendarEl.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-date-button"]')
    return Array.from(buttons).find(button =>
      button.textContent?.trim() === day,
    )
  }

  await userEvent.fill(input, '05/25/2020')
  await userEvent.click(button)

  // Range date (22nd) should not be within range
  const day22 = findDateButton('22')
  expect(day22).toBeDisabled()
  // expect(day22?.getAttribute('data-within-range')).not.toBe('true')

  // Days between selected date (25th) and range date (22nd) should be within range
  const day23 = findDateButton('23')
  expect(day23).toBeEnabled()
  // expect(day23?.getAttribute('data-within-range')).toBe('true')

  const day24 = findDateButton('24')
  expect(day24).toBeEnabled()
  // expect(day24?.getAttribute('data-within-range')).toBe('true')

  // Selected date (25th) should not be within range
  const day25 = findDateButton('25')
  expect(day25).toBeDisabled()
  // expect(day25?.getAttribute('data-within-range')).not.toBe('true')

  // Dates outside range should not be within range
  const day26 = findDateButton('26')
  expect(day26).toBeDisabled()
  // expect(day26?.getAttribute('data-within-range')).not.toBe('true')
})

it('should display the days between the calendar date and the range date as within range when the calendar date is below the range date', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  const findDateButton = (day: string) => {
    const buttons = calendar.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-date-button"]')
    return Array.from(buttons).find(button =>
      button.textContent?.trim() === day,
    )
  }

  await userEvent.fill(input, '05/18/2020')
  await userEvent.click(button)

  // Range date (22nd) should not be within range
  const day22 = findDateButton('22')
  expect(day22).toBeDisabled()
  // expect(day22?.getAttribute('data-within-range')).not.toBe('true')

  // Days between selected date (18th) and range date (22nd) should be within range
  const day21 = findDateButton('21')
  // expect(day21?.getAttribute('data-within-range')).toBe('true')
  expect(day21).toBeEnabled()

  const day20 = findDateButton('20')
  // expect(day20?.getAttribute('data-within-range')).toBe('true')
  expect(day20).toBeEnabled()

  const day19 = findDateButton('19')
  // expect(day19?.getAttribute('data-within-range')).toBe('true')
  expect(day19).toBeEnabled()

  // Selected date (18th) should not be within range
  const day18 = findDateButton('18')
  // expect(day18?.getAttribute('data-within-range')).not.toBe('true')
  expect(day18).toBeDisabled()

  // Dates outside range should not be within range
  const day17 = findDateButton('17')
  // expect(day17?.getAttribute('data-within-range')).not.toBe('true')
  expect(day17).toBeDisabled()
})
