import { DatePicker } from '@uswds-tailwind/react'

function rowsOfThree<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let index = 0; index < items.length; index += 3) {
    rows.push(items.slice(index, index + 3))
  }
  return rows
}

export default function DateRangePickerDemo() {
  return (
    <DatePicker.Root selectionMode="range" className="max-w-mobile-lg flex-col gap-6">
      <div>
        <label htmlFor="event-start" className="block">Start date</label>
        <div id="event-start-hint" className="text-gray-50">mm/dd/yyyy</div>
        <DatePicker.Control bound="start">
          <DatePicker.Input id="event-start" aria-describedby="event-start-hint" />
          <DatePicker.Trigger />
        </DatePicker.Control>
      </div>
      <div>
        <label htmlFor="event-end" className="block">End date</label>
        <div id="event-end-hint" className="text-gray-50">mm/dd/yyyy</div>
        <DatePicker.Control bound="end">
          <DatePicker.Input id="event-end" aria-describedby="event-end-hint" />
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
