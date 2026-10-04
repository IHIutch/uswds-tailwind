import { query, queryAll } from '@zag-js/dom-query'
import { expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const VALIDATION_MESSAGE = 'Please enter a valid date'

const rootId = 'test'

const template = `
    <div>
      <div >
        <label for="input-dob">Date of birth</label>
        <div data-scope="date-picker" data-part="root" id="${rootId}">
          <input data-part="input" id="input-dob" name="input-dob" type="text">
          <input data-part="hidden-input" type="hidden">
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
              <button data-part="prev-trigger" data-unit="chunk"></button>
              <button data-part="next-trigger" data-unit="chunk"></button>
            </div>
          </div>
          <div data-part="status"></div>
        </div>
      </div>
    </div>
  `

const rangeTemplate = template.replace(
  '<input data-part="hidden-input" type="hidden">',
  `<label for="input-dob:1">End date</label>
     <input data-part="input" id="input-dob:1" name="end-date" type="text">
     <input data-part="hidden-input" type="hidden">
     <input data-part="hidden-input" type="hidden">`,
)

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L907-L909 (enhancement clears an authored input value before applying defaults)
it('clears an authored input value when there is no selected default', { tags: ['parity'] }, async () => {
  const authoredTemplate = template.replace('name="input-dob" type="text"', 'name="input-dob" type="text" value="08/14/2024"')
  await using component = createDisposableDatePicker(rootId, authoredTemplate)
  const visibleInput = component.elements.getInputEl()
  const hiddenInput = query<HTMLInputElement>(component.elements.getRootEl()!, '[data-part="hidden-input"]')!

  expect(visibleInput.value).toBe('')
  expect(hiddenInput.value).toBe('')
})

// Port-only validation state must follow the text written by a calendar selection.
it('clears an invalid draft marker when selecting the same calendar date', { tags: ['new'] }, async () => {
  const defaultValueTemplate = template.replace(`id="${rootId}"`, `id="${rootId}" data-default-value="2024-06-15"`)
  await using component = createDisposableDatePicker(rootId, defaultValueTemplate)
  const input = component.elements.getInputEl()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('bad date')
  expect(input.getAttribute('aria-invalid')).toBe('true')

  await page.getByRole('button', { name: '15 June 2024 Saturday' }).click()

  expect(input.value).toBe('06/15/2024')
  expect(input.hasAttribute('aria-invalid')).toBe(false)
})

it('keeps programmatic set and clear values in sync with visible validation', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  const instance = component.elements.getInstance()!

  await page.getByRole('textbox', { name: 'Date of birth' }).fill('bad date')
  expect(input.getAttribute('aria-invalid')).toBe('true')

  instance.api.setValue([new Date(2024, 5, 15)])
  await vi.waitFor(() => expect(input.value).toBe('06/15/2024'))
  expect(input.hasAttribute('aria-invalid')).toBe(false)

  instance.api.clearValue()
  await vi.waitFor(() => expect(input.value).toBe(''))
  expect(input.hasAttribute('aria-invalid')).toBe(false)
})

it('shows the accepted controlled value after rejecting a calendar proposal', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, template, {
    value: [new Date(2024, 5, 15)],
    onValueChange,
  })
  const input = component.elements.getInputEl()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('bad date')
  expect(input.getAttribute('aria-invalid')).toBe('true')

  await page.getByRole('button', { name: '20 June 2024 Thursday' }).click()
  await vi.waitFor(() => expect(input.value).toBe('06/15/2024'))
  expect(input.hasAttribute('aria-invalid')).toBe(false)
  expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ valueAsString: ['2024-06-20'] }))
})

it('keeps an active draft during accepted controlled updates, then reconciles after editing', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template, {
    value: [new Date(2024, 5, 15)],
  })
  const input = component.elements.getInputEl()
  const instance = component.elements.getInstance()!

  await page.getByRole('textbox', { name: 'Date of birth' }).fill('bad date')
  expect(input.getAttribute('aria-invalid')).toBe('true')

  instance.machine.updateProps({ value: [new Date(2024, 5, 20)] })
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  expect(input.value).toBe('bad date')
  expect(input.getAttribute('aria-invalid')).toBe('true')

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  instance.machine.updateProps({ value: [new Date(2024, 5, 21)] })
  await vi.waitFor(() => expect(input.value).toBe('06/21/2024'))
  expect(input.hasAttribute('aria-invalid')).toBe(false)
})

it('reports both displayed range dates invalid when bounds change after one value transaction', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, rangeTemplate, { selectionMode: 'range' })
  const instance = component.elements.getInstance()!

  instance.api.setValue([new Date(2024, 5, 15), new Date(2024, 5, 20)])

  await vi.waitFor(() => {
    expect(component.elements.getInputEl().value).toBe('06/15/2024')
    expect((page.getByRole('textbox', { name: 'End date' }).element() as HTMLInputElement).value).toBe('06/20/2024')
  })
  instance.machine.updateProps({ min: new Date(2024, 6, 1) })
  await vi.waitFor(() => {
    expect(instance.api.getInputProps({ index: 0 })['aria-invalid']).toBe('true')
    expect(instance.api.getInputProps({ index: 1 })['aria-invalid']).toBe('true')
  })
})

// Port-only controlled values, callbacks and imperative opens have no USWDS equivalent.
it.each([0, 1] as const)('rejects a controlled range endpoint %i proposal without writing its sibling', { tags: ['new'] }, async (index) => {
  const initial = [new Date(2024, 5, 10), new Date(2024, 5, 20)]
  const onValueChange = vi.fn()
  const onOpenChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, rangeTemplate, {
    selectionMode: 'range',
    value: initial,
    onValueChange,
    onOpenChange,
  })
  const instance = component.elements.getInstance()!
  const root = component.elements.getRootEl()!
  const inputs = queryAll<HTMLInputElement>(root, '[data-part="input"]')
  const hidden = queryAll<HTMLInputElement>(root, '[data-part="hidden-input"]')
  const changes: string[] = []
  hidden.forEach((input, i) => input.addEventListener('change', () => changes.push(`hidden:${i}:${input.value}`)))
  inputs.forEach((input, i) => input.addEventListener('change', () => changes.push(`visible:${i}:${input.value}`)))

  instance.api.setOpen(true, index)
  await vi.waitFor(() => expect(instance.api.open).toBe(true))
  onOpenChange.mockClear()
  // The shared calendar must reject a start after the end, or an end before the start.
  instance.machine.send({ type: 'CELL.CLICK', value: new Date(2024, 5, index === 0 ? 21 : 9) })
  expect(onValueChange).not.toHaveBeenCalled()
  expect(instance.api.open).toBe(true)

  await page.getByRole('button', { name: '15 June 2024 Saturday' }).click()
  const expected = ['06/10/2024', '06/20/2024']
  const expectedInternal = ['2024-06-10', '2024-06-20'][index]
  await vi.waitFor(() => expect(inputs.map(input => input.value)).toEqual(expected))
  await vi.waitFor(() => expect(document.activeElement).toBe(inputs[index]))
  expect(changes).toEqual([
    `hidden:${index}:${expectedInternal}`,
    `visible:${index}:${expected[index]}`,
  ])
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
    valueAsString: index === 0 ? ['2024-06-15', '2024-06-20'] : ['2024-06-10', '2024-06-15'],
  }))
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
})

// Port-only endpoint targeting through setOpen; USWDS opens calendars through DOM triggers.
it('programmatic range opens target one endpoint and can switch the open calendar', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, rangeTemplate, {
    selectionMode: 'range',
    defaultValue: [new Date(2024, 5, 10), new Date(2024, 5, 20)],
    onOpenChange,
  })
  const instance = component.elements.getInstance()!
  instance.api.setOpen(true, 1)
  await vi.waitFor(() => expect(instance.api.focusedValue.getDate()).toBe(20))
  expect(instance.api.open).toBe(true)
  instance.api.setOpen(true)
  await vi.waitFor(() => expect(instance.api.focusedValue.getDate()).toBe(10))
  expect(instance.api.open).toBe(true)
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })

  await page.getByRole('button', { name: '15 June 2024 Saturday' }).click()
  expect(instance.api.valueAsString).toEqual(['2024-06-15', '2024-06-20'])
  expect(instance.api.open).toBe(false)
  // Reopening the start calendar keeps editing the start; it never advances to the end implicitly.
  instance.api.setOpen(true)
  await vi.waitFor(() => expect(instance.api.focusedValue.getDate()).toBe(15))
  await page.getByRole('button', { name: '16 June 2024 Sunday' }).click()
  expect(instance.api.valueAsString).toEqual(['2024-06-16', '2024-06-20'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L48
it('should enhance the date input with a date picker button', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!

  expect(input).toBeTruthy()
  expect(button).toBeTruthy()
})

// mouse interactions
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L54
it('should display a calendar for the current date when the date picker button is clicked', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)
  expect(calendar.contains(document.activeElement)).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L99
it('should hide the calendar when the date picker button is clicked and the calendar is already open', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.click(button)
  expect(calendar.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L115
it('should close the calendar you click outside of an active calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `${template}<button id="outside-calendar">Outside</button>`)
  const calendar = component.elements.getCalendarEl()!

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(calendar.hidden).toBe(false)

  await page.getByRole('button', { name: 'Outside' }).click()
  expect(calendar.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L132
it('should close the calendar you press escape from the input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  input.focus()
  await userEvent.keyboard('{Escape}')

  expect(calendar.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L149
it('should display a calendar for the inputted date when the date picker button is clicked with a date entered', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L181
it('should allow for the selection of a date within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const dayTenButton = query<HTMLButtonElement>(calendar, '[data-day="10"]')!
  await userEvent.click(dayTenButton)

  expect(input.value).toBe('01/10/2020')
  expect(document.activeElement).toBe(input)
  expect(calendar.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L217
it('should allow for navigation to the preceding month by clicking the left single arrow button within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevMonthButton = query(calendar, '[data-part="prev-trigger"][data-unit="month"]') as HTMLButtonElement
  await userEvent.click(prevMonthButton)

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('December')
  expect(yearSelection?.textContent).toBe('2019')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L255
it('should allow for navigation to the succeeding month by clicking the right single arrow button within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextMonthButton = query(calendar, '[data-part="next-trigger"][data-unit="month"]') as HTMLButtonElement
  await userEvent.click(nextMonthButton)

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('February')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L291
it('should allow for navigation to the preceding year by clicking the left double arrow button within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2016')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const prevYearButton = query(calendar, '[data-part="prev-trigger"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(prevYearButton)

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2015')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L329
it('should allow for navigation to the succeeding year by clicking the right double arrow button within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const nextYearButton = query(calendar, '[data-part="next-trigger"][data-unit="year"]') as HTMLButtonElement
  await userEvent.click(nextYearButton)

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2021')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1076
it('should show an improper date as invalid as the user leaves the input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, 'abcdefg... That means the convo is done')
  await userEvent.click(document.body, { position: { x: 0, y: 0 } })

  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1127
it('should show an improper date as invalid if the user presses enter from the input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.fill(input, '2/31/2019')

  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1135
it('should show an empty input as valid', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!

  await userEvent.clear(input)

  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(input.validationMessage).toBe('')
})

// Month and Year Selection Tests
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L365
it('should display a month selection screen by clicking the month display within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  await userEvent.click(monthSelection)

  const monthView = query(calendar, '[data-part="view"][data-view="month"]')
  const focusedMonth = document.activeElement

  expect(monthView).toBeTruthy()
  expect(focusedMonth?.hasAttribute('data-focus')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L396
it('should allow for the selection of a month within month selection screen', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '2/1/2020')
  await userEvent.click(button)

  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  await userEvent.click(monthSelection)

  const firstMonthButton = query(calendar, '[data-part="view"][data-view="month"] [data-part="table-cell-trigger"]') as HTMLButtonElement
  await userEvent.click(firstMonthButton)

  const monthDisplay = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  expect(monthDisplay?.textContent).toBe('January')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L418
it('should display a year selection screen by clicking the year display within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)

  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]') as HTMLButtonElement
  await userEvent.click(yearSelection)

  const yearView = query(calendar, '[data-part="view"][data-view="year"]')
  const focusedYear = document.activeElement

  expect(yearView).toBeTruthy()
  expect(focusedYear?.hasAttribute('data-focus')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L449
it('should allow for navigation to the preceding dozen years by clicking the left arrow button within the year selection screen', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.fill(input, '2/1/2020')
  await userEvent.click(button)

  await page.getByRole('button', { name: '2020. Select year' }).click()

  await page.getByRole('button', { name: 'Navigate back 12 years' }).click()

  expect(page.getByRole('button', { name: '2004', exact: true }).element().getAttribute('data-value')).toBe('2004')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L471
it('should allow for navigation to the succeeding dozen years by clicking the right arrow button within the year selection screen', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.fill(input, '2/1/2020')
  await userEvent.click(button)

  await page.getByRole('button', { name: '2020. Select year' }).click()

  await page.getByRole('button', { name: 'Navigate forward 12 years' }).click()

  expect(page.getByRole('button', { name: '2028', exact: true }).element().getAttribute('data-value')).toBe('2028')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L493
it('should allow for the selection of a year within year selection screen', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '2/1/2020')
  await userEvent.click(button)

  await page.getByRole('button', { name: '2020. Select year' }).click()

  await page.getByRole('button', { name: '2016', exact: true }).click()

  const yearDisplay = query(calendar, '[data-part="view-trigger"][data-view="year"]')
  expect(yearDisplay?.textContent).toBe('2016')
  expect(calendar.hidden).toBe(false)
  expect(query(calendar, '[data-part="table-cell-trigger"][data-focus]')?.getAttribute('data-value')).toBe('2016-02-01')
})

// Keyboard Navigation Tests
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L517
it('should close the calendar when escape is pressed within the calendar', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Escape}')

  expect(calendar.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L534
it('should move focus to the same day of week of the previous week when up is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/10/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowUp}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('3')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L568
it('should move focus to the same day of week of the next week when down is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/10/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowDown}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('17')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L602
it('should move focus to the previous day when left is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/10/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowLeft}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('9')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L636
it('should move focus to the next day when right is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/10/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{ArrowRight}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('11')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L670
it('should move focus to the first day (e.g. Sunday) of the current week when home is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{Home}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('29')
  expect(monthSelection?.textContent).toBe('December')
  expect(yearSelection?.textContent).toBe('2019')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L704
it('should move focus to the last day (e.g. Saturday) of the current week when end is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{End}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('4')
  expect(monthSelection?.textContent).toBe('January')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L738
it('should move focus to the same day of the previous month when page up is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageUp}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('December')
  expect(yearSelection?.textContent).toBe('2019')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L806
it('should move focus to the same day of the next month when page down is pressed from the currently focused day', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '1/1/2020')
  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  await userEvent.keyboard('{PageDown}')

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('1')
  expect(monthSelection?.textContent).toBe('February')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1044
it('should accept a parse-able date with a two digit year and display the calendar of that year in the current century', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '2/29/20')
  await userEvent.click(button)

  expect(calendar.hidden).toBe(false)

  const focusedDate = query(calendar, '[data-focus]')
  const monthSelection = query(calendar, '[data-part="view-trigger"][data-view="month"]')
  const yearSelection = query(calendar, '[data-part="view-trigger"][data-view="year"]')

  expect(focusedDate?.textContent).toBe('29')
  expect(monthSelection?.textContent).toBe('February')
  expect(yearSelection?.textContent).toBe('2020')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1090
it('should update the calendar when a valid date is entered in the input while the date picker is open', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '6/1/2020')
  await userEvent.click(button)
  const firstFocus = query(calendar, '[data-focus]')

  await userEvent.fill(input, '6/20/2020')

  const secondFocus = query(calendar, '[data-focus]')
  expect(firstFocus !== secondFocus || firstFocus?.textContent !== secondFocus?.textContent).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1107
it('should validate the input when a date is selected', { tags: ['legacy'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()!
  const button = component.elements.getTriggerEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.fill(input, '2/31/2019')
  await userEvent.click(document.body, { position: { x: 0, y: 0 } })
  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)

  await userEvent.click(button)
  expect(calendar.hidden).toBe(false)

  const dayTenButton = query<HTMLButtonElement>(calendar, '[data-value*="10"]')!
  await userEvent.click(dayTenButton)

  expect(input.validationMessage).toBe('')
})

// Additional source behavior from the date-picker migration review.
const templateWith = (attributes: string) => template.replace(`id="${rootId}"`, `id="${rootId}" ${attributes}`)
const focusedDay = (calendar: Element) => query<HTMLButtonElement>(calendar, '[data-part="table-cell-trigger"][data-focus]')!

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L772
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L840
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L874
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L908
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L976
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L942
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L1010
it.each([
  ['12/31/2019', '{PageUp}', '2019-11-30'],
  ['01/31/2020', '{PageDown}', '2020-02-29'],
  ['12/31/2020', '{PageDown}', '2021-01-31'],
  ['01/01/2020', '{Shift>}{PageUp}{/Shift}', '2019-01-01'],
  ['01/01/2020', '{Shift>}{PageDown}{/Shift}', '2021-01-01'],
  ['02/29/2020', '{Shift>}{PageUp}{/Shift}', '2019-02-28'],
  ['02/29/2020', '{Shift>}{PageDown}{/Shift}', '2021-02-28'],
])('moves %s with %s to %s', { tags: ['legacy'] }, async (inputDate, key, expected) => {
  await using component = createDisposableDatePicker(rootId, template)
  await page.getByRole('textbox', { name: 'Date of birth' }).fill(inputDate)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const calendar = component.elements.getCalendarEl()!
  expect(focusedDay(calendar).dataset.value).toBe(`${inputDate.slice(6)}-${inputDate.slice(0, 2)}-${inputDate.slice(3, 5)}`)
  await userEvent.keyboard(key)
  expect(focusedDay(calendar).dataset.value).toBe(expected)
  expect(document.activeElement).toBe(focusedDay(calendar))
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1277-L1289 (next-month navigation renders status and restores focus)
it('announces the new month and keeps focus on the navigation control', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2024-03-01" data-max-date="2024-09-30"'))
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const nextMonth = page.getByRole('button', { name: 'Navigate forward one month' }).element() as HTMLButtonElement
  await page.getByRole('button', { name: 'Navigate forward one month' }).click()
  expect(component.elements.getStatusEl()?.textContent).toBe('July 2024')
  expect(focusedDay(calendar).dataset.value?.startsWith('2024-07')).toBe(true)
  expect(document.activeElement).toBe(nextMonth)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1237-L1249 (previous-year navigation clamps and falls back when disabled)
it('announces the clamped month and moves focus to the calendar control when navigation disables itself', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2024-03-01" data-max-date="2024-09-30"'))
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const previousYear = page.getByRole('button', { name: 'Navigate back one year' }).element() as HTMLButtonElement
  await page.getByRole('button', { name: 'Navigate back one year' }).click()
  expect(component.elements.getStatusEl()?.textContent).toBe('March 2024')
  expect(previousYear).toBeDisabled()
  expect(document.activeElement).toBe(query(calendar, '[data-part="view-control"]'))
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L929-L947 (the visible named input retains form identity; the ISO mirror loses name)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L836-L867 (validation and ISO reconciliation of typed values)
it('keeps the visible input value and form submission in sync with typed valid and invalid dates', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `<form>${template}</form>`)
  const input = component.elements.getInputEl()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/15/2024')
  expect(input.value).toBe('06/15/2024')
  expect(new FormData(input.form!).get('input-dob')).toBe('06/15/2024')
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('13/45/2024')
  input.blur()
  expect(input.value).toBe('13/45/2024')
  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
  expect(new FormData(input.form!).get('input-dob')).toBe('13/45/2024')
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('2/5/2024')
  input.blur()
  expect(input.validationMessage).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L686-L691 (context adjusts the external date for navigation)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L796-L847 (raw-input validation remains independent)
it('opens on the adjusted date even while the typed date is invalid', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('13/45/2024')
  input.blur()
  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(component.elements.getCalendarEl()!).dataset.value).toBe('2024-12-31')
  expect(input.value).toBe('13/45/2024')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L856-L867 (valid typed input updates the selected ISO date)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1370-L1377 (input edits render the visible calendar as a day grid)
it('re-centers and selects the typed date while open, then returns from month view to the day grid', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('08/20/2024')
  expect(focusedDay(calendar).dataset.value).toBe('2024-08-20')
  expect(page.getByRole('button', { name: '20 August 2024 Tuesday' }).element().getAttribute('aria-selected')).toBe('true')
  expect(calendar.hidden).toBe(false)
  await page.getByRole('button', { name: 'August. Select month' }).click()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('09/21/2024')
  expect(focusedDay(calendar).dataset.value).toBe('2024-09-21')
  expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1359 (opening clamps the default navigation date without selection)
it('opens a bounded blank picker on its clamped navigation default without selecting a date', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-date="2024-06-10" data-min-date="2025-01-01" data-max-date="2025-01-20"'))
  const input = component.elements.getInputEl()
  const calendar = component.elements.getCalendarEl()!
  expect(input.value).toBe('')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(calendar).dataset.value).toBe('2025-01-01')
  expect(query(calendar, '[data-part="view"][data-view="day"] [data-part="table-cell-trigger"][aria-selected="true"]')).toBeNull()
  expect(input.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1359 (opening chooses adjusted input before the default navigation date)
it('uses typed input for navigation and returns to the default after a user clears it', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-date="2025-01-05" data-min-date="2025-01-01" data-max-date="2025-01-20"'))
  const input = component.elements.getInputEl()
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('01/10/2025')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(calendar).dataset.value).toBe('2025-01-10')
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await page.getByRole('textbox', { name: 'Date of birth' }).clear()
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(calendar).dataset.value).toBe('2025-01-05')
  expect(input.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1734-L1738 (Escape hides the calendar and restores visible input focus)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1359 (reopening focuses the chosen date)
it('escape restores focus to the visible input and reopening focuses the chosen date', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  const input = component.elements.getInputEl()
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(calendar).dataset.value).toBe('2024-06-15')
  await userEvent.keyboard('{Escape}')
  expect(calendar.hidden).toBe(true)
  await expect.poll(() => document.activeElement).toBe(input)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(calendar).dataset.value).toBe('2024-06-15')
  await expect.poll(() => document.activeElement).toBe(focusedDay(calendar))
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1330-L1339 (native keyboard activation selects once, closes and focuses the input)
it.each(['{Enter}', ' '])('selects the focused date with %s and closes the calendar', { tags: ['parity'] }, async (key) => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  const input = component.elements.getInputEl()
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await userEvent.keyboard(key)
  expect(input.value).toBe('06/15/2024')
  expect(calendar.hidden).toBe(true)
  expect(document.activeElement).toBe(input)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L836-L847 (validation clears only its own message)
it('preserves foreign custom validity when a valid date is entered', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  input.setCustomValidity('Custom error')
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('12/25/2024')
  input.blur()
  expect(input.validationMessage).toBe('Custom error')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L813-L824 (validation requires four year characters even for a parseable date)
it('treats a short year as invalid even though it can navigate to that year', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('02/29/20')
  input.blur()
  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(focusedDay(component.elements.getCalendarEl()!).dataset.value).toBe('2020-02-29')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1078-L1107 (day buttons expose labels, roving focus, disabled state and selection)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1110-L1124 (complete weeks include adjacent-month days)
it('renders complete weeks with accessible day labels, button selection, and one roving day', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15" data-min-date="2024-06-01" data-max-date="2024-06-30"'))
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const table = query(calendar, '[data-part="view"][data-view="day"] table')!
  expect(table.getAttribute('role')).toBeNull()
  const rows = queryAll(table, 'tbody tr')
  expect(rows.length).toBeGreaterThanOrEqual(4)
  expect(rows.every(row => queryAll(row, 'td').length === 7)).toBe(true)
  expect(page.getByRole('button', { name: '31 May 2024 Friday' }).element()).toBeDisabled()
  expect(page.getByRole('button', { name: '1 July 2024 Monday' }).element()).toBeDisabled()
  const chosen = page.getByRole('button', { name: '15 June 2024 Saturday' }).element() as HTMLButtonElement
  expect(chosen.getAttribute('aria-label')).toBe('15 June 2024 Saturday')
  expect(chosen.getAttribute('aria-selected')).toBe('true')
  expect(chosen.tabIndex).toBe(0)
  expect(queryAll(calendar, '[data-part="view"][data-view="day"] [data-part="table-cell-trigger"][tabindex="0"]')).toHaveLength(1)
  expect(query(calendar, '[data-part="view"][data-view="day"] [data-part="table-cell-trigger"][aria-selected="true"]')).toBe(chosen)
  expect(component.elements.getStatusEl()?.textContent?.startsWith('Selected date')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker.spec.js#L68
it('marks today with aria-current=date on the day button', { tags: ['legacy'] }, async () => {
  await using _component = createDisposableDatePicker(rootId, template)
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const today = new Date()
  const month = today.toLocaleString('en-US', { month: 'long' })
  const weekday = today.toLocaleString('en-US', { weekday: 'long' })
  const todayButton = page.getByRole('button', { name: `${today.getDate()} ${month} ${today.getFullYear()} ${weekday}` }).element() as HTMLButtonElement
  expect(todayButton.getAttribute('aria-current')).toBe('date')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L2251-L2255 (root focusout closes when focus leaves the picker)
it('dismisses the open calendar when focus leaves the picker', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `${template}<button id="outside-focus">Outside</button>`)
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  page.getByRole('button', { name: 'Outside' }).element().focus()
  await expect.poll(() => calendar.hidden).toBe(true)
})

it('dismisses once when an outside button is clicked', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, `${template}<button id="outside-click">Outside</button>`, { onOpenChange })
  const calendar = component.elements.getCalendarEl()!

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(calendar.hidden).toBe(false)

  await page.getByRole('button', { name: 'Outside' }).click()
  await expect.poll(() => calendar.hidden).toBe(true)
  expect(onOpenChange).toHaveBeenCalledTimes(2)
  expect(onOpenChange).toHaveBeenNthCalledWith(1, { open: true })
  expect(onOpenChange).toHaveBeenNthCalledWith(2, { open: false })
})

it('dismisses for an outside pen pointerdown', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `${template}<button id="outside-pen">Outside</button>`)
  const calendar = component.elements.getCalendarEl()!
  const outside = page.getByRole('button', { name: 'Outside' }).element()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(calendar.hidden).toBe(false)

  outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'pen' }))
  await expect.poll(() => calendar.hidden).toBe(true)
})

it('dismisses for an outside touch pointer followed by click', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `${template}<button id="outside-touch">Outside</button>`)
  const calendar = component.elements.getCalendarEl()!
  const outside = page.getByRole('button', { name: 'Outside' }).element()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  expect(calendar.hidden).toBe(false)

  outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
  outside.click()
  await expect.poll(() => calendar.hidden).toBe(true)
})

it('opens a second picker while dismissing the first picker', { tags: ['new'] }, async () => {
  const secondTemplate = template
    .replace('id="test"', 'id="test-second"')
    .replaceAll('input-dob', 'input-dob-second')
  // Keep the second trigger stationary while the first unstyled calendar closes
  // on pointerdown; otherwise the ensuing click lands on the body.
  const firstFixture = `<div style="min-height: 24rem">${template}</div>`
  await using component = createDisposableDatePicker(rootId, `${firstFixture}${secondTemplate}`)
  const firstCalendar = component.elements.getCalendarEl()!
  const secondRoot = document.getElementById('date-picker:test-second')!
  const secondCalendar = query<HTMLElement>(secondRoot, '[data-part="content"]')!

  await page.getByRole('button', { name: 'Toggle calendar' }).nth(0).click()
  expect(firstCalendar.hidden).toBe(false)
  expect(secondCalendar.hidden).toBe(true)

  await page.getByRole('button', { name: 'Toggle calendar' }).nth(1).click()
  await expect.poll(() => firstCalendar.hidden).toBe(true)
  expect(secondCalendar.hidden).toBe(false)
  await expect.poll(() => document.activeElement?.closest('[data-scope="date-picker"][data-part="root"]')).toBe(secondRoot)
})

it.each(['month', 'year'])('does not select a day when Space switches from the %s view', { tags: ['new'] }, async (view) => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  const calendar = component.elements.getCalendarEl()!
  const input = component.elements.getInputEl()

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  if (view === 'month')
    await page.getByRole('button', { name: 'June. Select month' }).click()
  else
    await page.getByRole('button', { name: '2024. Select year' }).click()

  await userEvent.keyboard(' ')

  expect(calendar.hidden).toBe(false)
  expect(input.value).toBe('06/15/2024')
  expect(document.activeElement).toBe(page.getByRole('button', { name: '15 June 2024 Saturday' }).element())
})

it('uses Shift+PageDown for year navigation without treating Ctrl+ArrowRight as a day move', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, templateWith('data-default-value="2024-06-15"'))
  const calendar = component.elements.getCalendarEl()!

  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  await userEvent.keyboard('{Control>}{ArrowRight}{/Control}')
  expect(document.activeElement).toBe(page.getByRole('button', { name: '15 June 2024 Saturday' }).element())

  await userEvent.keyboard('{Shift>}{PageDown}{/Shift}')
  expect(document.activeElement).toBe(page.getByRole('button', { name: '15 June 2025 Sunday' }).element())
  expect(calendar.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L2173-L2177 (external-input Enter validates)
it('validates Enter during and after input composition, while a Process key leaves validity alone', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const input = component.elements.getInputEl()
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('13/45/2024')
  input.focus()
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Process', bubbles: true }))
  expect(input.validationMessage).toBe('')
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(input.validationMessage).toBe(VALIDATION_MESSAGE)
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }))
  await page.getByRole('textbox', { name: 'Date of birth' }).fill('06/15/2024')
  await userEvent.keyboard('{Enter}')
  expect(input.validationMessage).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1110-L1227 (complete seven-day rows, a roleless table, and first-open navigation guidance)
it('renders a plain calendar as complete weeks with accessible labels and opening guidance', { tags: ['parity'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template)
  const calendar = component.elements.getCalendarEl()!
  await page.getByRole('button', { name: 'Toggle calendar' }).click()
  const table = query(calendar, '[data-part="view"][data-view="day"] table')!
  expect(table.getAttribute('role')).toBeNull()
  const cells = queryAll<HTMLElement>(table, 'tbody td')
  expect(cells.length).toBeGreaterThanOrEqual(28)
  expect(cells.length % 7).toBe(0)
  expect(queryAll(table, 'tbody tr')).toHaveLength(cells.length / 7)
  const buttons = cells.map(cell => query<HTMLButtonElement>(cell, 'button')!)
  expect(buttons.every(button => Boolean(button.getAttribute('aria-label')))).toBe(true)
  expect(buttons.filter(button => button.tabIndex === 0)).toHaveLength(1)
  expect(buttons.filter(button => button.getAttribute('aria-selected') === 'true')).toHaveLength(0)
  expect(component.elements.getStatusEl()?.textContent).toContain('You can navigate by day using left and right arrows')
})
