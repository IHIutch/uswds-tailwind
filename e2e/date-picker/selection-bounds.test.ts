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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L439-L448 (a month is disabled only when it lies wholly outside the bounds)
it('keeps a month selectable when the maximum date is its first day', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-max-date="2024-07-01"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await expect.element(page.getByRole('button', { name: 'July', exact: true })).toBeEnabled()
  await expect.element(page.getByRole('button', { name: 'August', exact: true })).toBeDisabled()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L439-L448 (a month is disabled only when it lies wholly outside the bounds)
it('keeps a month selectable when the minimum date is its last day', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2024-03-31"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await expect.element(page.getByRole('button', { name: 'March', exact: true })).toBeEnabled()
  await expect.element(page.getByRole('button', { name: 'February', exact: true })).toBeDisabled()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L450-L457 (a year is disabled only when it lies wholly outside the bounds)
it('keeps a year selectable when the maximum date is its first day', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-max-date="2025-01-01"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await expect.element(page.getByRole('button', { name: '2025', exact: true })).toBeEnabled()
  await expect.element(page.getByRole('button', { name: '2026', exact: true })).toBeDisabled()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L450-L457 (a year is disabled only when it lies wholly outside the bounds)
it('keeps a year selectable when the minimum date is its last day', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2023-12-31"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await expect.element(page.getByRole('button', { name: '2023', exact: true })).toBeEnabled()
  await expect.element(page.getByRole('button', { name: '2022', exact: true })).toBeDisabled()
})
