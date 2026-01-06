import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dob">Date of birth</label>
      <div data-part="date-picker-root" id="${rootId}" data-min-date="2020-05-22" data-max-date="2021-06-20">
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

it('should allow navigation back a year to a month that is partially disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/15/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevYearBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(prevYearBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should disable back buttons when displaying the minimum month', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/30/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevMonthBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="month"]') as HTMLButtonElement
  const prevYearBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="year"]') as HTMLButtonElement

  expect(prevMonthBtn).toBeDisabled()
  expect(prevYearBtn).toBeDisabled()

  // await userEvent.click(prevMonthBtn)
  // await userEvent.click(prevYearBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-30')
})

it('should disable forward buttons when displaying the maximum month', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/01/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthBtn = calendar.querySelector('[data-part="date-picker-nav-next"][data-unit="month"]') as HTMLButtonElement
  const nextYearBtn = calendar.querySelector('[data-part="date-picker-nav-next"][data-unit="year"]') as HTMLButtonElement

  expect(nextMonthBtn).toBeDisabled()
  expect(nextYearBtn).toBeDisabled()

  // await userEvent.click(nextMonthBtn)
  // await userEvent.click(nextYearBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-01')
})

it('should allow navigation back a year to a month that is less than a year from the minimum date being set and cap at that minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/15/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevYearBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(prevYearBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow navigation back a month to a month that is partially disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/15/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevMonthBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="month"]') as HTMLButtonElement
  await userEvent.click(prevMonthBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should not allow navigation back a month to a month that is fully disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/30/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevYearBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="year"]') as HTMLButtonElement
  expect(prevYearBtn).toBeDisabled()

  // const prevMonthBtn = calendar.querySelector('[data-part="date-picker-nav-prev"][data-unit="month"]') as HTMLButtonElement
  // await userEvent.click(prevMonthBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-30')
})

it('should allow navigation forward a year to a month that is partially disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextYearBtn = calendar.querySelector('[data-part="date-picker-nav-next"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(nextYearBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow navigation forward a year to a month that is less than a year from the maximum date and cap at that maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '07/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextYearBtn = calendar.querySelector('[data-part="date-picker-nav-next"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(nextYearBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow navigation forward a month to a month that is partially disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/25/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthBtn = calendar.querySelector('[data-part="date-picker-nav-next"][data-unit="month"]') as HTMLButtonElement
  await userEvent.click(nextMonthBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should not allow navigation forward a month to a month that is fully disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/17/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthBtn = calendar.querySelector('[data-part="date-picker-nav-next"][data-unit="month"]') as HTMLButtonElement
  expect(nextMonthBtn).toBeDisabled()
  // await userEvent.click(nextMonthBtn)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-17')
})

it('should allow selection of a month in the month selection screen that is partially disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '12/01/2020')
  await userEvent.click(button)

  const monthTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
  await userEvent.click(monthTrigger)

  expect(calendar.querySelector('[data-part="date-picker-month"]')).toBeTruthy()

  const mayButton = calendar.querySelector('[data-value="4"]') as HTMLButtonElement
  await userEvent.click(mayButton)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
  expect(calendar.querySelector('[data-part="date-picker-day"]')).toBeTruthy()
})

it('should not allow selection of a month in the month selection screen that is fully disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '10/31/2020')
  await userEvent.click(button)

  const monthTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
  // expect(monthTrigger).toBeDisabled()
  await userEvent.click(monthTrigger)

  expect(calendar.querySelector('[data-part="date-picker-month"]')).toBeTruthy()

  const januaryButton = calendar.querySelector('[data-value="0"]') as HTMLButtonElement
  expect(januaryButton).toBeDisabled()
  // await userEvent.click(januaryButton)

  expect(calendar.querySelector('[data-part="date-picker-month"]')).toBeTruthy()
})

it('should allow selection of a month in the month selection screen that is partially disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '01/30/2021')
  await userEvent.click(button)

  const monthTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
  await userEvent.click(monthTrigger)

  expect(calendar.querySelector('[data-part="date-picker-month"]')).toBeTruthy()

  const juneButton = calendar.querySelector('[data-value="5"]') as HTMLButtonElement
  await userEvent.click(juneButton)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
  expect(calendar.querySelector('[data-part="date-picker-day"]')).toBeTruthy()
})

it('should not allow selection of a month in the month selection screen that is fully disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '02/29/2021')
  await userEvent.click(button)

  const monthTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="month"]') as HTMLButtonElement
  await userEvent.click(monthTrigger)

  expect(calendar.querySelector('[data-part="date-picker-month"]')).toBeTruthy()

  const decemberButton = calendar.querySelector('[data-value="11"]') as HTMLButtonElement
  expect(decemberButton).toBeDisabled()
  // await userEvent.click(decemberButton)

  // expect(calendar.querySelector('[data-part="date-picker-month"]')).toBeTruthy()
})

it('should allow selection of a year in the year selection screen that is partially disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/01/2021')
  await userEvent.click(button)

  const yearTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(calendar.querySelector('[data-part="date-picker-year"]')).toBeTruthy()

  const year2020Button = calendar.querySelector('[data-value="2020"]') as HTMLButtonElement
  await userEvent.click(year2020Button)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
  expect(calendar.querySelector('[data-part="date-picker-day"]')).toBeTruthy()
})

it('should allow selection of a year in the year selection screen that is partially disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '12/01/2020')
  await userEvent.click(button)

  const yearTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(calendar.querySelector('[data-part="date-picker-year"]')).toBeTruthy()

  const year2021Button = calendar.querySelector('[data-value="2021"]') as HTMLButtonElement
  await userEvent.click(year2021Button)

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
  expect(calendar.querySelector('[data-part="date-picker-day"]')).toBeTruthy()
})

it('should not allow selection of a year in the year selection screen that is fully disabled due to a minimum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '07/04/2020')
  await userEvent.click(button)

  const yearTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(calendar.querySelector('[data-part="date-picker-year"]')).toBeTruthy()

  const year2018Button = calendar.querySelector('[data-value="2018"]') as HTMLButtonElement
  expect(year2018Button).toBeDisabled()
  // await userEvent.click(year2018Button)

  // expect(calendar.querySelector('[data-part="date-picker-year"]')).toBeTruthy()
})

it('should not allow selection of a year in the year selection screen that is fully disabled due to a maximum date being set', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '12/01/2020')
  await userEvent.click(button)

  const yearTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(calendar.querySelector('[data-part="date-picker-year"]')).toBeTruthy()

  const year2023Button = calendar.querySelector('[data-value="2023"]') as HTMLButtonElement
  expect(year2023Button).toBeDisabled()
  // await userEvent.click(year2023Button)

  // expect(calendar.querySelector('[data-part="date-picker-year"]')).toBeTruthy()
})

it('should allow selection of a date that is the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day22Button = calendar.querySelector('[data-day="22"]') as HTMLButtonElement
  await userEvent.click(day22Button)

  expect(input.value).toBe('05/22/2020')
})

it('should allow selection of a date that is the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/15/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day20Button = calendar.querySelector('[data-day="20"]') as HTMLButtonElement
  await userEvent.click(day20Button)
  expect(input.value).toBe('06/20/2020')
})

it('should not allow selection of a date that is before the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day15Button = calendar.querySelector('[data-day="15"]') as HTMLButtonElement
  expect(day15Button).toBeDisabled()
  // await userEvent.click(day15Button)
  // expect(calendar.hidden).toBe(false)
})

it('should not allow selection of a date that is after the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/15/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day25Button = calendar.querySelector('[data-day="25"]') as HTMLButtonElement
  expect(day25Button).toBeDisabled()
  // await userEvent.click(day25Button)
  // expect(calendar.hidden).toBe(false)
})

it('should allow keyboard navigation to move back one day to a date that is the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/23/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowLeft}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move back one week to a date that is the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/29/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowUp}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move back one month to a date that is the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/22/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageUp}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move back one year to a date that is the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/22/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should not allow keyboard navigation to move back one day to a date that is before the minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/22/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowLeft}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move to the start of the week to a date that is before the minimum date but cap at minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/23/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Home}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move back one week to a date that is before the minimum date but cap at minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/28/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowUp}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move back one month to a date that is before the minimum date but cap at minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/21/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageUp}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move back one year to a date that is before the minimum date but cap at minimum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/21/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should allow keyboard navigation to move forward one day to a date that is the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/19/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowRight}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move forward one week to a date that is the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/13/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowDown}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move forward one month to a date that is the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/20/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageDown}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move forward one year to a date that is the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should not allow keyboard navigation to move forward one day to a date that is after the maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowRight}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move to the end of the week to a date that is after the maximum date but cap at maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{End}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move forward one week to a date that is after the maximum date but cap at maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/14/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowDown}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move forward one month to a date that is after the maximum date but cap at maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/21/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageDown}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should allow keyboard navigation to move forward one year to a date that is after the maximum date but cap at maximum date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/21/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')

  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should show a date that is after the maximum date as invalid', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '06/30/2021')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('Please enter a valid date')
})

it('should show a date that is the maximum date as valid', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '06/20/2021')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('')
})

it('should show a date that is before the minimum date as invalid', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '05/01/2020')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('Please enter a valid date')
})

it('should show a date that is the minimum date as valid', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '05/22/2020')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('')
})

it('should open the calendar on the min date when the input date is before the min date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/15/2020')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

it('should open the calendar on the max date when the input date is after the max date', async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/15/2023')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

it('should open the calendar on the max date when the input is empty and the current date is after the max date', async () => {
  const templateWithConstraints = template.replace(
    'data-min-date="2020-05-22" data-max-date="2021-06-20"',
    'data-min-date="2020-01-01" data-max-date="2020-02-14"',
  )

  const component = createDisposableDatePicker(rootId, templateWithConstraints)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  const focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-02-14')
})

it('should update the calendar to the max date when the input is changed and the input date is after the max date', async () => {
  const templateWithConstraints = template.replace(
    'data-min-date="2020-05-22" data-max-date="2021-06-20"',
    'data-min-date="2020-01-01" data-max-date="2020-02-14"',
  )

  const component = createDisposableDatePicker(rootId, templateWithConstraints)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '01/20/2020')
  await userEvent.click(button)

  let focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-01-20')

  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(document.body, { force: true })

  focusedDate = calendar.querySelector('[data-focus="true"]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-02-14')
})
