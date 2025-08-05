import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `inputMask:${ctx.id}`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `inputMask:${ctx.id}:input`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
