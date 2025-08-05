import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `characterCount:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `characterCount:${ctx.id}:label`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `characterCount:${ctx.id}:input`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `characterCount:${ctx.id}:status`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `characterCount:${ctx.id}:sr-status`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getLabelEl = (ctx: Scope) => ctx.getById(getLabelId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement | HTMLTextAreaElement>(getInputId(ctx))
export const getStatusEl = (ctx: Scope) => ctx.getById(getStatusId(ctx))
export const getSrStatusEl = (ctx: Scope) => ctx.getById(getSrStatusId(ctx))
