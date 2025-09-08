import { userEvent } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker component month selection', () => {
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
    // Open month selection view
    await userEvent.fill(input, '6/20/2020')
    await userEvent.click(button)
    
    const monthTrigger = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
    await userEvent.click(monthTrigger)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should show month of June as focused', () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedMonth = monthView?.querySelector('[data-focus="true"]')
    expect(focusedMonth?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5)
  })

  it('should show month of June as selected', () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const selectedMonth = monthView?.querySelector('[data-selected="true"]')
    expect(selectedMonth?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5)
  })

  it('should navigate back three months when pressing up', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowUp}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('2') // March is 0-indexed (2)
  })

  it('should navigate ahead three months when pressing down', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowDown}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('8') // September is 0-indexed (8)
  })

  it('should navigate back one month when pressing left', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowLeft}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('4') // May is 0-indexed (4)
  })

  it('should navigate ahead one month when pressing right', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{ArrowRight}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('6') // July is 0-indexed (6)
  })

  it('should navigate to the beginning of the month row when pressing home', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{Home}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('3') // April is 0-indexed (3)
  })

  it('should navigate to the end of the month row when pressing end', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{End}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5) - already at end of row
  })

  it('should navigate to January when pressing page up', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{PageUp}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('0') // January is 0-indexed (0)
  })

  it('should navigate to December when pressing page down', async () => {
    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
    focusedElement?.focus()
    await userEvent.keyboard('{PageDown}')

    const newFocused = monthView?.querySelector('[data-focus="true"]')
    expect(newFocused?.getAttribute('data-value')).toBe('11') // December is 0-indexed (11)
  })
})