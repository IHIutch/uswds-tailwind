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

async function setupMonthSelectionView(component: ReturnType<typeof createDisposableDatePicker>) {
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(button)

  const monthTrigger = query<HTMLButtonElement>(calendar, '[data-part="month-trigger"]')!
  await userEvent.click(monthTrigger)

  return { calendar }
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L51
it('should show month of June as focused', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedMonth = query(monthView, '[data-focus]')
  expect(focusedMonth?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L60
it('should show month of June as selected', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const selectedMonth = query(monthView, '[data-selected]')
  expect(selectedMonth?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L69
it('should navigate back three months when pressing up', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowUp}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('2') // March is 0-indexed (2)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L80
it('should navigate ahead three months when pressing down', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowDown}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('8') // September is 0-indexed (8)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L91
it('should navigate back one month when pressing left', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowLeft}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('4') // May is 0-indexed (4)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L102
it('should navigate ahead one month when pressing right', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowRight}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('6') // July is 0-indexed (6)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L113
it('should navigate to the beginning of the month row when pressing home', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{Home}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('3') // April is 0-indexed (3)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L124
it('should navigate to the end of the month row when pressing end', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{End}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5) - already at end of row
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L135
it('should navigate to January when pressing page up', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{PageUp}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('0') // January is 0-indexed (0)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-month-selection.spec.js#L146
it('should navigate to December when pressing page down', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = query(calendar, '[data-part="month-view"]')
  const focusedElement = query(monthView, '[data-focus]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{PageDown}')

  const newFocused = query(monthView, '[data-focus]')
  expect(newFocused?.getAttribute('data-value')).toBe('11') // December is 0-indexed (11)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1393-L1469 (month cells, status, bounds and selection back to the day grid)
it('shows twelve month choices with selected, focused, disabled and status states, then returns to the day grid', { tags: ['parity'] }, async () => {
  const bounded = template.replace(`id="${rootId}"`, `id="${rootId}" data-min-date="2024-03-01" data-max-date="2024-09-30"`)
  await using component = createDisposableDatePicker(rootId, bounded)
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/15/2024')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('button', { name: 'June. Select month' }).click()

  const months = queryAll<HTMLButtonElement>(calendar, '[data-part="month-view"] [data-part="cell-trigger"]')
  expect(months).toHaveLength(12)
  const june = page.getByRole('button', { name: 'June', exact: true }).element() as HTMLButtonElement
  expect(june.getAttribute('aria-selected')).toBe('true')
  expect(june.tabIndex).toBe(0)
  expect(document.activeElement).toBe(june)
  expect(page.getByRole('button', { name: 'February', exact: true }).element()).toBeDisabled()
  expect(page.getByRole('button', { name: 'October', exact: true }).element()).toBeDisabled()
  expect(page.getByRole('button', { name: 'August', exact: true }).element()).toBeEnabled()
  expect(component.elements.getStatusEl()?.textContent).toBe('Select a month.')

  await page.getByRole('button', { name: 'August', exact: true }).click()
  expect(calendar.hidden).toBe(false)
  const focusedDay = page.getByRole('button', { name: '15 August 2024 Thursday' }).element() as HTMLButtonElement
  expect(focusedDay.dataset.value).toBe('2024-08-15')
  expect(document.activeElement).toBe(focusedDay)
})
