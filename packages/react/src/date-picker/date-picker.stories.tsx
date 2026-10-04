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
                <DatePicker.PrevTrigger unit="year" />
                <DatePicker.PrevTrigger unit="month" />
                <div className="flex grow justify-center">
                  <DatePicker.ViewTrigger view="month" />
                  <DatePicker.ViewTrigger view="year" />
                </div>
                <DatePicker.NextTrigger unit="month" />
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
              <DatePicker.PrevTrigger unit="chunk" />
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
              <DatePicker.NextTrigger unit="chunk" />
            </>
          )}
        </DatePicker.View>
      </DatePicker.Content>
      <DatePicker.Status />
    </DatePicker.Root>
  ),
})
