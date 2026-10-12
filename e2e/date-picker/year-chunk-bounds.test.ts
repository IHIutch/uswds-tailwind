import { expect, it, vi } from 'vitest'
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1494-L1505 (a 12-year button disables when the neighbouring chunk is wholly out of range)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1567-L1585 (disabled 12-year buttons)
it('disables the previous 12 years button when every earlier year is before the minimum date', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2016-06-01"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await expect.element(component.elements.getPrevTriggerEl('year-chunk')).toBeDisabled()
  await expect.element(component.elements.getNextTriggerEl('year-chunk')).toBeEnabled()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1494-L1505 (a 12-year button disables when the neighbouring chunk is wholly out of range)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1567-L1585 (disabled 12-year buttons)
it('disables the next 12 years button when every later year is after the maximum date', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-max-date="2027-06-30"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await expect.element(component.elements.getNextTriggerEl('year-chunk')).toBeDisabled()
  await expect.element(component.elements.getPrevTriggerEl('year-chunk')).toBeEnabled()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1684-L1707 (focus falls back to the year grid when the next 12 years button disables itself)
it('moves focus to the year grid when the next 12 years button disables itself', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-max-date="2039-06-30"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('year'))
  await userEvent.click(component.elements.getNextTriggerEl('year-chunk'))
  await expect.element(page.getByRole('button', { name: '2039', exact: true })).toBeVisible()
  await expect.element(component.elements.getNextTriggerEl('year-chunk')).toBeDisabled()
  await vi.waitFor(() => expect(component.elements.getYearSelectionEl()).toHaveFocus())
})
