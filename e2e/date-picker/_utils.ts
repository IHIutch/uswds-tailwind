import type * as datePicker from '../../packages/machines/date-picker-compat/src'
import { query, queryAll } from '@zag-js/dom-query'
import { DatePicker, datePickerInit } from '../../packages/compat/src/date-picker'
import { createDisposableComponent } from '../_utils'

// The browser fixture has no USWDS icon CSS, so give its empty trigger and
// navigation buttons usable click targets while preserving their accessible names.
const fixtureStyles = `
  <style>
    [data-scope="date-picker"] button[data-part="trigger"],
    [data-scope="date-picker"] button[data-part="prev-trigger"][data-unit="year"],
    [data-scope="date-picker"] button[data-part="prev-trigger"][data-unit="month"],
    [data-scope="date-picker"] button[data-part="next-trigger"][data-unit="year"],
    [data-scope="date-picker"] button[data-part="next-trigger"][data-unit="month"],
    [data-scope="date-picker"] button[data-part="prev-trigger"][data-unit="chunk"],
    [data-scope="date-picker"] button[data-part="next-trigger"][data-unit="chunk"] {
      min-width: 2rem;
      min-height: 2rem;
    }
  </style>
`

export function createDisposableDatePicker(id: string, template: string, props?: datePicker.Props) {
  return createDisposableComponent(
    `${fixtureStyles}${template}`,
    () => {
      if (props === undefined)
        return datePickerInit()
      return [new DatePicker(document.getElementById(id), props).init()]
    },
    () => {
      const getRootEl = () => document.getElementById(`date-picker:${id}`)
      const getInstance = () => DatePicker.getInstance(getRootEl())
      const getInputEl = () => query<HTMLInputElement>(getRootEl()!, '[data-part="input"]')!
      const getTriggerEl = () => query<HTMLButtonElement>(getRootEl()!, '[data-part="trigger"]')!
      const getCalendarEl = () => query<HTMLElement>(getRootEl()!, '[data-part="content"]')!
      const getStatusEl = () => query<HTMLElement>(getRootEl()!, '[data-part="status"]')!
      const getMonthSelectionEl = () => query<HTMLElement>(getCalendarEl()!, '[data-part="view"][data-view="month"]')!
      const getYearSelectionEl = () => query<HTMLElement>(getCalendarEl()!, '[data-part="view"][data-view="year"]')!
      const getMonthViewEl = getMonthSelectionEl
      const getYearViewEl = getYearSelectionEl
      const getDateButtonEls = () => queryAll<HTMLElement>(getCalendarEl()!, '[data-part="view"][data-view="day"] [data-part="table-cell-trigger"]')
      const getMonthButtonEls = () => queryAll<HTMLElement>(getMonthSelectionEl()!, '[data-part="table-cell-trigger"]')
      const getYearButtonEls = () => queryAll<HTMLElement>(getYearSelectionEl()!, '[data-part="table-cell-trigger"]')

      return {
        getRootEl,
        getInstance,
        getInputEl,
        getTriggerEl,
        getCalendarEl,
        getStatusEl,
        getMonthSelectionEl,
        getYearSelectionEl,
        getMonthViewEl,
        getYearViewEl,
        getDateButtonEls,
        getMonthButtonEls,
        getYearButtonEls,
      }
    },
  )
}
