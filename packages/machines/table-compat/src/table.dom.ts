import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `table:${ctx.id}`
export const getTheadId = (ctx: Scope) => ctx.ids?.thead ?? `table:${ctx.id}:thead`
export const getTbodyId = (ctx: Scope) => ctx.ids?.tbody ?? `table:${ctx.id}:tbody`
export const getTfootId = (ctx: Scope) => ctx.ids?.tfoot ?? `table:${ctx.id}:tfoot`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `table:${ctx.id}:sr-status`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getTheadEl = (ctx: Scope) => ctx.getById<HTMLTableSectionElement>(getTheadId(ctx))
export const getTbodyEl = (ctx: Scope) => ctx.getById<HTMLTableSectionElement>(getTbodyId(ctx))
export const getTfootEl = (ctx: Scope) => ctx.getById<HTMLTableSectionElement>(getTfootId(ctx))
export const getSrStatusEl = (ctx: Scope) => ctx.getById<HTMLElement>(getSrStatusId(ctx))
