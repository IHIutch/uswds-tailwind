import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker'
import { createDisposableComponent } from '../_utils'

export function createDisposableDateRangePicker(id: string, template: string) {
  return createDisposableComponent(
    template,
    dateRangePickerInit,
    () => {
      const getRootEl = () => document.getElementById(`date-picker:${id}`)
      const getStartInputEl = () => document.querySelector<HTMLInputElement>('[data-part="input"][data-index="0"]')
      const getEndInputEl = () => document.querySelector<HTMLInputElement>('[data-part="input"][data-index="1"]')
      const getStartTriggerEl = () => document.querySelector<HTMLButtonElement>('[data-part="trigger"][data-index="0"]')
      const getEndTriggerEl = () => document.querySelector<HTMLButtonElement>('[data-part="trigger"][data-index="1"]')
      const getCalendarEl = () => document.querySelector<HTMLElement>('[data-part="content"]')
      const getStatusEl = () => document.getElementById(`date-picker:${id}:status`)
      const getStartStatusEl = () => document.getElementById(`date-picker:${id}:start-status`)
      const getEndStatusEl = () => document.getElementById(`date-picker:${id}:end-status`)

      const getDateButtonEls = () => {
        const calendar = getCalendarEl()
        return Array.from(calendar?.querySelectorAll('[data-part="cell-trigger"][data-view="day"]') || [])
      }

      return {
        getRootEl,
        getStartInputEl,
        getEndInputEl,
        getStartTriggerEl,
        getEndTriggerEl,
        getCalendarEl,
        getStatusEl,
        getStartStatusEl,
        getEndStatusEl,
        getDateButtonEls,
      }
    },
  )
}
