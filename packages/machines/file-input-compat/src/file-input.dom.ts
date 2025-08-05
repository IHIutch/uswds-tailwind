import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `fileInput:${ctx.id}`
export const getDropzoneId = (ctx: Scope) => ctx.ids?.dropzone ?? `fileInput:${ctx.id}:dropzone`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `fileInput:${ctx.id}:input`
export const getErrorMessageId = (ctx: Scope) => ctx.ids?.errorMessage ?? `fileInput:${ctx.id}:error-message`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getDropzoneEl = (ctx: Scope) => ctx.getById(getDropzoneId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getErrorMessageEl = (ctx: Scope) => ctx.getById(getErrorMessageId(ctx))
