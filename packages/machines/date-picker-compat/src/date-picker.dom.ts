import type { Scope } from '@zag-js/core'
import type { DateView, NavigationUnit } from './date-picker.types'
import { queryAll } from '@zag-js/dom-query'
import { validateDateInput } from './date-picker.utils'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `date-picker:${ctx.id}`
export const getLabelId = (ctx: Scope, index: number) => ctx.ids?.label?.(index) ?? `date-picker:${ctx.id}:label:${index}`
export const getControlId = (ctx: Scope) => ctx.ids?.control ?? `date-picker:${ctx.id}:control`
export const getInputId = (ctx: Scope, index: number) => ctx.ids?.input?.(index) ?? `date-picker:${ctx.id}:input:${index}`
export function getTriggerId(ctx: Scope, index = 0) {
  return ctx.ids?.trigger?.(index) ?? (index === 0 ? `date-picker:${ctx.id}:trigger` : `date-picker:${ctx.id}:trigger:${index}`)
}
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `date-picker:${ctx.id}:content`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `date-picker:${ctx.id}:status`
export const getViewId = (ctx: Scope, view: DateView) => `date-picker:${ctx.id}:view:${view}`
export const getViewControlId = (ctx: Scope) => `date-picker:${ctx.id}:view-control`
export const getViewTriggerId = (ctx: Scope, view: DateView) => `date-picker:${ctx.id}:view-trigger:${view}`
export function getNavTriggerId(ctx: Scope, direction: 'prev' | 'next', view: 'day' | 'year', unit: NavigationUnit = 'month') {
  return `date-picker:${ctx.id}:${direction}-trigger:${view === 'day' ? unit : 'year-chunk'}`
}

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))

export const getInputEl = (ctx: Scope, index = 0) => ctx.getById<HTMLInputElement>(getInputId(ctx, index))

// Create change events in the input's own window for iframe compatibility.
export function changeElementValue(el: HTMLInputElement, value = '') {
  el.value = value
  const EventCtor = el.ownerDocument.defaultView?.CustomEvent ?? CustomEvent
  el.dispatchEvent(new EventCtor('change', {
    bubbles: true,
    cancelable: true,
    detail: { value },
  }))
}

export function applyDateInputValidity(element: HTMLInputElement, text: string, start: Date, end: Date | undefined) {
  const validity = validateDateInput(text, start, end, element.validationMessage)
  if (validity !== null)
    element.setCustomValidity(validity)
}

export function getFocusedCell(ctx: Scope, view: DateView) {
  return queryAll<HTMLElement>(getContentEl(ctx), `[data-part=table-cell-trigger][data-view=${view}][data-focus]`).find(el => !el.closest('[hidden]')) ?? null
}

export const getNavTriggerEl = (ctx: Scope, direction: 'prev' | 'next', view: 'day' | 'year', unit?: NavigationUnit) => ctx.getById<HTMLButtonElement>(getNavTriggerId(ctx, direction, view, unit))
export const getViewControlEl = (ctx: Scope) => ctx.getById(getViewControlId(ctx))
export const getViewEl = (ctx: Scope, view: DateView) => ctx.getById(getViewId(ctx, view))
