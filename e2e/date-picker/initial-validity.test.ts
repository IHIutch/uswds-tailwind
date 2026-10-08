import { expect, it, vi } from 'vitest'
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L952-L954 (a default value is applied through setCalendarValue)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L875-L888 (setCalendarValue validates the input)
it('flags a default value before the minimum date as invalid', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2020-01-01" data-min-date="2024-01-01"'))
  await expect.element(component.elements.getInputEl()).toHaveValue('01/01/2020')
  await vi.waitFor(() => expect(component.elements.getInputEl().validationMessage).toBe('Please enter a valid date'))
})

it('marks a default value before the minimum date with aria-invalid', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2020-01-01" data-min-date="2024-01-01"'))
  await expect.element(component.elements.getInputEl()).toHaveValue('01/01/2020')
  await expect.element(component.elements.getInputEl()).toHaveAttribute('aria-invalid', 'true')
})
