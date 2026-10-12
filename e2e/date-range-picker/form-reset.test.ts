import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDateRangePicker } from './_utils.js'

const template = `
  <form>
    <div data-scope="date-range-picker" data-part="root" id="range">
      <label data-part="label">Start date</label>
      <input data-part="input" name="start" type="text">
      <button data-part="trigger" type="button"></button>
      <label data-part="label">End date</label>
      <input data-part="input" name="end" type="text">
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
          <table><thead><tr><th data-part="table-header"></th></tr></thead>
            <tbody><tr><td><button data-part="table-cell-trigger"></button></td></tr></tbody></table>
        </div>
        <div data-part="view" data-view="month"><table><tbody><tr><td><button data-part="table-cell-trigger"></button></td></tr></tbody></table></div>
        <div data-part="view" data-view="year">
          <table><tbody><tr><td><button data-part="table-cell-trigger"></button></td></tr></tbody></table>
          <button data-part="prev-trigger" data-view="year" type="button"></button>
          <button data-part="next-trigger" data-view="year" type="button"></button>
        </div>
      </div>
      <div data-part="status"></div>
    </div>
    <button type="reset">Reset</button>
  </form>
`

// USWDS keeps the end picker bound to the old start after a reset, because its range bounds update only on input and
// change events (https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L150-L160).
// The port clears both endpoints and their range instead.
it('clears both endpoints and their range when the form is reset', { tags: ['new'] }, async () => {
  await using component = createDisposableDateRangePicker('range', template)
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  await userEvent.fill(start, '06/10/2024')
  await userEvent.fill(end, '06/20/2024')

  await userEvent.click(page.getByRole('button', { name: 'Reset' }))
  await expect.element(start).toHaveValue('')
  await expect.element(end).toHaveValue('')
  await userEvent.click(component.elements.getEndTriggerEl()!)
  await expect.poll(() => document.activeElement?.getAttribute('aria-current')).toBe('date')
  expect(component.elements.getCalendarEl()!.querySelector('[data-range-date]')).toBeNull()
  expect(component.elements.getCalendarEl()!.querySelector('[aria-selected="true"]')).toBeNull()
})
