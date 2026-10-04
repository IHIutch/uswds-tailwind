import { query } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dob">Date of birth</label>
      <div data-scope="date-picker" data-part="root" id="${rootId}" data-min-date="2020-05-22" data-max-date="2021-06-20">
        <input data-part="input" id="input-dob" name="input-dob" type="text">
        <input data-part="hidden-input" type="hidden">
        <button data-part="trigger" type="button"></button>
        <div data-part="content" hidden>
          <div data-part="view" data-view="day">
            <div data-part="view-control">
              <button data-part="prev-trigger" data-unit="year" type="button"></button>
              <button data-part="prev-trigger" data-unit="month" type="button"></button>
              <button data-part="view-trigger" data-view="month" type="button"></button>
              <button data-part="view-trigger" data-view="year" type="button"></button>
              <button data-part="next-trigger" data-unit="month" type="button"></button>
              <button data-part="next-trigger" data-unit="year" type="button"></button>
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
                    <button data-part="table-cell-trigger"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div data-part="view" data-view="month">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button data-part="table-cell-trigger"></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div data-part="view" data-view="year">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button data-part="table-cell-trigger"></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button data-part="prev-trigger" data-unit="chunk"></button>
            <button data-part="next-trigger" data-unit="chunk"></button>
          </div>
        </div>
        <div data-part="status"></div>
      </div>
    </div>
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L52
it('should allow navigation back a year to a month that is partially disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/15/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await page.getByRole('button', { name: 'Navigate back one year' }).click()

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L71
it('should disable back buttons when displaying the minimum month', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/30/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevMonthBtn = query(calendar, '[data-part="prev-trigger"][data-unit="month"]') as HTMLButtonElement
  const prevYearBtn = query(calendar, '[data-part="prev-trigger"][data-unit="year"]') as HTMLButtonElement

  expect(prevMonthBtn).toBeDisabled()
  expect(prevYearBtn).toBeDisabled()

  // await userEvent.click(prevMonthBtn)
  // await userEvent.click(prevYearBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-30')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L102
it('should disable forward buttons when displaying the maximum month', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/01/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthBtn = query(calendar, '[data-part="next-trigger"][data-unit="month"]') as HTMLButtonElement
  const nextYearBtn = query(calendar, '[data-part="next-trigger"][data-unit="year"]') as HTMLButtonElement

  expect(nextMonthBtn).toBeDisabled()
  expect(nextYearBtn).toBeDisabled()

  // await userEvent.click(nextMonthBtn)
  // await userEvent.click(nextYearBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-01')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L133
it('should allow navigation back a year to a month that is less than a year from the minimum date being set and cap at that minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/15/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevYearBtn = query(calendar, '[data-part="prev-trigger"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(prevYearBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L152
it('should allow navigation back a month to a month that is partially disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/15/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevMonthBtn = query(calendar, '[data-part="prev-trigger"][data-unit="month"]') as HTMLButtonElement
  await userEvent.click(prevMonthBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L171
it('should not allow navigation back a month to a month that is fully disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/30/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevYearBtn = query(calendar, '[data-part="prev-trigger"][data-unit="year"]') as HTMLButtonElement
  expect(prevYearBtn).toBeDisabled()

  // const prevMonthBtn = query(calendar, '[data-part="prev-trigger"][data-unit="month"]') as HTMLButtonElement
  // await userEvent.click(prevMonthBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-30')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L196
it('should allow navigation forward a year to a month that is partially disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextYearBtn = query(calendar, '[data-part="next-trigger"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(nextYearBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L215
it('should allow navigation forward a year to a month that is less than a year from the maximum date and cap at that maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '07/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextYearBtn = query(calendar, '[data-part="next-trigger"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(nextYearBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L234
it('should allow navigation forward a month to a month that is partially disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/25/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthBtn = query(calendar, '[data-part="next-trigger"][data-unit="month"]') as HTMLButtonElement
  await userEvent.click(nextMonthBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L253
it('should not allow navigation forward a month to a month that is fully disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/17/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthBtn = query(calendar, '[data-part="next-trigger"][data-unit="month"]') as HTMLButtonElement
  expect(nextMonthBtn).toBeDisabled()
  // await userEvent.click(nextMonthBtn)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-17')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L272
it('should allow selection of a month in the month selection screen that is partially disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '12/01/2020')
  await userEvent.click(button)

  const monthTrigger = query(calendar, '[data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  await userEvent.click(monthTrigger)

  expect(query(calendar, '[data-part="view"][data-view="month"]')).toBeTruthy()

  const mayButton = query(calendar, '[data-value="4"]') as HTMLButtonElement
  await userEvent.click(mayButton)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
  expect(query(calendar, '[data-part="view-control"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L301
it('should not allow selection of a month in the month selection screen that is fully disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '10/31/2020')
  await userEvent.click(button)

  const monthTrigger = query(calendar, '[data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  // expect(monthTrigger).toBeDisabled()
  await userEvent.click(monthTrigger)

  expect(query(calendar, '[data-part="view"][data-view="month"]')).toBeTruthy()

  const januaryButton = query(calendar, '[data-value="0"]') as HTMLButtonElement
  expect(januaryButton).toBeDisabled()
  // await userEvent.click(januaryButton)

  expect(query(calendar, '[data-part="view"][data-view="month"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L324
it('should allow selection of a month in the month selection screen that is partially disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '01/30/2021')
  await userEvent.click(button)

  const monthTrigger = query(calendar, '[data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  await userEvent.click(monthTrigger)

  expect(query(calendar, '[data-part="view"][data-view="month"]')).toBeTruthy()

  const juneButton = query(calendar, '[data-value="5"]') as HTMLButtonElement
  await userEvent.click(juneButton)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
  expect(query(calendar, '[data-part="view-control"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L353
it('should not allow selection of a month in the month selection screen that is fully disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '02/29/2021')
  await userEvent.click(button)

  const monthTrigger = query(calendar, '[data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  await userEvent.click(monthTrigger)

  expect(query(calendar, '[data-part="view"][data-view="month"]')).toBeTruthy()

  const decemberButton = query(calendar, '[data-value="11"]') as HTMLButtonElement
  expect(decemberButton).toBeDisabled()
  // await userEvent.click(decemberButton)

  // expect(query(calendar, '[data-part="view"][data-view="month"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L376
it('should allow selection of a year in the year selection screen that is partially disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/01/2021')
  await userEvent.click(button)

  const yearTrigger = query(calendar, '[data-part="view-trigger"][data-view="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(query(calendar, '[data-part="view"][data-view="year"]')).toBeTruthy()

  const year2020Button = query(calendar, '[data-value="2020"]') as HTMLButtonElement
  await userEvent.click(year2020Button)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
  expect(query(calendar, '[data-part="view-control"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L401
it('should allow selection of a year in the year selection screen that is partially disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '12/01/2020')
  await userEvent.click(button)

  const yearTrigger = query(calendar, '[data-part="view-trigger"][data-view="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(query(calendar, '[data-part="view"][data-view="year"]')).toBeTruthy()

  const year2021Button = query(calendar, '[data-value="2021"]') as HTMLButtonElement
  await userEvent.click(year2021Button)

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
  expect(query(calendar, '[data-part="view-control"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L426
it('should not allow selection of a year in the year selection screen that is fully disabled due to a minimum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '07/04/2020')
  await userEvent.click(button)

  const yearTrigger = query(calendar, '[data-part="view-trigger"][data-view="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(query(calendar, '[data-part="view"][data-view="year"]')).toBeTruthy()

  const year2018Button = query(calendar, '[data-value="2018"]') as HTMLButtonElement
  expect(year2018Button).toBeDisabled()
  // await userEvent.click(year2018Button)

  // expect(query(calendar, '[data-part="view"][data-view="year"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L445
it('should not allow selection of a year in the year selection screen that is fully disabled due to a maximum date being set', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '12/01/2020')
  await userEvent.click(button)

  const yearTrigger = query(calendar, '[data-part="view-trigger"][data-view="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  expect(query(calendar, '[data-part="view"][data-view="year"]')).toBeTruthy()

  const year2023Button = query(calendar, '[data-value="2023"]') as HTMLButtonElement
  expect(year2023Button).toBeDisabled()
  // await userEvent.click(year2023Button)

  // expect(query(calendar, '[data-part="view"][data-view="year"]')).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L464
it('should allow selection of a date that is the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day22Button = query(calendar, '[data-day="22"]') as HTMLButtonElement
  await userEvent.click(day22Button)

  expect(input.value).toBe('05/22/2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L486
it('should allow selection of a date that is the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/15/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day20Button = query(calendar, '[data-day="20"]') as HTMLButtonElement
  await userEvent.click(day20Button)
  expect(input.value).toBe('06/20/2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L508
it('should not allow selection of a date that is before the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/25/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day15Button = query(calendar, '[data-day="15"]') as HTMLButtonElement
  expect(day15Button).toBeDisabled()
  // await userEvent.click(day15Button)
  // expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L530
it('should not allow selection of a date that is after the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/15/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const day25Button = query(calendar, '[data-day="25"]') as HTMLButtonElement
  expect(day25Button).toBeDisabled()
  // await userEvent.click(day25Button)
  // expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L552
it('should allow keyboard navigation to move back one day to a date that is the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/23/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowLeft}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L571
it('should allow keyboard navigation to move back one week to a date that is the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/29/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowUp}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L590
it('should allow keyboard navigation to move back one month to a date that is the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/22/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageUp}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L609
it('should allow keyboard navigation to move back one year to a date that is the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/22/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L628
it('should not allow keyboard navigation to move back one day to a date that is before the minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/22/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowLeft}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L647
it('should allow keyboard navigation to move to the start of the week to a date that is before the minimum date but cap at minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/23/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Home}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L666
it('should allow keyboard navigation to move back one week to a date that is before the minimum date but cap at minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/28/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowUp}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L685
it('should allow keyboard navigation to move back one month to a date that is before the minimum date but cap at minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/21/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageUp}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L704
it('should allow keyboard navigation to move back one year to a date that is before the minimum date but cap at minimum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/21/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L723
it('should allow keyboard navigation to move forward one day to a date that is the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/19/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowRight}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L742
it('should allow keyboard navigation to move forward one week to a date that is the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/13/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowDown}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L761
it('should allow keyboard navigation to move forward one month to a date that is the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/20/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageDown}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L780
it('should allow keyboard navigation to move forward one year to a date that is the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L799
it('should not allow keyboard navigation to move forward one day to a date that is after the maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowRight}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L818
it('should allow keyboard navigation to move to the end of the week to a date that is after the maximum date but cap at maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/20/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{End}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L838
it('should allow keyboard navigation to move forward one week to a date that is after the maximum date but cap at maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/14/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowDown}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L857
it('should allow keyboard navigation to move forward one month to a date that is after the maximum date but cap at maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/21/2021')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageDown}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L876
it('should allow keyboard navigation to move forward one year to a date that is after the maximum date but cap at maximum date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/21/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')

  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L895
it('should show a date that is after the maximum date as invalid', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '06/30/2021')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('Please enter a valid date')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L903
it('should show a date that is the maximum date as valid', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '06/20/2021')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L911
it('should show a date that is before the minimum date as invalid', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '05/01/2020')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('Please enter a valid date')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L919
it('should show a date that is the minimum date as valid', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '05/22/2020')
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L937
it('should open the calendar on the min date when the input date is before the min date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/15/2020')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L954
it('should open the calendar on the max date when the input date is after the max date', { tags: ['legacy'] }, async () => {
  const component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '04/15/2023')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2021-06-20')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L971
it('should open the calendar on the max date when the input is empty and the current date is after the max date', { tags: ['legacy'] }, async () => {
  const templateWithConstraints = template.replace(
    'data-min-date="2020-05-22" data-max-date="2021-06-20"',
    'data-min-date="2020-01-01" data-max-date="2020-02-14"',
  )

  const component = createDisposableDatePicker(rootId, templateWithConstraints)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  const focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-02-14')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-min-date-max-date.spec.js#L989
it('should update the calendar to the max date when the input is changed and the input date is after the max date', { tags: ['legacy'] }, async () => {
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

  let focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-01-20')

  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(document.body, { force: true })

  focusedDate = query(calendar, '[data-focus]')
  expect(focusedDate?.getAttribute('data-value')).toBe('2020-02-14')
})
