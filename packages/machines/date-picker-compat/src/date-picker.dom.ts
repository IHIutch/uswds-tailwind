import type { Scope } from '@zag-js/core'
import type { DateValue, DateView, ElementIds, NavigationUnit } from './date-picker.types'
import { query, queryAll } from '@zag-js/dom-query'
import { validateDateInput } from './date-picker.utils'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `date-picker:${ctx.id}`
export const getControlId = (ctx: Scope) => ctx.ids?.control ?? `date-picker:${ctx.id}:control`
function getIndexedId(id: ElementIds['input'], index: number, fallback: string) {
  if (typeof id === 'function')
    return id(index)
  if (typeof id === 'string')
    return index === 0 ? id : `${id}:${index}`
  return fallback
}
export const getInputId = (ctx: Scope, index: number) => getIndexedId(ctx.ids?.input, index, `date-picker:${ctx.id}:input:${index}`)
export function getTriggerId(ctx: Scope, index = 0) {
  const fallback = index === 0 ? `date-picker:${ctx.id}:trigger` : `date-picker:${ctx.id}:trigger:${index}`
  return getIndexedId(ctx.ids?.trigger, index, fallback)
}
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `date-picker:${ctx.id}:content`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `date-picker:${ctx.id}:status`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))

export const getExternalInputEl = (ctx: Scope, index = 0) => ctx.getById<HTMLInputElement>(getInputId(ctx, index))

// The ISO mirror has no id or name; range endpoints are located by DOM order.
export function getHiddenInputEl(ctx: Scope, index = 0) {
  return queryAll<HTMLInputElement>(getRootEl(ctx), `[data-part=hidden-input]`)[index] ?? null
}

// Create change events in the input's own window for iframe compatibility.
export function changeElementValue(el: HTMLInputElement, value = ''): void {
  el.value = value
  const EventCtor = el.ownerDocument.defaultView?.CustomEvent ?? CustomEvent
  el.dispatchEvent(new EventCtor('change', {
    bubbles: true,
    cancelable: true,
    detail: { value },
  }))
}

/** Preserve validation messages owned by other validators. */
export function applyDateInputValidity(element: HTMLInputElement, text: string, min: DateValue, max: DateValue | undefined): void {
  const validity = validateDateInput(text, min, max, element.validationMessage)
  if (validity !== null)
    element.setCustomValidity(validity)
}

export function getFocusedCell(ctx: Scope, view: DateView) {
  return queryAll<HTMLElement>(getContentEl(ctx), `[data-part=table-cell-trigger][data-view=${view}][data-focus]`).find(el => !el.closest('[hidden]')) ?? null
}

export function getNavTriggerEl(ctx: Scope, direction: 'prev' | 'next', view: 'day' | 'year', unit: NavigationUnit = 'month') {
  return query<HTMLButtonElement>(getContentEl(ctx), `[data-part=${direction}-trigger][data-view=${view}]${view === 'day' ? `[data-unit=${unit}]` : ''}`)
}
export const getViewControlEl = (ctx: Scope) => query<HTMLElement>(getContentEl(ctx), `[data-part=view-control]`)

export const getYearViewEl = (ctx: Scope) => query<HTMLElement>(getContentEl(ctx), `[data-part=view][data-view=year]`)

export function forEachInitialInput(ctx: Scope, count: number, initialize: (element: HTMLInputElement, index: number, internal: boolean) => void): void {
  for (let index = 0; index < count; index++) {
    for (const [element, internal] of [[getHiddenInputEl(ctx, index), true], [getExternalInputEl(ctx, index), false]] as const) {
      if (element)
        initialize(element, index, internal)
    }
  }
}
