import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `table:${ctx.id}`
export function getHeaderId(ctx: Scope, index: number) {
  return ctx.ids?.header?.(index) ?? `table:${ctx.id}:header:${index}`
}
export function getSortButtonId(ctx: Scope, index: number) {
  return ctx.ids?.sortButton?.(index) ?? `table:${ctx.id}:sort-button:${index}`
}
export function getSrStatusId(ctx: Scope) {
  return ctx.ids?.srStatus ?? `table:${ctx.id}:sr-status`
}

export const getRootEl = (ctx: Scope) => ctx.getById<HTMLTableElement>(getRootId(ctx))
export function getHeaderEl(ctx: Scope, index: number) {
  return ctx.getById<HTMLTableCellElement>(getHeaderId(ctx, index))
}
export function getSortButtonEl(ctx: Scope, index: number) {
  return ctx.getById<HTMLButtonElement>(getSortButtonId(ctx, index))
}
export function getSrStatusEl(ctx: Scope) {
  return ctx.getById(getSrStatusId(ctx))
}
