import { userEvent } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker component year selection', () => {
  let root: HTMLElement
  let input: HTMLInputElement
  let button: HTMLButtonElement

  const template = `
    <div>
      <div>
        <label for="input-dob">Date of birth</label>
        <div data-part="date-picker-root">
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

  const getCalendarEl = () => root.querySelector('[data-part="date-picker-content"]') as HTMLElement

  beforeEach(async () => {
    document.body.innerHTML = template
    datePickerInit()
    root = document.querySelector('[data-part="date-picker-root"]')!
    input = root.querySelector('[data-part="date-picker-input"]')!
    button = root.querySelector('[data-part="date-picker-trigger"]')!
  })

  beforeEach(async () => {
    // Open year selection view
    await userEvent.fill(input, '6/20/2020')
    await userEvent.click(button)
    
    const yearTrigger = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
    await userEvent.click(yearTrigger)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should show year of 2020 as focused', () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedYear = yearView?.querySelector('[data-focus="true"]')
    expect(focusedYear?.getAttribute('data-value')).toBe('2020')
  })

  it('should show year of 2020 as selected', () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const selectedYear = yearView?.querySelector('[data-selected="true"]')
    expect(selectedYear?.getAttribute('data-value')).toBe('2020')
  })

  it('should navigate back three years when pressing up', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowUp}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2017')
  })

  it('should navigate ahead three years when pressing down', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowDown}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2023')
  })

  it('should navigate back one year when pressing left', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowLeft}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2019')
  })

  it('should navigate ahead one year when pressing right', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowRight}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2021')
  })

  it('should navigate to the beginning of the year row when pressing home', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{Home}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2019') // Beginning of row in 4×3 grid
  })

  it('should navigate to the end of the year row when pressing end', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{End}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2021') // End of row in 4×3 grid
  })

  it('should navigate back 12 years when pressing page up', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{PageUp}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2008')
  })

  it('should navigate forward 12 years when pressing page down', async () => {
    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedElement = yearView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{PageDown}')

    const newFocused = yearView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2032')
  })
})