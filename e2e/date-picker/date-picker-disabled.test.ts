import { userEvent } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DatePicker, datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker component - disabled initialization', () => {
  let root: HTMLElement
  let input: HTMLInputElement
  let button: HTMLButtonElement

  const template = `
    <div>
      <div>
        <label for="input-dates-of-use">Dates of use</label>
        <div data-part="date-picker-root" data-range-date="2020-05-22">
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

  const getCalendarEl = () => root.querySelector('[data-part="date-picker-content"]') as HTMLElement

  beforeEach(() => {
    document.body.innerHTML = template
    datePickerInit()
    root = document.querySelector('[data-part="date-picker-root"]')!
    input = root.querySelector('[data-part="date-picker-input"]')!
    button = root.querySelector('[data-part="date-picker-trigger"]')!
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should not display the calendar when the button is clicked as it is disabled', async () => {
    await userEvent.click(button)

    expect(getCalendarEl().hidden).toBe(true)
  })

  it('should display the calendar when the button is clicked once the component is enabled', async () => {
    const instance = DatePicker.getInstance(root.id)
    if (instance) {
      instance.enable()
    }
    
    await userEvent.click(button)

    expect(getCalendarEl().hidden).toBe(false)
  })
})