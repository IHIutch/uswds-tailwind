import type { Scope } from '@zag-js/core'
import type { DateValue, DateView, NavigationUnit } from './date-picker.types'
import { query, queryAll } from '@zag-js/dom-query'
import { validateDateInput } from './date-picker.utils'

/* -----------------------------------------------------------------------------
 * Ids
 * ----------------------------------------------------------------------------- */

// Connect OWNS these ids. USWDS derives structure from authored markup + `getDatePickerContext` DOM lookups
// (L670); that id-derivation DISSOLVES under the headless port — the port emits ids on the parts and looks
// elements up by them.
//
// Inputs are INDEXED — range mode is ONE calendar + TWO inputs bound to value[0]/value[1] (the original's two
// coordinated single pickers, consolidated); single mode always uses 0. `getInputId` names the EXTERNAL input,
// which carries the developer's id/name/form identity. The INTERNAL input gets no id helper at all — USWDS strips
// its id+name (`single-index.js:946-947`); it is a non-submitting ISO mirror.
export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `date-picker:${ctx.id}`
export const getControlId = (ctx: Scope) => ctx.ids?.control ?? `date-picker:${ctx.id}:control`
export function getInputId(ctx: Scope, index: number) {
  const ids = ctx.ids?.input
  if (typeof ids === 'function') {
    return ids(index)
  }
  if (typeof ids === 'string') {
    return index === 0 ? ids : `${ids}:${index}`
  }
  return `date-picker:${ctx.id}:input:${index}`
}
// NO `getHiddenInputId` — the INTERNAL input carries NEITHER id nor name (USWDS removes both, `single-index.js:
// 946-947`); it is a non-submitting ISO mirror the machine owns, so nothing queries it by id.
export function getTriggerId(ctx: Scope, index = 0) {
  const ids = ctx.ids?.trigger
  if (typeof ids === 'function')
    return ids(index)
  if (typeof ids === 'string')
    return index === 0 ? ids : `${ids}:${index}`
  return index === 0 ? `date-picker:${ctx.id}:trigger` : `date-picker:${ctx.id}:trigger:${index}`
}
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `date-picker:${ctx.id}:content`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `date-picker:${ctx.id}:status`

/* -----------------------------------------------------------------------------
 * Element getters (back the raf-wrapped physical `.focus()` calls — focus moves stay physical,
 * deferred one frame so the consumer's re-render lands first)
 * ----------------------------------------------------------------------------- */

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))

// The EXTERNAL (visible) input at index 0 — `handleEscapeFromCalendar` restores focus here (`single-index.js:1731`
// — the input, NOT the toggle button), and select restores here too (L1333). Single always uses 0; range's second
// input is index 1.
export const getExternalInputEl = (ctx: Scope, index = 0) => ctx.getById<HTMLInputElement>(getInputId(ctx, index))

// The INTERNAL (hidden) input(s) — id-less by design (USWDS strips it, L946), so queried by part. Range has two
// (start/end), in DOM order. It's the ISO value carrier `setCalendarValue` mirrors (`single-index.js:886`).
export function getHiddenInputEl(ctx: Scope, index = 0) {
  return queryAll<HTMLInputElement>(getRootEl(ctx), `[data-part=hidden-input]`)[index] ?? null
}

// `single-index.js:634` — set `.value` then dispatch a bubbling, cancelable `change` CustomEvent (`detail.value`).
// This is the event the range wiring cross-syncs on; the value-carrier sync is library-functional (the
// inputs ARE the value carriers, not rendered calendar parts), so a machine action owning it is faithful.
//
// The `CustomEvent` constructor comes from the input's own document (`single-index.js:634-644` dispatches from the
// element it writes), so an iframe-hosted input dispatches its own window's event.
export function changeElementValue(el: HTMLInputElement, value = ''): void {
  el.value = value
  const EventCtor = el.ownerDocument.defaultView?.CustomEvent ?? CustomEvent
  el.dispatchEvent(new EventCtor('change', {
    bubbles: true,
    cancelable: true,
    detail: { value },
  }))
}

/** Preserve a foreign validity message unless date validation has a scoped update. */
export function applyDateInputValidity(element: HTMLInputElement, text: string, min: DateValue, max: DateValue | undefined): void {
  const validity = validateDateInput(text, min, max, element.validationMessage)
  if (validity !== null)
    element.setCustomValidity(validity)
}

// The roving-tabindex focused day cell inside the open calendar — `toggleCalendar` focuses it on open
// (`single-index.js:1353`, the `CALENDAR_DATE_FOCUSED` `--focused` cell → headless `[data-focus]`). The selector
// matches the `table-cell-trigger` part all three views' cell getters emit.
export function getFocusedCell(ctx: Scope, view: DateView) {
  return queryAll<HTMLElement>(getContentEl(ctx), `[data-part=table-cell-trigger][data-view=${view}][data-focus]`).find(el => !el.closest('[hidden]')) ?? null
}

// Day-view nav: after a nav re-render, focus the SAME button, or fall back to the `CALENDAR_DATE_PICKER` container
// (`viewControl`, tabindex=-1) when that button is now disabled at a boundary (`single-index.js:1240-1243`).
export function getNavTriggerEl(ctx: Scope, direction: 'prev' | 'next', view: 'day' | 'year', unit: NavigationUnit = 'month') {
  return query<HTMLButtonElement>(getContentEl(ctx), `[data-part=${direction}-trigger][data-view=${view}]${view === 'day' ? `[data-unit=${unit}]` : ''}`)
}
export const getViewControlEl = (ctx: Scope) => query<HTMLElement>(getContentEl(ctx), `[data-part=view-control]`)

// The `CALENDAR_YEAR_PICKER` container (tabindex=-1) — the year-chunk nav focus-fallback (L1667).
export const getYearViewEl = (ctx: Scope) => query<HTMLElement>(getContentEl(ctx), `[data-part=view][data-view=year]`)

// NOTE: no id helpers for the structural calendar parts (table/tableRow/tableCellTrigger, prev/next nav, month/year
// triggers, year-chunk) — nothing looks them up by id (focus targeting queries by `data-part`), so the helpers
// would be dead code.

/** Discover late initial input parts without requiring adapter-specific ref props. */
export function observeInitialInputs(ctx: Scope, count: number, initialize: (element: HTMLInputElement, index: number, internal: boolean) => void): VoidFunction {
  const win = ctx.getWin()
  const seen = new WeakSet<HTMLInputElement>()
  let observer: MutationObserver
  let live = true
  const visit = () => {
    if (!live)
      return
    let complete = true
    for (let index = 0; index < count; index++) {
      for (const [element, internal] of [[getHiddenInputEl(ctx, index), true], [getExternalInputEl(ctx, index), false]] as const) {
        if (!element) {
          complete = false
          continue
        }
        if (!seen.has(element)) {
          seen.add(element)
          initialize(element, index, internal)
        }
      }
    }
    if (complete)
      observer.disconnect()
  }
  observer = new win.MutationObserver(visit)
  observer.observe(ctx.getRootNode(), { childList: true, subtree: true, attributes: true, attributeFilter: ['id', 'data-part'] })
  visit()
  return () => {
    live = false
    observer.disconnect()
  }
}
