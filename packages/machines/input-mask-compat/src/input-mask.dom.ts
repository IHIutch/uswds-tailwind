import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `input-mask:${ctx.id}`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `input-mask:${ctx.id}:input`
export const getMaskId = (ctx: Scope) => ctx.ids?.mask ?? `input-mask:${ctx.id}:mask`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getMaskEl = (ctx: Scope) => ctx.getById(getMaskId(ctx))
