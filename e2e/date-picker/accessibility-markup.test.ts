import { query } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div >
        <div data-scope="date-picker" data-part="root" id="${rootId}">
          <label data-part="label">Date of birth</label>
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L937 (the calendar button announces that it opens a popup)
it('marks the calendar button as opening a popup', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  await expect.element(component.elements.getTriggerEl()).toHaveAttribute('aria-haspopup', 'true')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L939 (calendar updates are announced through a polite status region)
it('announces calendar updates through a polite status region', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  await expect.element(component.elements.getStatusEl()).toHaveAttribute('role', 'status')
  await expect.element(component.elements.getStatusEl()).toHaveAttribute('aria-live', 'polite')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1440 (the month grid is a presentation table)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1588 (the year grid is a presentation table)
it('presents the month and year grids as layout rather than data tables', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(query(component.elements.getViewEl('day'), 'table')!).not.toHaveAttribute('role')

  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await expect.element(query(component.elements.getMonthSelectionEl(), 'table')!).toHaveAttribute('role', 'presentation')

  await page.getByRole('button', { name: 'June', exact: true }).click()
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await expect.element(query(component.elements.getYearSelectionEl(), 'table')!).toHaveAttribute('role', 'presentation')
})
