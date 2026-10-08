import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div >
        <label for="input-dob">Date of birth</label>
        <div data-scope="date-picker" data-part="root" id="${rootId}">
          <input data-part="input" id="input-dob" name="input-dob" type="text">
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

const templateWith = (attributes: string) => template.replace(`id="${rootId}"`, `id="${rootId}" ${attributes}`)

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1461-L1470 (choosing a month moves the calendar to that month)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L310-L324 (setting the month keeps the day inside it)
it('moves to the last day of February when February is chosen from January 31', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-01-31"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await page.getByRole('button', { name: 'February', exact: true }).click()
  await expect.element(page.getByRole('button', { name: '29 February 2024 Thursday' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1714-L1723 (choosing a year moves the calendar to that year)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L326-L336 (setting the year keeps the day inside the month)
it('moves to February 28 when a non-leap year is chosen from February 29', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-02-29"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await page.getByRole('button', { name: '2023', exact: true }).click()
  await expect.element(page.getByRole('button', { name: '28 February 2023 Tuesday' })).toHaveFocus()
})
