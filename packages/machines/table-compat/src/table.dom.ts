import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `table:${ctx.id}`
export function getHeaderId(ctx: Scope, index: number) {
  return ctx.ids?.header?.(index) ?? `table:${ctx.id}:header:${index}`
}
export function getSortButtonId(ctx: Scope, index: number) {
  return ctx.ids?.sortButton?.(index) ?? `table:${ctx.id}:sort-button:${index}`
}
export function getAnnouncementRegionId(ctx: Scope) {
  return `table:${ctx.id}:announcement-region`
}

export const getRootEl = (ctx: Scope) => ctx.getById<HTMLTableElement>(getRootId(ctx))
export function getHeaderEl(ctx: Scope, index: number) {
  return ctx.getById<HTMLTableCellElement>(getHeaderId(ctx, index))
}
export function getSortButtonEl(ctx: Scope, index: number) {
  return ctx.getById<HTMLButtonElement>(getSortButtonId(ctx, index))
}
export function getAnnouncementRegionEl(ctx: Scope) {
  return ctx.getById(getAnnouncementRegionId(ctx))
}
