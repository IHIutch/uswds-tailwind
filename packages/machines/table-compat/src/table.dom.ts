import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `table:${ctx.id}`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `table:${ctx.id}:sr-status`
export const getHeaderId = (ctx: Scope, headerId: string | number) => ctx.ids?.header?.(headerId) ?? `table:${ctx.id}:header:${headerId}`
export const getSortTriggerId = (ctx: Scope, headerId: string | number) => ctx.ids?.sortTrigger?.(headerId) ?? `table:${ctx.id}:sort-trigger:${headerId}`

export const getRootEl = (ctx: Scope) => ctx.getById<HTMLElement>(getRootId(ctx))
