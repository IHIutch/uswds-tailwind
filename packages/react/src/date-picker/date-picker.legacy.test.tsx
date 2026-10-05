import type { DatePickerRootProps } from './date-picker'
import { chunk } from '@zag-js/utils'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { DatePicker } from './date-picker'

// Behavioral parity tests mirroring e2e/date-picker/date-picker.test.ts.

function renderDatePicker(props: DatePickerRootProps = {}) {
  return render(
    <DatePicker.Root {...props}>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger aria-label="Open calendar" />
      </DatePicker.Control>
      <DatePicker.Content>
        <DatePicker.View view="day">
          {({ api }) => (
            <>
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger unit="year" aria-label="Previous year" />
                <DatePicker.PrevTrigger unit="month" aria-label="Previous month" />
                <DatePicker.ViewTrigger view="month" />
                <DatePicker.ViewTrigger view="year" />
                <DatePicker.NextTrigger unit="month" aria-label="Next month" />
                <DatePicker.NextTrigger unit="year" aria-label="Next year" />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.TableHead>
                  <DatePicker.TableRow>
                    {api.weekDays.map((day, index) => (
                      <DatePicker.TableHeader key={day.long} day={day} index={index} />
                    ))}
                  </DatePicker.TableRow>
                </DatePicker.TableHead>
                <DatePicker.TableBody>
                  {api.weeks.map((week, row) => (
                    <DatePicker.TableRow key={row}>
                      {week.map(cell => (
                        <DatePicker.TableCell key={cell.toISOString()} value={cell}>
                          <DatePicker.TableCellTrigger value={cell}>
                            {cell.getDate()}
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
                      <DatePicker.TableCell key={month}>
                        <DatePicker.TableCellTrigger value={month}>
                          {api.monthLabels[month]}
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
              <DatePicker.PrevTrigger view="year" aria-label="Previous decade" />
              <DatePicker.Table>
                <DatePicker.TableBody>
                  {chunk(api.years, 3).map((row, rowIdx) => (
                    <DatePicker.TableRow key={rowIdx}>
                      {row.map(year => (
                        <DatePicker.TableCell key={year}>
                          <DatePicker.TableCellTrigger value={year}>
                            {year}
                          </DatePicker.TableCellTrigger>
                        </DatePicker.TableCell>
                      ))}
                    </DatePicker.TableRow>
                  ))}
                </DatePicker.TableBody>
              </DatePicker.Table>
              <DatePicker.NextTrigger view="year" aria-label="Next decade" />
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>,
  )
}

function getContent() {
  return document.querySelector('[data-scope="date-picker"][data-part="content"]') as HTMLElement | null
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

  const monthTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="month"]')
  const yearTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]')
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

  const monthTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="month"]')
  const yearTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]')
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

  const monthTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="month"]')
  const yearTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]')
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

  const yearTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]')
  expect(yearTrigger?.textContent).toBe('2021')
})

it('clicking the previous year trigger retreats to the previous year', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/15/2020')
  await userEvent.click(trigger)

  await userEvent.click(screen.getByRole('button', { name: 'Previous year' }))

  const yearTrigger = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]')
  expect(yearTrigger?.textContent).toBe('2019')
})

it('`min` prop disables earlier dates in the calendar', async () => {
  const screen = await render(
    <DatePicker.Root min={new Date(2020, 0, 10)} defaultValue={[new Date(2020, 0, 15)]}>
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
                      <DatePicker.TableCell key={cell.toISOString()} value={cell}>
                        <DatePicker.TableCellTrigger value={cell}>
                          {cell.getDate()}
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
      '[data-scope="date-picker"][data-part="table-cell-trigger"]',
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

  const monthSelection = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="month"]') as HTMLButtonElement
  await userEvent.click(monthSelection)

  const monthPicker = document.querySelector('[data-scope="date-picker"][data-part="view"][data-view="month"]')
  expect(monthPicker).toBeTruthy()
  expect(monthPicker?.hasAttribute('hidden')).toBe(false)
})

it('clicking the year selection opens the year picker view', async () => {
  const screen = await renderDatePicker()
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.click(trigger)

  const yearSelection = document.querySelector('[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]') as HTMLButtonElement
  await userEvent.click(yearSelection)

  const yearPicker = document.querySelector('[data-scope="date-picker"][data-part="view"][data-view="year"]')
  expect(yearPicker).toBeTruthy()
  expect(yearPicker?.hasAttribute('hidden')).toBe(false)
})

it('selecting a month from the month picker returns to day view on that month', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  await userEvent.fill(input, '01/15/2020') // January
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))

  const monthSelection = document.querySelector<HTMLButtonElement>(
    '[data-scope="date-picker"][data-part="view-trigger"][data-view="month"]',
  )!
  await userEvent.click(monthSelection)

  // Click "June" in the month grid — find by visible text.
  const monthCells = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="date-picker"][data-part="view"][data-view="month"] [data-part="table-cell-trigger"]',
    ),
  )
  const june = monthCells.find(b => /^Jun/i.test(b.textContent || ''))!
  await userEvent.click(june)

  // Back in day view: month header now reads "June".
  const monthAfter = document.querySelector(
    '[data-scope="date-picker"][data-part="view-trigger"][data-view="month"]',
  )
  expect(monthAfter?.textContent).toBe('June')
})

it('selecting a year from the year picker returns to day view with that year', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  await userEvent.fill(input, '06/15/2020')
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))

  const yearSelection = document.querySelector<HTMLButtonElement>(
    '[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]',
  )!
  await userEvent.click(yearSelection)

  // Grab the first rendered year cell, click it, then confirm header reflects it.
  const yearCells = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '[data-scope="date-picker"][data-part="view"][data-view="year"] [data-part="table-cell-trigger"]',
    ),
  )
  const firstYear = yearCells[0]!
  const targetYear = firstYear.textContent?.trim()
  await userEvent.click(firstYear)

  const yearAfter = document.querySelector(
    '[data-scope="date-picker"][data-part="view-trigger"][data-view="year"]',
  )
  expect(yearAfter?.textContent?.trim()).toBe(targetYear)
})

it('clicking a day cell selects that date and closes the calendar', async () => {
  const screen = await renderDatePicker()
  const input = screen.getByRole('textbox')
  const trigger = screen.getByRole('button', { name: 'Open calendar' })

  await userEvent.fill(input, '01/01/2020')
  await userEvent.click(trigger)

  const dayButtons = document.querySelectorAll('[data-scope="date-picker"][data-part="table-cell-trigger"]')
  const day10 = Array.from(dayButtons).find(b => b.textContent?.trim() === '10') as HTMLButtonElement
  await userEvent.click(day10)

  expect((input.element() as HTMLInputElement).value).toBe('01/10/2020')
  expect(getContent()?.hasAttribute('hidden')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1238-L1251
it('focuses the navigation header when the previous-year button becomes disabled at the minimum month', async () => {
  const screen = await renderDatePicker({ defaultValue: [new Date(2024, 5, 15)], min: new Date(2024, 2, 1), max: new Date(2024, 8, 30) })
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
  await userEvent.click(screen.getByRole('button', { name: 'Previous year' }))

  await expect.element(screen.getByRole('button', { name: 'March. Select month' })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Previous year' })).toBeDisabled()
  const header = document.querySelector('[data-part="view-control"]')
  expect(header).not.toBeNull()
  await expect.poll(() => document.activeElement).toBe(header)
})
