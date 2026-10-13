import { DatePicker } from '@uswds-tailwind/react/date-picker'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { expect, it } from 'vitest'

for (const selectionMode of ['single', 'range']) {
  it(`renders ${selectionMode} date selection without a browser document`, () => {
    const html = renderToString(createElement(
      DatePicker.Root,
      { selectionMode, defaultValue: [new Date(2026, 8, 15)] },
      createElement(DatePicker.Input),
      selectionMode === 'range' && createElement(DatePicker.Input, { index: 1 }),
      createElement(DatePicker.View, { view: 'day' }, ({ api }) => createElement('span', null, `${api.monthLabels[8]} ${api.weekDays[0].long}`)),
    ))
    expect(html).toContain('September Sunday')
    expect(html).toContain(`data-scope="${selectionMode === 'range' ? 'date-range-picker' : 'date-picker'}"`)
  })
}
