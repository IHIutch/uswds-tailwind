import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `collapse:${ctx.id}`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `collapse:${ctx.id}:trigger`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `collapse:${ctx.id}:content`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))
