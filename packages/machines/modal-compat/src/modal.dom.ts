import type { Scope } from '@zag-js/core'
import { getByOwnerId, queryAll } from '@zag-js/dom-query'

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

export const getTriggerEls = (ctx: Scope) => queryAll(ctx.getRootNode(), `[data-scope="modal"][data-part="trigger"]${getByOwnerId(ctx.id)}`)
// The trigger that opened the modal, else the first trigger, for returning focus on close.
export function getActiveTriggerEl(ctx: Scope, index: number | null): HTMLElement | null {
  if (index == null)
    return getTriggerEl(ctx) ?? getTriggerEls(ctx)[0] ?? null
  return ctx.getById(getTriggerId(ctx, index))
}
