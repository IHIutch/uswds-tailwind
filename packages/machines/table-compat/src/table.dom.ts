import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `table:${ctx.id}`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `table:${ctx.id}:sr-status`
export const getHeaderId = (ctx: Scope, headerId: string | number) => ctx.ids?.header?.(headerId) ?? `table:${ctx.id}:header:${headerId}`
export const getSortButtonId = (ctx: Scope, headerId: string | number) => ctx.ids?.sortButton?.(headerId) ?? `table:${ctx.id}:sort-button:${headerId}`

export const getRootEl = (ctx: Scope) => ctx.getById<HTMLElement>(getRootId(ctx))
