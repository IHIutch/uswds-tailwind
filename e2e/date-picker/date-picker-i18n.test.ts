import { userEvent } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker in multiple languages', () => {
  let root: HTMLElement
  let button: HTMLButtonElement

  // Template with default date to match legacy test
  const template = `
    <div>
      <div>
        <label for="input-dob">Date of birth</label>
        <div data-part="date-picker-root" data-default-value="2020-05-15">
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

  function changeLanguage(lang: string) {
    document.documentElement.lang = lang
  }

  beforeEach(async () => {
    document.body.innerHTML = template
    datePickerInit()
    root = document.querySelector('[data-part="date-picker-root"]')!
    button = root.querySelector('[data-part="date-picker-trigger"]')!
  })

  afterEach(() => {
    document.body.innerHTML = ''
    changeLanguage('')
  })

  it('should display month in english by default', async () => {
    await userEvent.click(button)

    const monthTrigger = root.querySelector('[data-part="date-view-trigger"][data-value="month"]')
    expect(monthTrigger?.textContent).toBe('May')
  })

  it('should display month in the document language', async () => {
    changeLanguage('es')

    await userEvent.click(button)

    const monthTrigger = root.querySelector('[data-part="date-view-trigger"][data-value="month"]')
    expect(monthTrigger?.textContent).toBe('mayo')
  })

  it('should display the correct aria-label in the document language', async () => {
    changeLanguage('es')

    await userEvent.click(button)

    const monthTrigger = root.querySelector('[data-part="date-view-trigger"][data-value="month"]')
    expect(monthTrigger?.getAttribute('aria-label')).toBe('mayo. Select month')
  })

  it('should display the full list of months in english by default', async () => {
    await userEvent.click(button)

    const monthTrigger = root.querySelector('[data-part="date-view-trigger"][data-value="month"]')
    await userEvent.click(monthTrigger as HTMLButtonElement)

    const monthButtons = Array.from(
      root.querySelectorAll('[data-part="date-picker-month-button"]'),
    ).map(btn => btn.textContent)

    expect(monthButtons).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ])
  })

  it('should display the full list of months in the document language', async () => {
    changeLanguage('es')

    await userEvent.click(button)

    const monthTrigger = root.querySelector('[data-part="date-view-trigger"][data-value="month"]')
    await userEvent.click(monthTrigger as HTMLButtonElement)

    const monthButtons = Array.from(
      root.querySelectorAll('[data-part="date-picker-month-button"]'),
    ).map(btn => btn.textContent)

    expect(monthButtons).toEqual([
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ])
  })

  it('should display the days of the week headers in english by default', async () => {
    await userEvent.click(button)

    const dayHeaders = Array.from(
      root.querySelectorAll('[data-part="date-picker-day-header"]'),
    ).map(header => header.textContent)

    expect(dayHeaders).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
  })

  it('should display the days of the week headers in the document language', async () => {
    changeLanguage('es')

    await userEvent.click(button)

    const dayHeaders = Array.from(
      root.querySelectorAll('[data-part="date-picker-day-header"]'),
    ).map(header => header.textContent)

    expect(dayHeaders).toEqual(['D', 'L', 'M', 'X', 'J', 'V', 'S'])
  })

  it('should display the aria-label in the document language', async () => {
    changeLanguage('es')

    await userEvent.click(button)

    const dayHeaders = Array.from(
      root.querySelectorAll('[data-part="date-picker-day-header"]'),
    ).map(header => header.getAttribute('aria-label'))

    expect(dayHeaders).toEqual([
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ])
  })
})
