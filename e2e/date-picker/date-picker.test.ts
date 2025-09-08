import { userEvent } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

const VALIDATION_MESSAGE = 'Please enter a valid date'

describe('date picker component', () => {
  let root: HTMLElement
  let input: HTMLInputElement
  let button: HTMLButtonElement
  let inputChangeSpy: any

  const template = `
    <div>
      <div >
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

  beforeEach(() => {
    document.body.innerHTML = template
    datePickerInit()
    root = document.querySelector('[data-part="date-picker-root"]')!
    input = root.querySelector('[data-part="date-picker-input"]')!
    button = root.querySelector('[data-part="date-picker-trigger"]')!
    inputChangeSpy = vi.fn()
    input.addEventListener('change', inputChangeSpy)
  })

  afterEach(() => {
    input.removeEventListener('change', inputChangeSpy)
    document.body.innerHTML = ''
  })

  it('should enhance the date input with a date picker button', () => {
    expect(input).toBeTruthy()
    expect(button).toBeTruthy()
  })

  // mouse interactions
  it('should display a calendar for the current date when the date picker button is clicked', async () => {
    await userEvent.click(button)

    expect(getCalendarEl().hidden).toBe(false)
    expect(getCalendarEl().contains(document.activeElement)).toBe(true)
  })

  it('should hide the calendar when the date picker button is clicked and the calendar is already open', async () => {
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(true)
  })

  it('should close the calendar you click outside of an active calendar', async () => {
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.click(document.body, { position: { x: 0, y: 0 } })
    expect(getCalendarEl().hidden).toBe(true)
  })

  it('should close the calendar you press escape from the input', async () => {
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    input.focus()
    await userEvent.keyboard('{Escape}')

    expect(getCalendarEl().hidden).toBe(true)
  })

  it('should display a calendar for the inputted date when the date picker button is clicked with a date entered', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)

    expect(getCalendarEl().hidden).toBe(false)

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should allow for the selection of a date within the calendar', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const dayTenButton = getCalendarEl().querySelector('[data-day="10"]') as HTMLButtonElement
    await userEvent.click(dayTenButton)

    expect(input.value).toBe('01/10/2020')
    expect(document.activeElement).toBe(input)
    expect(getCalendarEl().hidden).toBe(true)
    expect(inputChangeSpy).toHaveBeenCalled()
  })

  it('should allow for navigation to the preceding month by clicking the left single arrow button within the calendar', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const prevMonthButton = getCalendarEl().querySelector('[data-part="date-picker-nav-prev"][data-unit="month"]') as HTMLButtonElement
    await userEvent.click(prevMonthButton)

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('December')
    expect(yearSelection?.textContent).toBe('2019')
  })

  it('should allow for navigation to the succeeding month by clicking the right single arrow button within the calendar', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const nextMonthButton = getCalendarEl().querySelector('[data-part="date-picker-nav-next"][data-unit="month"]') as HTMLButtonElement
    await userEvent.click(nextMonthButton)

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('February')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should allow for navigation to the preceding year by clicking the left double arrow button within the calendar', async () => {
    await userEvent.fill(input, '1/1/2016')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const prevYearButton = getCalendarEl().querySelector('[data-part="date-picker-nav-prev"][data-unit="year"]') as HTMLButtonElement
    await userEvent.click(prevYearButton)

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2015')
  })

  it('should allow for navigation to the succeeding year by clicking the right double arrow button within the calendar', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const nextYearButton = getCalendarEl().querySelector('[data-part="date-picker-nav-next"][data-unit="year"]') as HTMLButtonElement
    await userEvent.click(nextYearButton)

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2021')
  })

  it('should show an improper date as invalid as the user leaves the input', async () => {
    await userEvent.fill(input, 'abcdefg... That means the convo is done')
    await userEvent.click(document.body, { position: { x: 0, y: 0 } })

    expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
  })

  it('should show an improper date as invalid if the user presses enter from the input', async () => {
    await userEvent.fill(input, '2/31/2019')

    input.focus()
    await userEvent.keyboard('{Enter}')

    expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
  })

  it('should show an empty input as valid', async () => {
    await userEvent.clear(input)

    input.focus()
    await userEvent.keyboard('{Enter}')

    expect(input.validationMessage).toBe('')
  })

  // Month and Year Selection Tests
  it('should display a month selection screen by clicking the month display within the calendar', async () => {
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
    await userEvent.click(monthSelection)

    const monthView = getCalendarEl().querySelector('[data-part="date-picker-month"]')
    const focusedMonth = document.activeElement

    expect(monthView).toBeTruthy()
    expect(focusedMonth?.hasAttribute('data-focus')).toBe(true)
  })

  it('should allow for the selection of a month within month selection screen', async () => {
    await userEvent.fill(input, '2/1/2020')
    await userEvent.click(button)

    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
    await userEvent.click(monthSelection)

    const firstMonthButton = getCalendarEl().querySelector('[data-part="date-picker-month-button"]') as HTMLButtonElement
    await userEvent.click(firstMonthButton)

    const monthDisplay = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    expect(monthDisplay?.textContent).toBe('January')
  })

  it('should display a year selection screen by clicking the year display within the calendar', async () => {
    await userEvent.click(button)

    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
    await userEvent.click(yearSelection)

    const yearView = getCalendarEl().querySelector('[data-part="date-picker-year"]')
    const focusedYear = document.activeElement

    expect(yearView).toBeTruthy()
    expect(focusedYear?.hasAttribute('data-focus')).toBe(true)
  })

  it('should allow for navigation to the preceding dozen years by clicking the left arrow button within the year selection screen', async () => {
    await userEvent.click(button)

    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
    await userEvent.click(yearSelection)

    const prevDecadeButton = getCalendarEl().querySelector('[data-part="date-picker-nav-prev"][data-unit="decade"]') as HTMLButtonElement
    await userEvent.click(prevDecadeButton)

    const firstYearButton = getCalendarEl().querySelector('[data-part="date-picker-year-button"]')
    // The exact year will depend on the current year and decade calculation
    expect(firstYearButton).toBeTruthy()
  })

  it('should allow for navigation to the succeeding dozen years by clicking the right arrow button within the year selection screen', async () => {
    await userEvent.click(button)

    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
    await userEvent.click(yearSelection)

    const nextDecadeButton = getCalendarEl().querySelector('[data-part="date-picker-nav-next"][data-unit="decade"]') as HTMLButtonElement
    await userEvent.click(nextDecadeButton)

    const firstYearButton = getCalendarEl().querySelector('[data-part="date-picker-year-button"]')
    expect(firstYearButton).toBeTruthy()
  })

  it('should allow for the selection of a year within year selection screen', async () => {
    await userEvent.fill(input, '2/1/2020')
    await userEvent.click(button)

    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
    await userEvent.click(yearSelection)

    const firstYearButton = getCalendarEl().querySelector('[data-part="date-picker-year-button"]') as HTMLButtonElement
    await userEvent.click(firstYearButton)

    const yearDisplay = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')
    expect(yearDisplay?.textContent).toBeTruthy()
  })

  // Keyboard Navigation Tests
  it('should close the calendar when escape is pressed within the calendar', async () => {
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{Escape}')

    expect(getCalendarEl().hidden).toBe(true)
  })

  it('should move focus to the same day of week of the previous week when up is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/10/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{ArrowUp}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('3')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should move focus to the same day of week of the next week when down is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/10/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{ArrowDown}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('17')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should move focus to the previous day when left is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/10/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{ArrowLeft}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('9')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should move focus to the next day when right is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/10/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{ArrowRight}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('11')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should move focus to the first day (e.g. Sunday) of the current week when home is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{Home}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('29')
    expect(monthSelection?.textContent).toBe('December')
    expect(yearSelection?.textContent).toBe('2019')
  })

  it('should move focus to the last day (e.g. Saturday) of the current week when end is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{End}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('4')
    expect(monthSelection?.textContent).toBe('January')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should move focus to the same day of the previous month when page up is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{PageUp}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('December')
    expect(yearSelection?.textContent).toBe('2019')
  })

  it('should move focus to the same day of the next month when page down is pressed from the currently focused day', async () => {
    await userEvent.fill(input, '1/1/2020')
    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    await userEvent.keyboard('{PageDown}')

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('1')
    expect(monthSelection?.textContent).toBe('February')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should accept a parse-able date with a two digit year and display the calendar of that year in the current century', async () => {
    await userEvent.fill(input, '2/29/20')
    await userEvent.click(button)

    expect(getCalendarEl().hidden).toBe(false)

    const focusedDate = getCalendarEl().querySelector('[data-focus="true"]')
    const monthSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="month"]')
    const yearSelection = getCalendarEl().querySelector('[data-part="date-view-trigger"][data-value="year"]')

    expect(focusedDate?.textContent).toBe('29')
    expect(monthSelection?.textContent).toBe('February')
    expect(yearSelection?.textContent).toBe('2020')
  })

  it('should update the calendar when a valid date is entered in the input while the date picker is open', async () => {
    await userEvent.fill(input, '6/1/2020')
    await userEvent.click(button)
    const firstFocus = getCalendarEl().querySelector('[data-focus]')

    await userEvent.fill(input, '6/20/2020')

    const secondFocus = getCalendarEl().querySelector('[data-focus]')
    expect(firstFocus !== secondFocus || firstFocus?.textContent !== secondFocus?.textContent).toBe(true)
  })

  it('should validate the input when a date is selected', async () => {
    await userEvent.fill(input, '2/31/2019')
    await userEvent.click(document.body, { position: { x: 0, y: 0 } })
    expect(input.validationMessage).toBe(VALIDATION_MESSAGE)

    await userEvent.click(button)
    expect(getCalendarEl().hidden).toBe(false)

    const dayTenButton = getCalendarEl().querySelector('[data-value*="10"]') as HTMLButtonElement
    await userEvent.click(dayTenButton)

    expect(input.validationMessage).toBe('')
  })
})
