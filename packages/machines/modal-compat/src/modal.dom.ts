import type { Scope } from '@zag-js/core'

/* -----------------------------------------------------------------------------
 * Ids and element getters
 * ----------------------------------------------------------------------------- */

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `modal:${ctx.id}:root`
export const getTriggerId = (ctx: Scope, index?: number) => ctx.ids?.trigger ?? `modal:${ctx.id}:trigger:${index ?? 0}`
export const getBackdropId = (ctx: Scope) => ctx.ids?.backdrop ?? `modal:${ctx.id}:backdrop`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `modal:${ctx.id}:content`
export const getPositionerId = (ctx: Scope) => ctx.ids?.positioner ?? `modal:${ctx.id}:positioner`
export const getCloseTriggerId = (ctx: Scope, index?: number) => ctx.ids?.closeTrigger ?? `modal:${ctx.id}:close:${index ?? 0}`
export const getTitleId = (ctx: Scope) => ctx.ids?.title ?? `modal:${ctx.id}:title`
export const getDescriptionId = (ctx: Scope) => ctx.ids?.description ?? `modal:${ctx.id}:description`

export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getBackdropEl = (ctx: Scope) => ctx.getById(getBackdropId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))
export const getPositionerEl = (ctx: Scope) => ctx.getById(getPositionerId(ctx))
export const getTitleEl = (ctx: Scope) => ctx.getById(getTitleId(ctx))
export const getDescriptionEl = (ctx: Scope) => ctx.getById(getDescriptionId(ctx))

// Where focus returns on close: the trigger that opened the modal, else whatever was focused before it opened (the
// element that invoked it, per the APG). A WebKit click does not focus the trigger, so the trigger is looked up by index.
export function getReturnFocusEl(ctx: Scope, index: number | null, previousEl: HTMLElement | SVGElement) {
  if (index == null)
    return previousEl
  return ctx.getById(getTriggerId(ctx, index)) ?? previousEl
}
