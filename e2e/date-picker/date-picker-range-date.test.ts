import { query, queryAll } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
    <div>
      <div class="usa-form-group">
        <label class="usa-label" for="input-dates-of-use">Dates of use</label>
        <div data-scope="date-picker" data-part="root" data-range-date="2020-05-22" id="${rootId}">
          <input
            data-part="input"
            id="input-dates-of-use"
            name="input-dates-of-use"
            type="text"
          />
          <input data-part="hidden-input" type="hidden">
          <button data-part="trigger" type="button"></button>
          <div data-part="content" hidden>
            <div data-part="day-view">
              <div data-part="view-control">
                <button data-part="prev-year-trigger" type="button"></button>
                <button data-part="prev-month-trigger" type="button"></button>
                <button data-part="month-trigger" type="button"></button>
                <button data-part="year-trigger" type="button"></button>
                <button data-part="next-month-trigger" type="button"></button>
                <button data-part="next-year-trigger" type="button"></button>
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
                      <button data-part="cell-trigger"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div data-part="month-view">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="cell-trigger"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div data-part="year-view">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="cell-trigger"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button data-part="prev-year-chunk-trigger"></button>
              <button data-part="next-year-chunk-trigger"></button>
            </div>
          </div>
          <div data-part="status"></div>
        </div>
      </div>
    </div>
  `

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-range-date.spec.js#L43
it('should display the range date when showing the month of the range date', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '05/21/2020')
  await userEvent.click(button)

  const rangeDate = query(calendar, '[data-range-date]') as HTMLElement
  expect(rangeDate).toBeTruthy()
  expect(rangeDate.getAttribute('data-value')).toBe('2020-05-22')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-range-date.spec.js#L56
it('should not display the range date when showing a month different from the range date month', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '06/21/2020')
  await userEvent.click(button)

  const rangeDate = query(calendar, '[data-range-date]')
  expect(rangeDate).toBeNull()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-range-date.spec.js#L68
it('highlights only the interior when the selected date follows the range anchor', { tags: ['legacy'] }, async () => {
  await using _component = createDisposableDatePicker(rootId, template)
  await page.getByRole('textbox', { name: 'Dates of use' }).fill('05/25/2020')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()

  const anchor = page.getByRole('button', { name: '22 May 2020 Friday' }).element() as HTMLButtonElement
  const day23 = page.getByRole('button', { name: '23 May 2020 Saturday' }).element() as HTMLButtonElement
  const day24 = page.getByRole('button', { name: '24 May 2020 Sunday' }).element() as HTMLButtonElement
  const selected = page.getByRole('button', { name: '25 May 2020 Monday' }).element() as HTMLButtonElement
  const day26 = page.getByRole('button', { name: '26 May 2020 Tuesday' }).element() as HTMLButtonElement

  expect(anchor.dataset.rangeDate).toBe('')
  expect(anchor.dataset.rangeStart).toBe('')
  expect(anchor.dataset.inRange).not.toBe('')
  expect(day23.dataset.inRange).toBe('')
  expect(day24.dataset.inRange).toBe('')
  expect(selected.dataset.rangeEnd).toBe('')
  expect(selected.dataset.inRange).not.toBe('')
  expect(day26.dataset.inRange).not.toBe('')
  for (const button of [anchor, day23, day24, selected, day26]) {
    expect(button).toBeEnabled()
  }
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-range-date.spec.js#L110
it('highlights only the interior when the selected date precedes the range anchor', { tags: ['legacy'] }, async () => {
  await using _component = createDisposableDatePicker(rootId, template)
  await page.getByRole('textbox', { name: 'Dates of use' }).fill('05/18/2020')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()

  const day17 = page.getByRole('button', { name: '17 May 2020 Sunday' }).element() as HTMLButtonElement
  const selected = page.getByRole('button', { name: '18 May 2020 Monday' }).element() as HTMLButtonElement
  const day19 = page.getByRole('button', { name: '19 May 2020 Tuesday' }).element() as HTMLButtonElement
  const day20 = page.getByRole('button', { name: '20 May 2020 Wednesday' }).element() as HTMLButtonElement
  const day21 = page.getByRole('button', { name: '21 May 2020 Thursday' }).element() as HTMLButtonElement
  const anchor = page.getByRole('button', { name: '22 May 2020 Friday' }).element() as HTMLButtonElement

  expect(day17.dataset.inRange).not.toBe('')
  expect(selected.dataset.rangeStart).toBe('')
  expect(selected.dataset.inRange).not.toBe('')
  expect(day19.dataset.inRange).toBe('')
  expect(day20.dataset.inRange).toBe('')
  expect(day21.dataset.inRange).toBe('')
  expect(anchor.dataset.rangeDate).toBe('')
  expect(anchor.dataset.rangeEnd).toBe('')
  expect(anchor.dataset.inRange).not.toBe('')
  for (const button of [day17, selected, day19, day20, day21, anchor]) {
    expect(button).toBeEnabled()
  }
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1875 (hover paints the current grid)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1317-L1361 (close and reopen rebuild the grid)
it('drops a hover preview when the calendar closes and reopens', { tags: ['parity'] }, async () => {
  const anchored = template.replace('data-range-date="2020-05-22"', 'data-range-date="2020-05-17" data-default-date="2020-05-17"')
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()!
  const inside = () => queryAll<HTMLButtonElement>(calendar, '[data-part="cell-trigger"][data-in-range]').map(button => button.dataset.value)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('button', { name: '12 May 2020 Tuesday' }).hover()
  expect(inside()).toEqual(['2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16'])
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(calendar.hidden).toBe(true)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(calendar.hidden).toBe(false)
  expect(inside()).toEqual([])
})

it('previews the range with a pen hover without selecting a date', { tags: ['new'] }, async () => {
  const anchored = template.replace('data-range-date="2020-05-22"', 'data-range-date="2020-05-17" data-default-date="2020-05-17"')
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()!
  const input = component.elements.getInputEl()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const hoveredDay = page.getByRole('button', { name: '12 May 2020 Tuesday' }).element()
  hoveredDay.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'pen' }))

  await expect.poll(() => queryAll(calendar, '[data-part="cell-trigger"][data-in-range]').length).toBe(4)
  expect(input.value).toBe('')
  expect(calendar.hidden).toBe(false)
})

it('does not preview a range from a touch hover event', { tags: ['new'] }, async () => {
  const anchored = template.replace('data-range-date="2020-05-22"', 'data-range-date="2020-05-17" data-default-date="2020-05-17"')
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()!
  const input = component.elements.getInputEl()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const touchedDay = page.getByRole('button', { name: '12 May 2020 Tuesday' }).element()
  touchedDay.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' }))
  await new Promise(resolve => requestAnimationFrame(resolve))

  expect(queryAll(calendar, '[data-part="cell-trigger"][data-in-range]')).toHaveLength(0)
  expect(input.value).toBe('')
  expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L469-L482 (the range anchor sets endpoint and interior markers)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1750-L1765 (keyboard movement changes focus)
it('keeps a fixed range anchor independent of keyboard focus movement', { tags: ['parity'] }, async () => {
  const anchored = template.replace('data-range-date="2020-05-22"', 'data-range-date="2020-05-10"')
  await using component = createDisposableDatePicker(rootId, anchored)
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('textbox', { name: 'Dates of use' }).fill('05/20/2020')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await userEvent.keyboard('{ArrowRight}')
  const anchor = page.getByRole('button', { name: '10 May 2020 Sunday' }).element() as HTMLButtonElement
  const selected = page.getByRole('button', { name: '20 May 2020 Wednesday' }).element() as HTMLButtonElement
  expect(anchor.dataset.rangeDate).toBe('')
  expect(selected.getAttribute('aria-selected')).toBe('true')
  expect(query<HTMLButtonElement>(calendar, '[data-part="cell-trigger"][data-focus]')?.dataset.value).toBe('2020-05-21')
  expect(anchor).toBeEnabled()
  expect(selected).toBeEnabled()
})
