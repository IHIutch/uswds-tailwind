import type * as datePicker from '../../packages/machines/date-picker-compat/src'
import { queryAll } from '@zag-js/dom-query'
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
    [data-scope="date-picker"] button[data-part="prev-trigger"][data-view="year"],
    [data-scope="date-picker"] button[data-part="next-trigger"][data-view="year"] {
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
      const getInputEl = (index = 0) => queryAll<HTMLInputElement>(getRootEl()!, '[data-part="input"]')[index]!
      const getTriggerEl = () => document.getElementById(`date-picker:${id}:trigger`) as HTMLButtonElement
      const getCalendarEl = () => document.getElementById(`date-picker:${id}:content`)!
      const getStatusEl = () => document.getElementById(`date-picker:${id}:status`)!
      const getViewEl = (view: 'day' | 'month' | 'year') => document.getElementById(`date-picker:${id}:view:${view}`)!
      const getMonthSelectionEl = () => getViewEl('month')
      const getYearSelectionEl = () => getViewEl('year')
      const getMonthViewEl = getMonthSelectionEl
      const getYearViewEl = getYearSelectionEl
      const getViewControlEl = () => document.getElementById(`date-picker:${id}:view-control`)!
      const getViewTriggerEl = (view: 'month' | 'year') => document.getElementById(`date-picker:${id}:view-trigger:${view}`) as HTMLButtonElement
      const getPrevTriggerEl = (target: 'month' | 'year' | 'year-chunk') => document.getElementById(`date-picker:${id}:prev-trigger:${target}`) as HTMLButtonElement
      const getNextTriggerEl = (target: 'month' | 'year' | 'year-chunk') => document.getElementById(`date-picker:${id}:next-trigger:${target}`) as HTMLButtonElement
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
        getViewEl,
        getMonthSelectionEl,
        getYearSelectionEl,
        getMonthViewEl,
        getYearViewEl,
        getViewControlEl,
        getViewTriggerEl,
        getPrevTriggerEl,
        getNextTriggerEl,
        getDateButtonEls,
        getMonthButtonEls,
        getYearButtonEls,
      }
    },
  )
}
