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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1752-L1765 (a key move re-renders the calendar)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1215-L1226 (a re-render announces the month instead of the opening guidance)
it('announces the month after a key move', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(component.elements.getStatusEl()).toMatchTextContent('You can navigate by day using left and right arrows')

  await userEvent.keyboard('{ArrowRight}')
  await expect.element(component.elements.getStatusEl()).toHaveTextContent('June 2024')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1370-L1378 (typing into the open picker re-renders the calendar)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1211-L1226 (a re-render announces the selection and the month)
it('announces the month after a typed date re-centers the open calendar', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(component.elements.getStatusEl()).toMatchTextContent('You can navigate by day using left and right arrows')

  await userEvent.fill(component.elements.getInputEl(), '07/04/2024')
  await expect.element(component.elements.getStatusEl()).toHaveTextContent('Selected date. July 2024')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1461-L1470 (choosing a month re-renders the day grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1215-L1226 (a re-render announces the month instead of the opening guidance)
it('announces the month after one is chosen from the month view', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  await userEvent.click(component.elements.getTriggerEl())
  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await page.getByRole('button', { name: 'August', exact: true }).click()
  await expect.element(component.elements.getStatusEl()).toHaveTextContent('August 2024')
})
