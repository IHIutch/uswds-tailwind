import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `dropdown:${ctx.id}`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `dropdown:${ctx.id}:trigger`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `dropdown:${ctx.id}:content`

export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))
