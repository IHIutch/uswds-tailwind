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

async function setupYearSelectionView(component: ReturnType<typeof createDisposableDatePicker>) {
  const input = component.elements.getInputEl()
  const button = component.elements.getTriggerEl()

  await userEvent.fill(input, '6/20/2020')
  await userEvent.click(button)

  const calendar = component.elements.getCalendarEl()!
  const yearTrigger = calendar.querySelector('[data-part="date-view-trigger"][data-value="year"]') as HTMLButtonElement
  await userEvent.click(yearTrigger)

  return { calendar }
}

it('should show year of 2020 as focused', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedYear = yearView.querySelector('[data-focus="true"]')!
  expect(focusedYear.getAttribute('data-value')).toBe('2020')
})

it('should show year of 2020 as selected', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const selectedYear = yearView.querySelector('[data-selected="true"]')!
  expect(selectedYear.getAttribute('data-value')).toBe('2020')
})

it('should navigate back three years when pressing up', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowUp}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2017')
})

it('should navigate ahead three years when pressing down', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowDown}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2023')
})

it('should navigate back one year when pressing left', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowLeft}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2019')
})

it('should navigate ahead one year when pressing right', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{ArrowRight}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2021')
})

it('should navigate to the beginning of the year row when pressing home', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{Home}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2019')
})

it('should navigate to the end of the year row when pressing end', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{End}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2021')
})

it('should navigate back 12 years when pressing page up', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{PageUp}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2008')
})

it('should navigate forward 12 years when pressing page down', async () => {
  using component = createDisposableDatePicker(rootId, template)
  const { calendar } = await setupYearSelectionView(component)

  const yearView = calendar.querySelector('[data-part="date-picker-year"]')!
  const focusedElement = yearView.querySelector<HTMLButtonElement>('[data-focus="true"]')!
  focusedElement.focus()
  await userEvent.keyboard('{PageDown}')

  const newFocused = yearView.querySelector('[data-focus="true"]')!
  expect(newFocused.getAttribute('data-value')).toBe('2032')
})
