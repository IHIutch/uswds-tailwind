import { expect, it, vi } from 'vitest'
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

const rangeTemplate = template.replace(
  '<input data-part="input" id="input-dob" name="input-dob" type="text">',
  `<input data-part="input" id="input-dob" name="input-dob" type="text">
     <label data-part="label">End date</label>
     <input data-part="input" id="input-dob:1" name="end-date" type="text">`,
)

it('shows the chosen date when a controlled picker accepts it a microtask later', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, template, {
    value: [new Date(2024, 5, 15)],
    onValueChange({ value }) {
      queueMicrotask(() => component.elements.getInstance()!.machine.updateProps({ value }))
    },
  })
  await userEvent.click(component.elements.getTriggerEl())
  await page.getByRole('button', { name: '20 June 2024 Thursday' }).click()
  await expect.element(component.elements.getInputEl()).toHaveValue('06/20/2024')
})

it('reports a typed date through onValueChange', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, template, { onValueChange })
  await userEvent.fill(component.elements.getInputEl(), '06/20/2024')
  await vi.waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ valueAsString: ['2024-06-20'] })))
})

it('closes the calendar through setOpen(false) and reports it', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, template, { onOpenChange })
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(component.elements.getCalendarEl()).toBeVisible()
  onOpenChange.mockClear()

  component.elements.getInstance()!.api.setOpen(false)
  await expect.element(component.elements.getCalendarEl()).not.toBeVisible()
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
})

it('reports closing from the calendar button through onOpenChange', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDatePicker(rootId, template, { onOpenChange })
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(component.elements.getCalendarEl()).toBeVisible()
  await userEvent.click(component.elements.getTriggerEl())
  await expect.element(component.elements.getCalendarEl()).not.toBeVisible()
  expect(onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: false }]])
})

it('rewrites the end input when a controlled range value changes', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, rangeTemplate, {
    selectionMode: 'range',
    value: [new Date(2024, 5, 15), new Date(2024, 5, 20)],
  })
  await expect.element(component.elements.getInputEl(1)).toHaveValue('06/20/2024')

  component.elements.getInstance()!.machine.updateProps({ value: [new Date(2024, 5, 15), new Date(2024, 5, 25)] })
  await expect.element(component.elements.getInputEl(1)).toHaveValue('06/25/2024')
})

// Programmatic and controlled range updates are port-specific APIs.
it('validates both native inputs when setValue supplies reversed range dates', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, `<form>${rangeTemplate}</form>`, { selectionMode: 'range' })
  const start = component.elements.getInputEl(0)
  const end = component.elements.getInputEl(1)
  component.elements.getInstance()!.api.setValue([new Date(2024, 5, 20), new Date(2024, 5, 10)])
  await expect.element(start).toHaveValue('06/20/2024')
  await expect.element(end).toHaveValue('06/10/2024')
  await expect.poll(() => [start.validity.customError, end.validity.customError]).toEqual([true, true])
  expect(start.form!.checkValidity()).toBe(false)

  component.elements.getInstance()!.api.setValue([new Date(2024, 5, 5), new Date(2024, 5, 10)])
  await expect.element(start).toHaveValue('06/05/2024')
  await expect.poll(() => start.form!.checkValidity()).toBe(true)
})

it.each([false, true])('refreshes unchanged end-input validity after a controlled peer update, focused=%s', { tags: ['new'] }, async (focused) => {
  await using component = createDisposableDatePicker(rootId, `<form>${rangeTemplate}</form>`, {
    selectionMode: 'range',
    value: [new Date(2024, 5, 5), new Date(2024, 5, 10)],
  })
  const end = component.elements.getInputEl(1)
  await expect.element(end).toHaveValue('06/10/2024')
  const expectedText = focused ? '06/15/2024' : '06/10/2024'
  if (focused) {
    await userEvent.fill(end, expectedText)
    expect(document.activeElement).toBe(end)
  }
  const onEndChange = vi.fn()
  end.addEventListener('change', onEndChange)
  const instance = component.elements.getInstance()!
  instance.machine.updateProps({ value: [new Date(2024, 5, 20), new Date(2024, 5, 10)] })
  await expect.poll(() => end.validity.customError).toBe(true)
  expect(end.form!.checkValidity()).toBe(false)
  expect(end.value).toBe(expectedText)
  if (focused)
    expect(document.activeElement).toBe(end)

  instance.machine.updateProps({ value: [new Date(2024, 5, 5), new Date(2024, 5, 10)] })
  await expect.poll(() => end.form!.checkValidity()).toBe(true)
  expect(end.value).toBe(expectedText)
  if (focused)
    expect(document.activeElement).toBe(end)
  expect(onEndChange).not.toHaveBeenCalled()
})

it('toggles an unindexed range trigger and switches from the end date to the start date', { tags: ['new'] }, async () => {
  await using component = createDisposableDatePicker(rootId, rangeTemplate, {
    selectionMode: 'range',
    defaultValue: [new Date(2024, 5, 5), new Date(2024, 7, 10)],
  })
  const trigger = component.elements.getTriggerEl()
  const calendar = component.elements.getCalendarEl()
  await userEvent.click(trigger)
  await expect.element(calendar).toBeVisible()
  await userEvent.click(trigger)
  await expect.element(calendar).not.toBeVisible()

  component.elements.getInstance()!.api.setOpen(true, 1)
  await expect.element(calendar).toBeVisible()
  await expect.element(page.getByRole('button', { name: 'August. Select month' })).toBeVisible()
  await userEvent.click(trigger)
  await expect.element(calendar).toBeVisible()
  await expect.element(page.getByRole('button', { name: 'June. Select month' })).toBeVisible()
  await userEvent.click(trigger)
  await expect.element(calendar).not.toBeVisible()
})
