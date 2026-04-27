import type { Scope } from '@zag-js/core'
import { hash } from '@zag-js/utils'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `file-input:${ctx.id}`
export const getDropzoneId = (ctx: Scope) => ctx.ids?.dropzone ?? `file-input:${ctx.id}:dropzone`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `file-input:${ctx.id}:input`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `file-input:${ctx.id}:label`

export const getItemId = (ctx: Scope, id: string) => ctx.ids?.item?.(id) ?? `file-input:${ctx.id}:item:${id}`

export const getFileId = (file: File) => hash(`${file.name}-${file.size}`)

export const getRootEl = (ctx: Scope) => ctx.getById<HTMLElement>(getRootId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getDropzoneEl = (ctx: Scope) => ctx.getById<HTMLElement>(getDropzoneId(ctx))
