import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `tooltip:${ctx.id}`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `tooltip:${ctx.id}:trigger`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `tooltip:${ctx.id}:content`

export const getTriggerEl = (ctx: Scope) => ctx.getById<HTMLElement>(getTriggerId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById<HTMLElement>(getContentId(ctx))
