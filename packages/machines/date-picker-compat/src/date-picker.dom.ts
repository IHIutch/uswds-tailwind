import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `date-picker:${ctx.id}`
export const getInputId = (ctx: Scope) => `date-picker:${ctx.id}:input`
export const getTriggerId = (ctx: Scope) => `date-picker:${ctx.id}:trigger`
export const getCalendarId = (ctx: Scope) => `date-picker:${ctx.id}:calendar`
export const getStatusId = (ctx: Scope) => `date-picker:${ctx.id}:status`
export const getMonthSelectionId = (ctx: Scope) => `date-picker:${ctx.id}:month-selection`
export const getYearSelectionId = (ctx: Scope) => `date-picker:${ctx.id}:year-selection`

export const getMonthPickerId = (ctx: Scope) => `date-picker:${ctx.id}:month-picker`
export const getYearPickerId = (ctx: Scope) => `date-picker:${ctx.id}:year-picker`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById(getInputId(ctx))
export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getCalendarEl = (ctx: Scope) => ctx.getById(getCalendarId(ctx))
export const getStatusEl = (ctx: Scope) => ctx.getById(getStatusId(ctx))
export const getMonthSelectionEl = (ctx: Scope) => ctx.getById(getMonthSelectionId(ctx))
export const getYearSelectionEl = (ctx: Scope) => ctx.getById(getYearSelectionId(ctx))

export const getMonthPickerEl = (ctx: Scope) => ctx.getById(getMonthPickerId(ctx))
export const getYearPickerEl = (ctx: Scope) => ctx.getById(getYearPickerId(ctx))

export function getDateButtonEls(ctx: Scope) {
  const calendar = getCalendarEl(ctx)
  return Array.from(calendar?.querySelectorAll('[data-part="date-button"]') || [])
}

export function getMonthButtonEls(ctx: Scope) {
  const monthSelection = getMonthSelectionEl(ctx)
  return Array.from(monthSelection?.querySelectorAll('[data-part="month-button"]') || [])
}

export function getYearButtonEls(ctx: Scope) {
  const yearSelection = getYearSelectionEl(ctx)
  return Array.from(yearSelection?.querySelectorAll('[data-part="year-button"]') || [])
}

export function getFocusedDateButtonEl(ctx: Scope, targetDate: Date) {
  const calendar = getCalendarEl(ctx)
  if (!calendar)
    return null

  const dateString = targetDate.getDate()
  const monthString = targetDate.getMonth()
  return calendar.querySelector(`[data-part="date-picker-date-button"][data-day="${dateString}"][data-month="${monthString}"]`)
}

export function getFocusedMonthButtonEl(ctx: Scope, targetMonth: number) {
  const monthSelection = getMonthPickerEl(ctx)
  if (!monthSelection)
    return null

  return monthSelection.querySelector(`[data-part="date-picker-month-button"][data-value="${targetMonth}"]`)
}

export function getFocusedYearButtonEl(ctx: Scope, targetYear: number) {
  const yearSelection = getYearPickerEl(ctx)
  if (!yearSelection)
    return null

  return yearSelection.querySelector(`[data-part="date-picker-year-button"][data-value="${targetYear}"]`)
}

// Range picker specific DOM helpers
export function getStartInputEl(ctx: Scope) {
  const root = getRootEl(ctx)
  return root?.querySelector('[data-part="date-range-picker-start-input"]')
}

export function getEndInputEl(ctx: Scope) {
  const root = getRootEl(ctx)
  return root?.querySelector('[data-part="date-range-picker-end-input"]')
}
