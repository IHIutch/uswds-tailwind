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

async function setupMonthSelectionView(component: ReturnType<typeof createDisposableDatePicker>) {
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(button)

  const monthTrigger = calendar.querySelector<HTMLButtonElement>('[data-part="date-view-trigger"][data-value="month"]')!
  await userEvent.click(monthTrigger)

  return { calendar }
}

it('should show month of June as focused', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedMonth = monthView?.querySelector('[data-focus="true"]')
  expect(focusedMonth?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5)
})

it('should show month of June as selected', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const selectedMonth = monthView?.querySelector('[data-selected="true"]')
  expect(selectedMonth?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5)
})

it('should navigate back three months when pressing up', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowUp}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('2') // March is 0-indexed (2)
})

it('should navigate ahead three months when pressing down', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowDown}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('8') // September is 0-indexed (8)
})

it('should navigate back one month when pressing left', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowLeft}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('4') // May is 0-indexed (4)
})

it('should navigate ahead one month when pressing right', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{ArrowRight}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('6') // July is 0-indexed (6)
})

it('should navigate to the beginning of the month row when pressing home', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{Home}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('3') // April is 0-indexed (3)
})

it('should navigate to the end of the month row when pressing end', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{End}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('5') // June is 0-indexed (5) - already at end of row
})

it('should navigate to January when pressing page up', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{PageUp}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('0') // January is 0-indexed (0)
})

it('should navigate to December when pressing page down', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupMonthSelectionView(component)

  const monthView = calendar.querySelector('[data-part="date-picker-month"]')
  const focusedElement = monthView?.querySelector('[data-focus="true"]') as HTMLElement
  focusedElement?.focus()
  await userEvent.keyboard('{PageDown}')

  const newFocused = monthView?.querySelector('[data-focus="true"]')
  expect(newFocused?.getAttribute('data-value')).toBe('11') // December is 0-indexed (11)
})
