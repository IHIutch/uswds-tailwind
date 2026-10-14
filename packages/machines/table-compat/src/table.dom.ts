import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `table:${ctx.id}`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `table:${ctx.id}:sr-status`
export const getHeaderId = (ctx: Scope, columnIndex: number) => ctx.ids?.header?.(columnIndex) ?? `table:${ctx.id}:header:${columnIndex}`
export const getSortTriggerId = (ctx: Scope, columnIndex: number) => ctx.ids?.sortTrigger?.(columnIndex) ?? `table:${ctx.id}:sort-trigger:${columnIndex}`
