import { query, queryAll } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dob">Date of birth</label>
      <div data-scope="date-picker" data-part="root" id="${rootId}">
          <input data-part="input" id="input-dob" name="input-dob" type="text">
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

async function setupYearSelectionView(component: ReturnType<typeof createDisposableDatePicker>) {
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()

  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(button)

  const calendar = component.elements.getCalendarEl()!
  const yearTrigger = query(calendar, '[data-part="year-trigger"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  return { calendar }
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L49
it('should show year of 2020 as focused', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedYear = query(yearView, '[data-focus]')!
  expect(focusedYear.getAttribute('data-value')).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L58
it('should show year of 2020 as selected', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const selectedYear = query(yearView, '[data-selected]')!
  expect(selectedYear.getAttribute('data-value')).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L67
it('should navigate back three years when pressing up', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowUp}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2017')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L78
it('should navigate ahead three years when pressing down', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowDown}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2023')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L89
it('should navigate back one year when pressing left', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowLeft}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2019')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L100
it('should navigate ahead one year when pressing right', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowRight}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2021')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L111
it('should navigate to the beginning of the year row when pressing home', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{Home}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2019')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L122
it('should navigate to the end of the year row when pressing end', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{End}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2021')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L133
it('should navigate back 12 years when pressing page up', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{PageUp}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2008')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-year-selection.spec.js#L144
it('should navigate forward 12 years when pressing page down', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = query(calendar, '[data-part="year-view"]')!
  const focusedElement = query<HTMLButtonElement>(yearView, '[data-focus]')!
  focusedElement.focus()
  await userEvent.keyboard('{PageDown}')

  const newFocused = query(yearView, '[data-focus]')!
  expect(newFocused.getAttribute('data-value')).toBe('2032')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1487-L1722 (year chunks, status, selection and day-grid return)
it('shows twelve years, announces each chunk, and returns to the day grid after choosing a year', { tags: ['parity'] }, async () => {
  const bounded = template.replace(`id="${rootId}"`, `id="${rootId}" data-min-date="2000-01-01" data-max-date="2050-12-31"`)
  await using component = createDisposableDatePicker(rootId, bounded)
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/15/2024')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('button', { name: '2024. Select year' }).click()

  const years = () => queryAll<HTMLButtonElement>(calendar, '[data-part="year-view"] [data-part="cell-trigger"]')
  expect(years()).toHaveLength(12)
  expect(years()[0]?.dataset.value).toBe('2016')
  expect(years()[11]?.dataset.value).toBe('2027')
  const selectedYear = page.getByRole('button', { name: '2024', exact: true }).element() as HTMLButtonElement
  expect(selectedYear.getAttribute('aria-selected')).toBe('true')
  expect(selectedYear.tabIndex).toBe(0)
  expect(document.activeElement).toBe(selectedYear)
  expect(component.elements.getStatusEl()?.textContent).toBe('Showing years 2016 to 2027. Select a year.')

  await page.getByRole('button', { name: 'Navigate forward 12 years' }).click()
  expect(years()[0]?.dataset.value).toBe('2028')
  expect(years()[11]?.dataset.value).toBe('2039')
  expect(component.elements.getStatusEl()?.textContent).toBe('Showing years 2028 to 2039. Select a year.')
  await page.getByRole('button', { name: '2030', exact: true }).click()
  expect(calendar.hidden).toBe(false)
  const focusedDay = page.getByRole('button', { name: '15 June 2030 Saturday' }).element() as HTMLButtonElement
  expect(focusedDay.dataset.value).toBe('2030-06-15')
  expect(document.activeElement).toBe(focusedDay)
})
