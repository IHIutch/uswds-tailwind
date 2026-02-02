import preview from '../../.storybook/preview'
import { DatePicker } from './date-picker'

const meta = preview.meta({
  title: 'Components/DatePicker',
  component: DatePicker.Root,
  argTypes: {
  },
})

export const Basic = meta.story({
  args: {
  },
  render: () => (
    <DatePicker.Root className="max-w-mobile-lg">
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger />
      </DatePicker.Control>
      <DatePicker.Content>
        <DatePicker.View view="day">
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
              {({ api }) => (
                <DatePicker.TableRow>
                  {api.getWeekDays().map(day => (
                    <DatePicker.TableHeader key={day.index} dayIndex={day.index}>
                      {day.label}
                    </DatePicker.TableHeader>
                  ))}
                </DatePicker.TableRow>
              )}
            </DatePicker.TableHead>
            <DatePicker.TableBody>
              {({ api, context }) => (
                <>
                  {api.getWeeksInMonth(context.get('calendarDate')).map((week, weekIndex) => (
                    <DatePicker.TableRow key={weekIndex}>
                      {week.map((day, dayIndex) => (
                        <DatePicker.TableCell key={dayIndex}>
                          <DatePicker.TableCellTrigger value={day.getDate()}>
                            {String(day?.getDate())}
                          </DatePicker.TableCellTrigger>
                        </DatePicker.TableCell>
                      ))}
                    </DatePicker.TableRow>
                  ))}
                </>
              )}
            </DatePicker.TableBody>
          </DatePicker.Table>
        </DatePicker.View>
        <DatePicker.View view="month">
          {({ api }) => (
            <DatePicker.Table>
              <DatePicker.TableBody>
                {api.getMonthsGrid().map((months, row) => (
                  <DatePicker.TableRow key={row}>
                    {months.map((month, cell) => (
                      <DatePicker.TableCell key={cell}>
                        <DatePicker.TableCellTrigger value={month.value}>
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
            <DatePicker.Table>
              <DatePicker.TableBody>
                {api.getYearsGrid().map((years, row) => (
                  <DatePicker.TableRow key={row}>
                    {years.map((year, cell) => (
                      <DatePicker.TableCell key={cell}>
                        <DatePicker.TableCellTrigger value={year.value}>
                          {year.label}
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
    </DatePicker.Root>
  ),
})
