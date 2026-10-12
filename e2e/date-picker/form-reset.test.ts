import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const template = `
  <form>
    <div data-scope="date-picker" data-part="root" id="test" data-default-date="2024-06-01">
      <label data-part="label">Date of birth</label>
      <input data-part="input" name="dob" type="text">
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L668-L691 (the selection is read back from the reset input)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1363 (an empty input opens on the default date)
it('clears the field and the selection when the form is reset', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker('test', template)
  const input = component.elements.getInputEl()
  await userEvent.fill(input, '06/15/2024')
  await userEvent.click(component.elements.getTriggerEl())
  await page.getByRole('button', { name: '20 June 2024 Thursday' }).click()
  await expect.element(input).toHaveValue('06/20/2024')

  await userEvent.click(page.getByRole('button', { name: 'Reset' }))
  await expect.element(input).toHaveValue('')
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(page.getByRole('button', { name: '1 June 2024 Saturday' })).toHaveFocus()
  await expect.element(page.getByRole('button', { name: '20 June 2024 Thursday' })).toHaveAttribute('aria-selected', 'false')
})
