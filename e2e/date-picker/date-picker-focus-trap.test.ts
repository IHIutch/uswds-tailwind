import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

const template = `
  <div>
    <div>
      <label for="input-dob">Date of birth</label>
      <div data-part="date-picker-root" id="${rootId}">
          <input data-part="date-picker-input" id="input-dob" name="input-dob" type="text">
          <button data-part="date-picker-trigger" type="button"></button>
          <div data-part="date-picker-content" hidden>
            <div data-part="date-picker-day">
              <button data-part="date-picker-nav-prev" data-unit="year" type="button"></button>
              <button data-part="date-picker-nav-prev" data-unit="month" type="button"></button>
              <button data-part="date-view-trigger" data-value="month" type="button"></button>
              <button data-part="date-view-trigger" data-value="year" type="button"></button>
              <button data-part="date-picker-nav-next" data-unit="month" type="button"></button>
              <button data-part="date-picker-nav-next" data-unit="year" type="button"></button>
              <table>
                <thead>
                  <tr>
                    <th data-part="date-picker-day-header"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="date-picker-date-button"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div data-part="date-picker-month">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="date-picker-month-button"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div data-part="date-picker-year">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="date-picker-year-button"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button data-part="date-picker-nav-prev" data-unit="decade"></button>
              <button data-part="date-picker-nav-next" data-unit="decade"></button>
            </div>
          </div>
          <div data-part="date-picker-status"></div>
        </div>
      </div>
    </div>
  `

it('should move focus when tabbing within the calendar', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()
  const root = component.elements.getRootEl()!

  await userEvent.click(button)

  // Verify the initially focused date in the calendar
  const focusedDateButton = root.querySelector('[data-part="date-picker-date-button"][data-focus="true"]')
  expect(focusedDateButton).toBeTruthy()

  // Tab should move focus (actual behavior may differ from legacy)
  await userEvent.keyboard('{Tab}')

  // Verify focus moved to some element within the focus trap
  const input = root.querySelector('[data-part="date-picker-input"]')
  expect(document.activeElement).toBe(input)
})

it('should maintain focus within the component when navigating', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()
  const root = component.elements.getRootEl()!

  await userEvent.click(button)

  // Verify calendar is open and focused
  const calendarContent = root.querySelector('[data-part="date-picker-content"]')
  expect(calendarContent?.hasAttribute('hidden')).toBe(false)

  // Tab to move focus
  await userEvent.keyboard('{Tab}')

  const input = root.querySelector('[data-part="date-picker-input"]')
  expect(document.activeElement).toBe(input)

  // Verify focus is still within the date picker component
  expect(input?.closest('[data-part="date-picker-root"]')).toBe(root)
})
