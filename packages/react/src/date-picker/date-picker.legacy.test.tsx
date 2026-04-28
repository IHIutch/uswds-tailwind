import { chunk } from '@zag-js/utils'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { DatePicker } from './date-picker'

// Behavioral parity tests mirroring e2e/date-picker/date-picker.test.ts.

function renderDatePicker() {
  return render(
    <DatePicker.Root>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger aria-label="Open calendar" />
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
        <DatePicker.View view="month">
          {({ api }) => (
            <DatePicker.Table>
              <DatePicker.TableBody>
                {chunk(api.months, 3).map((row, rowIdx) => (
                  <DatePicker.TableRow key={rowIdx}>
                    {row.map(month => (
                      <DatePicker.TableCell key={month.month}>
                        <DatePicker.TableCellTrigger cell={month}>
                          {month.label}
                        </DatePicker.TableCellTrigger>
                      </DatePicker.TableCell>
                    ))}
                  </DatePicker.TableRow>
                ))}
              </DatePicker.TableBody>
            </DatePicker.Table>
          )}
        </DatePicker.View>
        <DatePicker.View view="year">
          {({ api }) => (
            <>
              <DatePicker.PrevDecadeTrigger aria-label="Previous decade" />
              <DatePicker.Table>
                <DatePicker.TableBody>
                  {chunk(api.years, 3).map((row, rowIdx) => (
                    <DatePicker.TableRow key={rowIdx}>
                      {row.map(year => (
                        <DatePicker.TableCell key={year.year}>
                          <DatePicker.TableCellTrigger cell={year}>
                            {year.year}
                          </DatePicker.TableCellTrigger>
                        </DatePicker.TableCell>
                      ))}
                    </DatePicker.TableRow>
                  ))}
                </DatePicker.TableBody>
              </DatePicker.Table>
              <DatePicker.NextDecadeTrigger aria-label="Next decade" />
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>,
  )
}

// SUGGESTION (review): every test in this file reaches into the DOM with
// `[data-scope="datepicker"][data-part="..."]` selectors. Those are our Zag
// anatomy — they'd break on any rename even when the calendar behavior is
// unchanged. Most of these could be replaced with `getByRole('button',
// { name: /January/i })` (month-selection), `getByRole('grid')` (table),
// `getByRole('dialog')` (calendar content) — at the cost of a bit more
// verbosity, but much more robust. Leaving the pattern here as-is; worth
// revisiting as a batch.
function getContent() {
  return document.querySelector('[data-scope="datepicker"][data-part="calendar"]') as HTMLElement | null
}

it('renders input and trigger button', async () => {
  const screen = await renderDatePicker()
  await expect.element(screen.getByRole('textbox')).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Open calendar' })).toBeVisible()
})

it('clicking the trigger opens the calendar', async () => {
  const screen = await renderDatePicker()
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.click(trigger)
  const content = getContent()
  expect(content?.hasAttribute('hidden')).toBe(false)
})

it('clicking the trigger twice closes the calendar', async () => {
  const screen = await renderDatePicker()
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.click(trigger)
  expect(getContent()?.hasAttribute('hidden')).toBe(false)

  await userEvent.click(trigger)
  expect(getContent()?.hasAttribute('hidden')).toBe(true)
})

it('pressing Escape closes the calendar', async () => {
  const screen = await renderDatePicker()
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.click(trigger)
  expect(getContent()?.hasAttribute('hidden')).toBe(false)

  await userEvent.keyboard('{Escape}')
  expect(getContent()?.hasAttribute('hidden')).toBe(true)
})

it('filling the input with a date shows that month when opening calendar', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/15/2020')
  await userEvent.click(trigger)

  const monthTrigger = document.querySelector('[data-scope="datepicker"][data-part="month-selection"]')
  const yearTrigger = document.querySelector('[data-scope="datepicker"][data-part="year-selection"]')
  expect(monthTrigger?.textContent).toBe('January')
  expect(yearTrigger?.textContent).toBe('2020')
})

it('clicking the next month trigger advances to the next month', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/15/2020')
  await userEvent.click(trigger)

  await userEvent.click(screen.getByRole('button', { name: 'Next month' }))

  const monthTrigger = document.querySelector('[data-scope="datepicker"][data-part="month-selection"]')
  const yearTrigger = document.querySelector('[data-scope="datepicker"][data-part="year-selection"]')
  expect(monthTrigger?.textContent).toBe('February')
  expect(yearTrigger?.textContent).toBe('2020')
})

it('clicking the previous month trigger retreats to the previous month', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/15/2020')
  await userEvent.click(trigger)

  await userEvent.click(screen.getByRole('button', { name: 'Previous month' }))

  const monthTrigger = document.querySelector('[data-scope="datepicker"][data-part="month-selection"]')
  const yearTrigger = document.querySelector('[data-scope="datepicker"][data-part="year-selection"]')
  expect(monthTrigger?.textContent).toBe('December')
  expect(yearTrigger?.textContent).toBe('2019')
})

it('clicking the next year trigger advances to the next year', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/15/2020')
  await userEvent.click(trigger)

  await userEvent.click(screen.getByRole('button', { name: 'Next year' }))

  const yearTrigger = document.querySelector('[data-scope="datepicker"][data-part="year-selection"]')
  expect(yearTrigger?.textContent).toBe('2021')
})

it('clicking the previous year trigger retreats to the previous year', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/15/2020')
  await userEvent.click(trigger)

  await userEvent.click(screen.getByRole('button', { name: 'Previous year' }))

  const yearTrigger = document.querySelector('[data-scope="datepicker"][data-part="year-selection"]')
  expect(yearTrigger?.textContent).toBe('2019')
})

it('`min` prop disables earlier dates in the calendar', async () => {
  const screen = await render(
    <DatePicker.Root min="2020-01-10" defaultValue={['2020-01-15']}>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger aria-label="Open calendar" />
      </DatePicker.Control>
      <DatePicker.Content>
        <DatePicker.View view="day">
          {({ api }) => (
            <DatePicker.Table>
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
          )}
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))

  const cells = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="datepicker"][data-part="cell-trigger"]',
    ),
  )
  const jan5 = cells.find(c => (c.getAttribute('aria-label') || '').startsWith('5 January 2020'))
  const jan15 = cells.find(c => (c.getAttribute('aria-label') || '').startsWith('15 January 2020'))

  expect(jan5?.disabled).toBe(true)
  expect(jan15?.disabled).toBe(false)
})

it('clicking the month selection opens the month picker view', async () => {
  const screen = await renderDatePicker()
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.click(trigger)

  const monthSelection = document.querySelector('[data-scope="datepicker"][data-part="month-selection"]') as HTMLButtonElement
  await userEvent.click(monthSelection)

  const monthPicker = document.querySelector('[data-scope="datepicker"][data-part="month-picker"]')
  expect(monthPicker).toBeTruthy()
  expect(monthPicker?.hasAttribute('hidden')).toBe(false)
})

it('clicking the year selection opens the year picker view', async () => {
  const screen = await renderDatePicker()
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.click(trigger)

  const yearSelection = document.querySelector('[data-scope="datepicker"][data-part="year-selection"]') as HTMLButtonElement
  await userEvent.click(yearSelection)

  const yearPicker = document.querySelector('[data-scope="datepicker"][data-part="year-picker"]')
  expect(yearPicker).toBeTruthy()
  expect(yearPicker?.hasAttribute('hidden')).toBe(false)
})

it('selecting a month from the month picker returns to day view on that month', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  await userEvent.fill(input, '01/15/2020') // January
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))

  const monthSelection = document.querySelector<HTMLButtonElement>(
    '[data-scope="datepicker"][data-part="month-selection"]',
  )!
  await userEvent.click(monthSelection)

  // Click "June" in the month grid — find by visible text.
  const monthCells = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="datepicker"][data-part="month-picker"] [data-part="cell-trigger"]',
    ),
  )
  const june = monthCells.find(b => /^Jun/i.test(b.textContent || ''))!
  await userEvent.click(june)

  // Back in day view: month header now reads "June".
  const monthAfter = document.querySelector(
    '[data-scope="datepicker"][data-part="month-selection"]',
  )
  expect(monthAfter?.textContent).toBe('June')
})

it('selecting a year from the year picker returns to day view with that year', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  await userEvent.fill(input, '06/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))

  const yearSelection = document.querySelector<HTMLButtonElement>(
    '[data-scope="datepicker"][data-part="year-selection"]',
  )!
  await userEvent.click(yearSelection)

  // Grab the first rendered year cell, click it, then confirm header reflects it.
  const yearCells = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="datepicker"][data-part="year-picker"] [data-part="cell-trigger"]',
    ),
  )
  const firstYear = yearCells[0]!
  const targetYear = firstYear.textContent?.trim()
  await userEvent.click(firstYear)

  const yearAfter = document.querySelector(
    '[data-scope="datepicker"][data-part="year-selection"]',
  )
  expect(yearAfter?.textContent?.trim()).toBe(targetYear)
})

it('clicking a day cell selects that date and closes the calendar', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/01/2020')
  await userEvent.click(trigger)

  const dayButtons = document.querySelectorAll('[data-scope="datepicker"][data-part="cell-trigger"]')
  const day10 = Array.from(dayButtons).find(b => b.textContent?.trim() === '10') as HTMLButtonElement
  await userEvent.click(day10)

  expect((input.element() as HTMLInputElement).value).toBe('01/10/2020')
  expect(getContent()?.hasAttribute('hidden')).toBe(true)
})
