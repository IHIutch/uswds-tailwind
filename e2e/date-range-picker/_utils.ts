import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker'
import { createDisposableComponent } from '../_utils'

export function createDisposableDateRangePicker(id: string, template: string) {
  return createDisposableComponent(
    template,
    dateRangePickerInit,
    () => {
      const getRootEl = () => document.getElementById(`date-picker:${id}`)
      const getStartInputEl = () => document.getElementById(`date-picker:${id}:input-start`) as HTMLInputElement
      const getEndInputEl = () => document.getElementById(`date-picker:${id}:input-end`) as HTMLInputElement
      const getStartTriggerEl = () => document.getElementById(`date-picker:${id}:trigger-start`) as HTMLButtonElement
      const getEndTriggerEl = () => document.getElementById(`date-picker:${id}:trigger-end`) as HTMLButtonElement
      const getCalendarEl = () => document.getElementById(`date-picker:${id}:calendar`)
      const getStatusEl = () => document.getElementById(`date-picker:${id}:status`)
      const getStartStatusEl = () => document.getElementById(`date-picker:${id}:start-status`)
      const getEndStatusEl = () => document.getElementById(`date-picker:${id}:end-status`)

      const getDateButtonEls = () => {
        const calendar = getCalendarEl()
        return Array.from(calendar?.querySelectorAll('[data-part="date-button"]') || [])
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
