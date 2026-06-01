import * as React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Field } from '../field/field'
import { DatePicker } from './date-picker'

function renderRangePicker(
  rootProps: Partial<React.ComponentProps<typeof DatePicker.Root>> = {},
) {
  return render(
    <DatePicker.Root selectionMode="range" {...rootProps}>
      <DatePicker.Control bound="start">
        <DatePicker.Input aria-label="Start date" />
        <DatePicker.Trigger />
      </DatePicker.Control>
      <DatePicker.Control bound="end">
        <DatePicker.Input aria-label="End date" />
        <DatePicker.Trigger />
      </DatePicker.Control>
      <DatePicker.Content>
        <DatePicker.View view="day">
          {({ api }) => (
            <>
              <DatePicker.ViewControl>
                <DatePicker.PrevYearTrigger aria-label="Previous year" />
                <DatePicker.PrevMonthTrigger aria-label="Previous month" />
                <DatePicker.MonthTrigger />
                <DatePicker.YearTrigger />
                <DatePicker.NextMonthTrigger aria-label="Next month" />
                <DatePicker.NextYearTrigger aria-label="Next year" />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.TableHead>
                  <DatePicker.TableRow>
                    {api.weekDays.map(day => (
                      <DatePicker.TableHeader key={day.long} day={day} />
                    ))}
                  </DatePicker.TableRow>
                </DatePicker.TableHead>
                <DatePicker.TableBody>
                  {api.weeks.map((week, row) => (
                    <DatePicker.TableRow key={row}>
                      {week.map(cell => (
                        <DatePicker.TableCell key={cell.dateString} cell={cell}>
                          <DatePicker.TableCellTrigger cell={cell}>
                            {cell.day}
                          </DatePicker.TableCellTrigger>
                        </DatePicker.TableCell>
                      ))}
                    </DatePicker.TableRow>
                  ))}
                </DatePicker.TableBody>
              </DatePicker.Table>
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>,
  )
}

function getContent() {
  return document.querySelector('[data-scope="datepicker"][data-part="calendar"]') as HTMLElement | null
}

function getDayCells() {
  return Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="datepicker"][data-part="cell-trigger"]',
    ),
  )
}

function findDay(text: string) {
  return getDayCells().find(b => b.textContent?.trim() === text)
}

it('renders two inputs and two triggers', async () => {
  const screen = await renderRangePicker()

  await expect.element(screen.getByRole('textbox', { name: 'Start date' })).toBeVisible()
  await expect.element(screen.getByRole('textbox', { name: 'End date' })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Open start calendar' })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Open end calendar' })).toBeVisible()
})

it('trigger derives aria-label from Control bound', async () => {
  const screen = await render(
    <DatePicker.Root selectionMode="range">
      <DatePicker.Control bound="start">
        <DatePicker.Input aria-label="Start date" />
        <DatePicker.Trigger />
      </DatePicker.Control>
      <DatePicker.Control bound="end">
        <DatePicker.Input aria-label="End date" />
        <DatePicker.Trigger />
      </DatePicker.Control>
    </DatePicker.Root>,
  )

  await expect.element(screen.getByRole('button', { name: 'Open start calendar' })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Open end calendar' })).toBeVisible()
})

it('consumer aria-label on Trigger overrides bound-derived default', async () => {
  const screen = await render(
    <DatePicker.Root selectionMode="range">
      <DatePicker.Control bound="start">
        <DatePicker.Input aria-label="From" />
        <DatePicker.Trigger aria-label="Pick a from date" />
      </DatePicker.Control>
      <DatePicker.Control bound="end">
        <DatePicker.Input aria-label="To" />
        <DatePicker.Trigger />
      </DatePicker.Control>
    </DatePicker.Root>,
  )

  await expect.element(screen.getByRole('button', { name: 'Pick a from date' })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Open end calendar' })).toBeVisible()
})

it('clicking the start trigger opens the calendar', async () => {
  const screen = await renderRangePicker()
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))
  expect(getContent()?.hasAttribute('hidden')).toBe(false)
})

it('clicking the end trigger opens the calendar', async () => {
  const screen = await renderRangePicker()
  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))
  expect(getContent()?.hasAttribute('hidden')).toBe(false)
})

it('selecting a day after opening with start trigger writes to the start input', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/01/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))

  await userEvent.click(findDay('10') as HTMLButtonElement)

  expect((startInput.element() as HTMLInputElement).value).toBe('01/10/2020')
  expect((endInput.element() as HTMLInputElement).value).toBe('')
})

it('selecting a day after opening with end trigger writes to the end input', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/01/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  await userEvent.click(findDay('20') as HTMLButtonElement)

  expect((startInput.element() as HTMLInputElement).value).toBe('01/01/2020')
  expect((endInput.element() as HTMLInputElement).value).toBe('01/20/2020')
})

it('selecting via start trigger then end trigger fills both inputs', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/01/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))
  await userEvent.click(findDay('10') as HTMLButtonElement)

  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))
  await userEvent.click(findDay('20') as HTMLButtonElement)

  expect((startInput.element() as HTMLInputElement).value).toBe('01/10/2020')
  expect((endInput.element() as HTMLInputElement).value).toBe('01/20/2020')
})

it('after selecting start, days between start and hovered cell paint data-within-range', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })

  await userEvent.fill(startInput, '01/01/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))
  await userEvent.click(findDay('10') as HTMLButtonElement)

  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  const day15 = findDay('15') as HTMLButtonElement
  await userEvent.hover(day15)

  const day12 = findDay('12') as HTMLButtonElement
  expect(day12.hasAttribute('data-within-range')).toBe(true)
})

it('selecting end input then a day before start swaps the range bounds', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/15/2020')

  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  const day5 = findDay('5') as HTMLButtonElement // before start
  expect(day5.disabled).toBe(true)
  expect((endInput.element() as HTMLInputElement).value).toBe('')
})

it('after start is selected, dates before it are disabled when end picker is open', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })

  await userEvent.fill(startInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  const day5 = findDay('5') as HTMLButtonElement
  const day20 = findDay('20') as HTMLButtonElement
  expect(day5.disabled).toBe(true)
  expect(day20.disabled).toBe(false)
})

it('after end is selected, dates after it are disabled when start picker is open', async () => {
  const screen = await renderRangePicker()
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(endInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))

  const day20 = findDay('20') as HTMLButtonElement
  const day10 = findDay('10') as HTMLButtonElement
  expect(day20.disabled).toBe(true)
  expect(day10.disabled).toBe(false)
})

it('start selection paints data-range-start; end selection paints data-range-end', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/10/2020')
  await userEvent.fill(endInput, '01/20/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))

  const day10 = findDay('10') as HTMLButtonElement
  const day15 = findDay('15') as HTMLButtonElement
  const day20 = findDay('20') as HTMLButtonElement

  expect(day10.hasAttribute('data-range-start')).toBe(true)
  expect(day15.hasAttribute('data-within-range')).toBe(true)
  expect(day20.hasAttribute('data-range-end')).toBe(true)
})

it('field.Label htmlFor matches the start input id by default', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Trip dates</Field.Label>
      <DatePicker.Root selectionMode="range">
        <DatePicker.Control bound="start">
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Control>
        <DatePicker.Control bound="end">
          <DatePicker.Input aria-label="End date" />
          <DatePicker.Trigger />
        </DatePicker.Control>
      </DatePicker.Root>
    </Field.Root>,
  )

  const startInput = screen.getByRole('textbox', { name: 'Trip dates' })
  await expect.element(startInput).toBeVisible()
})

it('submits both values in form data with distinct names', async () => {
  let formData = new FormData()
  const screen = await render(
    <form onSubmit={(e) => {
      e.preventDefault()
      formData = new FormData(e.currentTarget)
    }}
    >
      <DatePicker.Root selectionMode="range">
        <DatePicker.Control bound="start">
          <DatePicker.Input name="start" aria-label="Start date" />
        </DatePicker.Control>
        <DatePicker.Control bound="end">
          <DatePicker.Input name="end" aria-label="End date" />
        </DatePicker.Control>
      </DatePicker.Root>
      <button type="submit">Submit</button>
    </form>,
  )

  await screen.getByRole('textbox', { name: 'Start date' }).fill('01/15/2025')
  await screen.getByRole('textbox', { name: 'End date' }).fill('01/20/2025')
  await screen.getByRole('button', { name: 'Submit' }).click()

  expect(formData.get('start')).toBe('01/15/2025')
  expect(formData.get('end')).toBe('01/20/2025')
})

it('defaultValue with two dates initializes both inputs', async () => {
  const screen = await renderRangePicker({
    defaultValue: ['2020-01-10', '2020-01-20'],
  })

  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  expect((startInput.element() as HTMLInputElement).value).toBe('01/10/2020')
  expect((endInput.element() as HTMLInputElement).value).toBe('01/20/2020')
})

it('typing a malformed date in end input flips end aria-invalid only', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/15/2020')
  await userEvent.fill(endInput, '99/99/9999')

  expect((endInput.element() as HTMLInputElement).getAttribute('aria-invalid')).toBe('true')
  expect((startInput.element() as HTMLInputElement).getAttribute('aria-invalid')).not.toBe('true')
})

it('typing a malformed date in start input flips start aria-invalid only', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(endInput, '01/20/2020')
  await userEvent.fill(startInput, 'not-a-date')

  expect((startInput.element() as HTMLInputElement).getAttribute('aria-invalid')).toBe('true')
  expect((endInput.element() as HTMLInputElement).getAttribute('aria-invalid')).not.toBe('true')
})

it('end date earlier than start flips end aria-invalid (partner-bound violation)', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/15/2020')
  await userEvent.fill(endInput, '12/31/2019') // before start

  expect((endInput.element() as HTMLInputElement).getAttribute('aria-invalid')).toBe('true')
  expect((startInput.element() as HTMLInputElement).getAttribute('aria-invalid')).not.toBe('true')
})

it('start date later than end flips start aria-invalid (partner-bound violation)', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(endInput, '01/15/2020')
  await userEvent.fill(startInput, '01/20/2020') // after end

  expect((startInput.element() as HTMLInputElement).getAttribute('aria-invalid')).toBe('true')
  expect((endInput.element() as HTMLInputElement).getAttribute('aria-invalid')).not.toBe('true')
})

it('both inputs valid → neither aria-invalid', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(startInput, '01/10/2020')
  await userEvent.fill(endInput, '01/20/2020')

  expect((startInput.element() as HTMLInputElement).getAttribute('aria-invalid')).not.toBe('true')
  expect((endInput.element() as HTMLInputElement).getAttribute('aria-invalid')).not.toBe('true')
})

it('end picker prev-month is disabled when focused on start month', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })

  await userEvent.fill(startInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  await expect.element(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled()
})

it('start picker next-month is disabled when focused on end month', async () => {
  const screen = await renderRangePicker()
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(endInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))

  await expect.element(screen.getByRole('button', { name: 'Next month' })).toBeDisabled()
})

it('end picker prev-year is disabled when focused on start month', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })

  await userEvent.fill(startInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  await expect.element(screen.getByRole('button', { name: 'Previous year' })).toBeDisabled()
})

it('switching from start to end picker focuses the end-bound cell, not start', async () => {
  const screen = await renderRangePicker({
    defaultValue: ['2020-01-10', '2020-01-20'],
  })

  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))
  let focused = document.querySelector<HTMLButtonElement>(
    '[data-scope="datepicker"][data-part="cell-trigger"][data-focused]',
  )
  expect(focused?.textContent.trim()).toBe('10')

  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))
  focused = document.querySelector<HTMLButtonElement>(
    '[data-scope="datepicker"][data-part="cell-trigger"][data-focused]',
  )
  expect(focused?.textContent?.trim()).toBe('20')
})

it('keyboard nav in end picker cannot move focus before the start date', async () => {
  const screen = await renderRangePicker()
  const startInput = screen.getByRole('textbox', { name: 'Start date' })

  await userEvent.fill(startInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))

  // Opening the end picker focuses the start-bound cell (15), the effective min.
  const day15 = findDay('15') as HTMLButtonElement
  const day14 = findDay('14') as HTMLButtonElement
  // 14 is before the start date, so it is disabled for the end input.
  expect(day14.disabled).toBe(true)

  // ArrowLeft must clamp against the active field's effective min (the start
  // date), not the global min, so focus stays on 15 instead of landing on 14.
  day15.focus()
  await userEvent.keyboard('{ArrowLeft}')

  const focused = document.querySelector<HTMLButtonElement>(
    '[data-scope="datepicker"][data-part="cell-trigger"][data-focused]',
  )
  expect(focused?.textContent?.trim()).toBe('15')
})

it('keyboard nav in start picker cannot move focus after the end date', async () => {
  const screen = await renderRangePicker()
  const endInput = screen.getByRole('textbox', { name: 'End date' })

  await userEvent.fill(endInput, '01/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))

  const day15 = findDay('15') as HTMLButtonElement
  const day16 = findDay('16') as HTMLButtonElement
  // 16 is after the end date, so it is disabled for the start input.
  expect(day16.disabled).toBe(true)

  // ArrowRight must clamp against the active field's effective max (the end
  // date), not the global max, so focus stays on 15 instead of landing on 16.
  day15.focus()
  await userEvent.keyboard('{ArrowRight}')

  const focused = document.querySelector<HTMLButtonElement>(
    '[data-scope="datepicker"][data-part="cell-trigger"][data-focused]',
  )
  expect(focused?.textContent?.trim()).toBe('15')
})

it('clicking start trigger then end trigger reuses the same calendar instance', async () => {
  const screen = await renderRangePicker()

  await userEvent.click(screen.getByRole('button', { name: 'Open start calendar' }))
  const calendarsAfterStart = document.querySelectorAll('[data-scope="datepicker"][data-part="calendar"]')
  expect(calendarsAfterStart.length).toBe(1)

  await userEvent.click(screen.getByRole('button', { name: 'Open end calendar' }))
  const calendarsAfterEnd = document.querySelectorAll('[data-scope="datepicker"][data-part="calendar"]')
  expect(calendarsAfterEnd.length).toBe(1)
})
