import { DatePicker } from '@uswds-tailwind/react'

const minDate = '2026-09-01'
const maxDate = '2026-10-31'
const initialRange = ['2026-09-15', '2026-09-20']

function rowsOfThree<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let index = 0; index < items.length; index += 3) {
    rows.push(items.slice(index, index + 3))
  }
  return rows
}

export default function DateRangePickerDemo() {
  return (
    <DatePicker.Root
      selectionMode="range"
      ids={{ input: ['event-start', 'event-end'] }}
      min={minDate}
      max={maxDate}
      defaultValue={initialRange}
      className="max-w-mobile-lg flex-col gap-6"
    >
      <div>
        <label htmlFor="event-start" className="block">Start date</label>
        <div id="event-start-hint" className="text-gray-50">MM/DD/YYYY, September 1 through October 31, 2026</div>
        <DatePicker.Control bound="start">
          <DatePicker.Input id="event-start" name="eventStart" aria-describedby="event-start-hint" />
          <DatePicker.Trigger />
        </DatePicker.Control>
      </div>
      <div>
        <label htmlFor="event-end" className="block">End date</label>
        <div id="event-end-hint" className="text-gray-50">MM/DD/YYYY, September 1 through October 31, 2026; no earlier than the start date</div>
        <DatePicker.Control bound="end">
          <DatePicker.Input id="event-end" name="eventEnd" aria-describedby="event-end-hint" />
          <DatePicker.Trigger />
        </DatePicker.Control>
      </div>
      <DatePicker.Content>
        <DatePicker.View view="day">
          {({ api }) => (
            <>
              <DatePicker.ViewControl>
                <DatePicker.PrevYearTrigger />
                <DatePicker.PrevMonthTrigger />
                <div className="flex grow justify-center">
                  <DatePicker.MonthTrigger />
                  <DatePicker.YearTrigger />
                </div>
                <DatePicker.NextMonthTrigger />
                <DatePicker.NextYearTrigger />
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
                {rowsOfThree(api.months).map((row, rowIndex) => (
                  <DatePicker.TableRow key={rowIndex}>
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
              <DatePicker.PrevDecadeTrigger />
              <DatePicker.Table>
                <DatePicker.TableBody>
                  {rowsOfThree(api.years).map((row, rowIndex) => (
                    <DatePicker.TableRow key={rowIndex}>
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
              <DatePicker.NextDecadeTrigger />
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
      <DatePicker.Status />
    </DatePicker.Root>
  )
}
