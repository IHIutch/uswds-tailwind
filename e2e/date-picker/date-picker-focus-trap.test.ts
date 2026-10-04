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

async function openPicker(component: ReturnType<typeof createDisposableDatePicker>) {
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/15/2024')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  return component.elements.getCalendarEl()!
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-focus-trap.spec.js#L36
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-focus-trap.spec.js#L55
it('wraps Tab from the focused day to previous year and Shift+Tab back to the day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const calendar = await openPicker(component)
  const previousYear = page.getByRole('button', { name: 'Navigate back one year' }).element()
  const focusedDay = page.getByRole('button', { name: '15 June 2024 Saturday' }).element() as HTMLButtonElement
  expect(focusedDay.dataset.value).toBe('2024-06-15')
  expect(document.activeElement).toBe(focusedDay)

  await userEvent.keyboard('{Tab}')
  expect(document.activeElement).toBe(previousYear)
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
  expect(document.activeElement).toBe(focusedDay)
  expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L2067-L2118 (the month view traps focus on its only focusable cell)
it('keeps Tab and Shift+Tab on the sole focused month cell', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const calendar = await openPicker(component)
  await page.getByRole('button', { name: 'June. Select month' }).click()
  const focusedMonth = page.getByRole('button', { name: 'June', exact: true }).element() as HTMLButtonElement
  expect(focusedMonth.dataset.value).toBe('5')
  expect(document.activeElement).toBe(focusedMonth)

  await userEvent.keyboard('{Tab}')
  expect(document.activeElement).toBe(focusedMonth)
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
  expect(document.activeElement).toBe(focusedMonth)
  expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L2067-L2118 (the year view wraps from its focused year to the previous chunk control)
it('wraps Tab from the focused year to the previous chunk and Shift+Tab back', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const calendar = await openPicker(component)
  await page.getByRole('button', { name: '2024. Select year' }).click()
  const previousChunk = page.getByRole('button', { name: 'Navigate back 12 years' }).element() as HTMLButtonElement
  const focusedYear = page.getByRole('button', { name: '2024', exact: true }).element() as HTMLButtonElement

  expect(document.activeElement).toBe(focusedYear)
  await userEvent.keyboard('{Tab}')
  expect(document.activeElement).toBe(previousChunk)
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
  expect(document.activeElement).toBe(focusedYear)
  expect(calendar.hidden).toBe(false)
})
