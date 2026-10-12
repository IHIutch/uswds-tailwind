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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1752-L1765 (calendar key moves cancel the browser's default scrolling)
it('keeps the page still while arrow keys move through the calendar', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `${templateWith('data-default-value="2024-06-15"')}<div style="height: 4000px"></div>`)
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(page.getByRole('button', { name: '15 June 2024 Saturday' })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('button', { name: '22 June 2024 Saturday' })).toHaveFocus()
  await new Promise(resolve => setTimeout(resolve, 250))
  expect(window.scrollY).toBe(0)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1752-L1765 (a key move capped at a bound leaves the calendar untouched)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1215-L1226 (only a re-render replaces the opening guidance)
it('leaves the opening guidance in place when a key move stops at the minimum date', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2024-06-15"'))
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(component.elements.getStatusEl()).toMatchTextContent('Selected date. You can navigate by day using left and right arrows')

  await userEvent.keyboard('{ArrowLeft}')
  await expect.element(page.getByRole('button', { name: '15 June 2024 Saturday' })).toHaveFocus()
  await new Promise(resolve => setTimeout(resolve, 250))
  await expect.element(component.elements.getStatusEl()).toMatchTextContent('Selected date. You can navigate by day using left and right arrows')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1886-L1905 (month view key moves stop at December)
it('stops at December when moving down from November in the month view', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-11-15"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await expect.element(page.getByRole('button', { name: 'November', exact: true })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('button', { name: 'December', exact: true })).toHaveFocus()
})
