import { chunk } from '@zag-js/utils'
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
              <DatePicker.PrevDecadeTrigger />
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
              <DatePicker.NextDecadeTrigger />
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
      <DatePicker.Status />
    </DatePicker.Root>
  ),
})
