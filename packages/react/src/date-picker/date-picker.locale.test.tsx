import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { DatePicker } from './date-picker'

it('uses the locale prop instead of the page language', async () => {
  const pageLang = document.documentElement.lang
  document.documentElement.lang = 'de'
  try {
    const screen = await render(
      <DatePicker.Root locale="fr" defaultValue={[new Date(2026, 8, 15)]}>
        <DatePicker.Input />
        <DatePicker.View view="day">
          {({ api }) => <span data-testid="labels">{`${api.monthLabels[8]} ${api.weekDays[0]!.long}`}</span>}
        </DatePicker.View>
      </DatePicker.Root>,
    )
    await expect.element(screen.getByTestId('labels')).toHaveTextContent('septembre dimanche')
  }
  finally {
    document.documentElement.lang = pageLang
  }
})
