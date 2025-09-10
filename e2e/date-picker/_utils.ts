import { datePickerInit } from '../../packages/compat/src/date-picker'
import { createDisposableComponent } from '../_utils'

export function createDisposableDatePicker(id: string, template: string) {
  return createDisposableComponent(
    template,
    datePickerInit,
    () => {
      const getRootEl = () => document.getElementById(`date-picker:${id}`)
      const getInputEl = () => document.getElementById(`date-picker:${id}:input`) as HTMLInputElement
      const getTriggerEl = () => document.getElementById(`date-picker:${id}:trigger`) as HTMLButtonElement
      const getCalendarEl = () => document.getElementById(`date-picker:${id}:calendar`)
      const getStatusEl = () => document.getElementById(`date-picker:${id}:status`)
      const getMonthSelectionEl = () => document.getElementById(`date-picker:${id}:month-selection`)
      const getYearSelectionEl = () => document.getElementById(`date-picker:${id}:year-selection`)

      const getMonthPickerEl = () => document.getElementById(`date-picker:${id}:month-picker`)
      const getYearPickerEl = () => document.getElementById(`date-picker:${id}:year-picker`)

      const getDateButtonEls = () => {
        const calendar = getCalendarEl()
        return Array.from(calendar?.querySelectorAll('[data-part="date-button"]') || [])
      }

      const getMonthButtonEls = () => {
        const monthSelection = getMonthSelectionEl()
        return Array.from(monthSelection?.querySelectorAll('[data-part="month-button"]') || [])
      }

      const getYearButtonEls = () => {
        const yearSelection = getYearSelectionEl()
        return Array.from(yearSelection?.querySelectorAll('[data-part="year-button"]') || [])
      }

      return {
        getRootEl,
        getInputEl,
        getTriggerEl,
        getCalendarEl,
        getStatusEl,
        getMonthSelectionEl,
        getYearSelectionEl,
        getMonthPickerEl,
        getYearPickerEl,
        getDateButtonEls,
        getMonthButtonEls,
        getYearButtonEls,
      }
    },
  )
}
