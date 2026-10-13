import { DatePicker } from '@uswds-tailwind/react'

const minDate = new Date(2026, 8, 1)
const maxDate = new Date(2026, 9, 31)
const initialRange = [new Date(2026, 8, 15), new Date(2026, 8, 20)]

export default function DateRangePickerDemo() {
  return (
    <DatePicker.Root
      selectionMode="range"
      ids={{ input: index => index === 0 ? 'event-start' : 'event-end' }}
      min={minDate}
      max={maxDate}
      defaultValue={initialRange}
      className="max-w-mobile-lg flex-col gap-6"
    >
      <div>
        <label htmlFor="event-start" className="block">Start date</label>
        <div id="event-start-hint" className="text-gray-50">MM/DD/YYYY, September 1 through October 31, 2026</div>
        <DatePicker.Control>
          <DatePicker.Input index={0} id="event-start" name="eventStart" aria-describedby="event-start-hint" />
          <DatePicker.Trigger index={0} />
        </DatePicker.Control>
      </div>
      <div>
        <label htmlFor="event-end" className="block">End date</label>
        <div id="event-end-hint" className="text-gray-50">MM/DD/YYYY, September 1 through October 31, 2026; no earlier than the start date</div>
        <DatePicker.Control>
          <DatePicker.Input index={1} id="event-end" name="eventEnd" aria-describedby="event-end-hint" />
          <DatePicker.Trigger index={1} />
        </DatePicker.Control>
      </div>
      <DatePicker.Content>
        <DatePicker.View view="day">
          {({ api }) => (
            <>
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger unit="year" />
                <DatePicker.PrevTrigger />
                <div className="flex grow justify-center">
                  <DatePicker.ViewTrigger view="month" />
                  <DatePicker.ViewTrigger view="year" />
                </div>
                <DatePicker.NextTrigger />
                <DatePicker.NextTrigger unit="year" />
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
                        <DatePicker.TableCell key={cell.getTime()} value={cell}>
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
                {api.monthRows.map((row, rowIndex) => (
                  <DatePicker.TableRow key={rowIndex}>
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
              <DatePicker.PrevTrigger view="year" />
              <DatePicker.Table>
                <DatePicker.TableBody>
                  {api.yearRows.map((row, rowIndex) => (
                    <DatePicker.TableRow key={rowIndex}>
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
              <DatePicker.NextTrigger view="year" />
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
      <DatePicker.Status />
    </DatePicker.Root>
  )
}
