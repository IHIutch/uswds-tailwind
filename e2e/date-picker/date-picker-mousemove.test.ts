import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
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
              <button data-part="prev-trigger" data-view="year"></button>
              <button data-part="next-trigger" data-view="year"></button>
            </div>
          </div>
          <div data-part="status"></div>
        </div>
      </div>
    </div>
  `

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-mousemove.spec.js#L41
it('should ignore mouse move events over disabled days', { tags: ['legacy'] }, async () => {
  const boundedTemplate = template.replace(`id="${rootId}"`, `id="${rootId}" data-min-date="2020-06-01" data-max-date="2020-06-24"`)
  await using component = createDisposableDatePicker(rootId, boundedTemplate)
  const calendar = component.elements.getCalendarEl()!

  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/20/2020')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()

  const focusedDay = page.getByRole('button', { name: '20 June 2020 Saturday' }).element() as HTMLButtonElement
  const disabledDay = page.getByRole('button', { name: '26 June 2020 Friday' }).element() as HTMLButtonElement
  expect(disabledDay).toBeDisabled()
  expect(document.activeElement).toBe(focusedDay)

  await page.getByRole('button', { name: '26 June 2020 Friday' }).hover()
  expect(document.activeElement).toBe(focusedDay)
  expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-mousemove.spec.js#L67
it('keeps the selected date and focus when hovering the same day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const calendar = component.elements.getCalendarEl()!
  const input = component.elements.getInputEl()

  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/20/2020')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()

  const focusedDay = page.getByRole('button', { name: '20 June 2020 Saturday' }).element() as HTMLButtonElement
  expect(document.activeElement).toBe(focusedDay)
  await page.getByRole('button', { name: '20 June 2020 Saturday' }).hover()

  expect(document.activeElement).toBe(focusedDay)
  expect(input.value).toBe('06/20/2020')
  expect(calendar.hidden).toBe(false)
})
