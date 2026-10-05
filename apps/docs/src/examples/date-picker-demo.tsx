import { DatePicker } from '@uswds-tailwind/react'

const minDate = '2026-09-01'
const maxDate = '2026-10-31'
const initialDate = ['2026-09-28']

function rowsOfThree<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let index = 0; index < items.length; index += 3) {
    rows.push(items.slice(index, index + 3))
  }
  return rows
}

export default function DatePickerDemo() {
  return (
    <div>
      <label htmlFor="appointment-date" className="block">Appointment date</label>
      <div id="appointment-date-hint" className="text-gray-50">
        MM/DD/YYYY, September 1 through October 31, 2026. Try an unavailable or impossible date.
      </div>
      <DatePicker.Root
        ids={{ input: 'appointment-date' }}
        min={minDate}
        max={maxDate}
        defaultValue={initialDate}
        className="max-w-mobile-lg"
      >
        <DatePicker.Control>
          <DatePicker.Input id="appointment-date" name="appointmentDate" aria-describedby="appointment-date-hint" />
          <DatePicker.Trigger />
        </DatePicker.Control>
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
    </div>
  )
}
