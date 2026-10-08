import { queryAll } from '@zag-js/dom-query'
import { expect, it, vi } from 'vitest'
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
const anchored = templateWith('data-range-date="2020-05-17" data-default-date="2020-05-17"')
const previewed = (calendar: Element) => queryAll<HTMLButtonElement>(calendar, '[data-part="table-cell-trigger"][data-in-range]').map(button => button.dataset.value)

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1875 (hovering paints a preview on the current grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1752-L1765 (a key move re-renders the grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1010-L1015 (a re-render previews from the displayed date)
it('drops the hover preview when a key moves the focused date', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()
  await userEvent.click(component.elements.getTriggerEl())
  await page.getByRole('button', { name: '12 May 2020 Tuesday' }).hover()
  await vi.waitFor(() => expect(previewed(calendar)).toEqual(['2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16']))

  await userEvent.keyboard('{ArrowRight}')
  await expect.element(page.getByRole('button', { name: '18 May 2020 Monday' })).toHaveFocus()
  expect(previewed(calendar)).toEqual([])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1875 (hovering paints a preview on the current grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1277-L1289 (next-month navigation re-renders the grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1010-L1015 (a re-render previews from the displayed date)
it('previews from the displayed date after moving to the next month', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()
  await userEvent.click(component.elements.getTriggerEl())
  await page.getByRole('button', { name: '12 May 2020 Tuesday' }).hover()
  await vi.waitFor(() => expect(previewed(calendar)).toEqual(['2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16']))

  await userEvent.click(component.elements.getNextTriggerEl('month'))
  await expect.element(component.elements.getStatusEl()).toHaveTextContent('June 2020')
  expect(previewed(calendar)).toEqual([
    '2020-05-31',
    '2020-06-01',
    '2020-06-02',
    '2020-06-03',
    '2020-06-04',
    '2020-06-05',
    '2020-06-06',
    '2020-06-07',
    '2020-06-08',
    '2020-06-09',
    '2020-06-10',
    '2020-06-11',
    '2020-06-12',
    '2020-06-13',
    '2020-06-14',
    '2020-06-15',
    '2020-06-16',
  ])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1875 (hovering paints a preview on the current grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1370-L1378 (typing into the open picker re-renders the grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1010-L1015 (a re-render previews from the displayed date)
it('previews from the typed date after typing into the open picker', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()
  await userEvent.click(component.elements.getTriggerEl())
  await page.getByRole('button', { name: '12 May 2020 Tuesday' }).hover()
  await vi.waitFor(() => expect(previewed(calendar)).toEqual(['2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16']))

  await userEvent.fill(component.elements.getInputEl(), '05/20/20')
  await vi.waitFor(() => expect(previewed(calendar)).toEqual(['2020-05-18', '2020-05-19']))
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1875 (hovering paints a preview on the current grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1461-L1470 (choosing a month re-renders the grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1010-L1015 (a re-render previews from the displayed date)
it('drops the hover preview when a month is chosen from the month view', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()
  await userEvent.click(component.elements.getTriggerEl())
  await page.getByRole('button', { name: '12 May 2020 Tuesday' }).hover()
  await vi.waitFor(() => expect(previewed(calendar)).toEqual(['2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16']))

  await userEvent.click(component.elements.getViewTriggerEl('month'))
  await page.getByRole('button', { name: 'May', exact: true }).click()
  await expect.element(page.getByRole('button', { name: '17 May 2020 Sunday' })).toHaveFocus()
  expect(previewed(calendar)).toEqual([])
})
