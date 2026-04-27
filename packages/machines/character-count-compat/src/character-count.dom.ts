import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `character-count:${ctx.id}`
export const getFormGroupId = (ctx: Scope) => ctx.ids?.formGroup ?? `character-count:${ctx.id}:form-group`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `character-count:${ctx.id}:label`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `character-count:${ctx.id}:input`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `character-count:${ctx.id}:status`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `character-count:${ctx.id}:sr-status`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement | HTMLTextAreaElement>(getInputId(ctx))
