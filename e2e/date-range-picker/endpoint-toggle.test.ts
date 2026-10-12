import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDateRangePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div data-scope="date-range-picker" data-part="root" id="${rootId}">
      <div class="usa-form-group">
        <label data-part="label" class="usa-label">Appointment Date Start</label>
        <div class="usa-hint">mm/dd/yyyy</div>
        <input
          data-part="input"
          class="usa-input"
          id="appointment-date-start"
          name="appointment-date-start"
          type="text"
          required
        />
        <button data-part="trigger" data-target="start" type="button"></button>
      </div>

      <div class="usa-form-group">
        <label data-part="label" class="usa-label">Appointment Date End</label>
        <div class="usa-hint">mm/dd/yyyy</div>
        <input
          data-part="input"
          class="usa-input"
          id="appointment-date-end"
          name="appointment-date-end"
          type="text"
          required
        />
        <button data-part="trigger" data-target="end" type="button"></button>
      </div>

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
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1362 (each endpoint's button toggles its own calendar closed)
it('closes the start calendar when the start button is clicked again', { tags: ['parity'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  await userEvent.click(component.elements.getStartTriggerEl()!)
  await expect.element(component.elements.getCalendarEl()!).toBeVisible()
  await userEvent.click(component.elements.getStartTriggerEl()!)
  await expect.element(component.elements.getCalendarEl()!).not.toBeVisible()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1362 (each endpoint's button toggles its own calendar closed)
it('closes the end calendar when the end button is clicked again', { tags: ['parity'] }, async () => {
  await using component = createDisposableDateRangePicker(rootId, template)
  await userEvent.click(component.elements.getEndTriggerEl()!)
  await expect.element(component.elements.getCalendarEl()!).toBeVisible()
  await userEvent.click(component.elements.getEndTriggerEl()!)
  await expect.element(component.elements.getCalendarEl()!).not.toBeVisible()
})
