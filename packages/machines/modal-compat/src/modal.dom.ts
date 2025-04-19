import type { Scope } from '@zag-js/core'

export const getPositionerId = (ctx: Scope) => ctx.ids?.positioner ?? `dialog:${ctx.id}:positioner`
export const getBackdropId = (ctx: Scope) => ctx.ids?.backdrop ?? `dialog:${ctx.id}:backdrop`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `dialog:${ctx.id}:content`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `dialog:${ctx.id}:trigger`
export const getCloseTriggerId = (ctx: Scope) => ctx.ids?.closeTrigger ?? `dialog:${ctx.id}:close`

export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))
export const getPositionerEl = (ctx: Scope) => ctx.getById(getPositionerId(ctx))
export const getBackdropEl = (ctx: Scope) => ctx.getById(getBackdropId(ctx))
export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getCloseTriggerEl = (ctx: Scope) => ctx.getById(getCloseTriggerId(ctx))

export function getNonModals(ctx: Scope) {
  return Array.from(ctx.getDoc().body.children).filter(
    el => !el.classList.contains('dialog-wrapper') && !el.hasAttribute('aria-hidden'),
  )
}

export function getHiddenNonModals(ctx: Scope) {
  return Array.from(ctx.getDoc().querySelectorAll('[aria-hidden=\'true\']'))
}
