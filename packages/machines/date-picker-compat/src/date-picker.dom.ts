import type { Scope } from '@zag-js/core'

// --- ID helpers ---

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `datepicker:${ctx.id}`

function pickIndexedId(provided: string | string[] | undefined, fallback: string, index: number) {
  if (Array.isArray(provided))
    return provided[index] ?? `${fallback}:${index}`
  if (typeof provided === 'string')
    return index === 0 ? provided : `${provided}:${index}`
  return index === 0 ? fallback : `${fallback}:${index}`
}

export const getInputId = (ctx: Scope, index: number = 0) => pickIndexedId(ctx.ids?.input, `datepicker:${ctx.id}:input`, index)
export const getTriggerId = (ctx: Scope, index: number = 0) => pickIndexedId(ctx.ids?.trigger, `datepicker:${ctx.id}:trigger`, index)
export const getCalendarId = (ctx: Scope) => ctx.ids?.calendar ?? `datepicker:${ctx.id}:calendar`
export const getDayPickerId = (ctx: Scope) => ctx.ids?.dayPicker ?? `datepicker:${ctx.id}:day-picker`
export const getMonthPickerId = (ctx: Scope) => ctx.ids?.monthPicker ?? `datepicker:${ctx.id}:month-picker`
export const getYearPickerId = (ctx: Scope) => ctx.ids?.yearPicker ?? `datepicker:${ctx.id}:year-picker`
export const getGridId = (ctx: Scope) => ctx.ids?.grid ?? `datepicker:${ctx.id}:grid`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `datepicker:${ctx.id}:status`
export function getCellTriggerId(ctx: Scope, dateString: string) {
  return ctx.ids?.cellTrigger?.(dateString) ?? `datepicker:${ctx.id}:cell:${dateString}`
}
export const getPrevYearTriggerId = (ctx: Scope) => ctx.ids?.prevYearTrigger ?? `datepicker:${ctx.id}:prev-year`
export const getPrevMonthTriggerId = (ctx: Scope) => ctx.ids?.prevMonthTrigger ?? `datepicker:${ctx.id}:prev-month`
export const getMonthSelectionId = (ctx: Scope) => ctx.ids?.monthSelection ?? `datepicker:${ctx.id}:month-selection`
export const getYearSelectionId = (ctx: Scope) => ctx.ids?.yearSelection ?? `datepicker:${ctx.id}:year-selection`
export const getNextMonthTriggerId = (ctx: Scope) => ctx.ids?.nextMonthTrigger ?? `datepicker:${ctx.id}:next-month`
export const getNextYearTriggerId = (ctx: Scope) => ctx.ids?.nextYearTrigger ?? `datepicker:${ctx.id}:next-year`
export const getPrevYearChunkTriggerId = (ctx: Scope) => ctx.ids?.prevYearChunkTrigger ?? `datepicker:${ctx.id}:prev-year-chunk`
export const getNextYearChunkTriggerId = (ctx: Scope) => ctx.ids?.nextYearChunkTrigger ?? `datepicker:${ctx.id}:next-year-chunk`

// --- Element getters ---

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getInputEl = (ctx: Scope, index: number = 0) => ctx.getById<HTMLInputElement>(getInputId(ctx, index))
export const getTriggerEl = (ctx: Scope, index: number = 0) => ctx.getById(getTriggerId(ctx, index))
export const getCalendarEl = (ctx: Scope) => ctx.getById(getCalendarId(ctx))
export const getDayPickerEl = (ctx: Scope) => ctx.getById(getDayPickerId(ctx))
export const getMonthPickerEl = (ctx: Scope) => ctx.getById(getMonthPickerId(ctx))
export const getYearPickerEl = (ctx: Scope) => ctx.getById(getYearPickerId(ctx))
export const getGridEl = (ctx: Scope) => ctx.getById(getGridId(ctx))
export const getStatusEl = (ctx: Scope) => ctx.getById(getStatusId(ctx))
export const getPrevYearTriggerEl = (ctx: Scope) => ctx.getById(getPrevYearTriggerId(ctx))
export const getPrevMonthTriggerEl = (ctx: Scope) => ctx.getById(getPrevMonthTriggerId(ctx))
export const getMonthSelectionEl = (ctx: Scope) => ctx.getById(getMonthSelectionId(ctx))
export const getYearSelectionEl = (ctx: Scope) => ctx.getById(getYearSelectionId(ctx))
export const getNextMonthTriggerEl = (ctx: Scope) => ctx.getById(getNextMonthTriggerId(ctx))
export const getNextYearTriggerEl = (ctx: Scope) => ctx.getById(getNextYearTriggerId(ctx))
export const getPrevYearChunkTriggerEl = (ctx: Scope) => ctx.getById(getPrevYearChunkTriggerId(ctx))
export const getNextYearChunkTriggerEl = (ctx: Scope) => ctx.getById(getNextYearChunkTriggerId(ctx))
export const getCellTriggerEl = (ctx: Scope, dateString: string) => ctx.getById(getCellTriggerId(ctx, dateString))

// --- Focus helpers ---

export function focusInputEl(ctx: Scope, index: number = 0) {
  const inputEl = getInputEl(ctx, index)
  if (ctx.isActiveElement(inputEl))
    return
  inputEl?.focus({ preventScroll: true })
}

export function focusCellTriggerEl(ctx: Scope, dateString: string) {
  const cellEl = getCellTriggerEl(ctx, dateString)
  cellEl?.focus({ preventScroll: true })
}

export function focusPrevYearTriggerEl(ctx: Scope) {
  const el = getPrevYearTriggerEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusPrevMonthTriggerEl(ctx: Scope) {
  const el = getPrevMonthTriggerEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusNextMonthTriggerEl(ctx: Scope) {
  const el = getNextMonthTriggerEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusNextYearTriggerEl(ctx: Scope) {
  const el = getNextYearTriggerEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusPrevYearChunkTriggerEl(ctx: Scope) {
  const el = getPrevYearChunkTriggerEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusNextYearChunkTriggerEl(ctx: Scope) {
  const el = getNextYearChunkTriggerEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusMonthSelectionEl(ctx: Scope) {
  const el = getMonthSelectionEl(ctx)
  el?.focus({ preventScroll: true })
}

export function focusYearSelectionEl(ctx: Scope) {
  const el = getYearSelectionEl(ctx)
  el?.focus({ preventScroll: true })
}
