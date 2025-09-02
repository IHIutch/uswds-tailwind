import type { Scope } from '@zag-js/core'

export const getPositionerId = (ctx: Scope) => `modal:${ctx.id}:positioner`
export const getBackdropId = (ctx: Scope) => `modal:${ctx.id}:backdrop`
export const getContentId = (ctx: Scope) => `modal:${ctx.id}:content`
export const getTriggerId = (ctx: Scope) => `modal:${ctx.id}:trigger`
export const getCloseTriggerId = (ctx: Scope) => `modal:${ctx.id}:close`

export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))
export const getPositionerEl = (ctx: Scope) => ctx.getById(getPositionerId(ctx))
export const getBackdropEl = (ctx: Scope) => ctx.getById(getBackdropId(ctx))
export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getCloseTriggerEl = (ctx: Scope) => ctx.getById(getCloseTriggerId(ctx))
