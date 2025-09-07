import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `fileInput:${ctx.id}`
export const getDropzoneId = (ctx: Scope) => ctx.ids?.dropzone ?? `fileInput:${ctx.id}:dropzone`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `fileInput:${ctx.id}:input`
export const getErrorMessageId = (ctx: Scope) => ctx.ids?.errorMessage ?? `fileInput:${ctx.id}:error-message`
export const getInstructionsId = (ctx: Scope) => ctx.ids?.instructions ?? `fileInput:${ctx.id}:instructions`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `fileInput:${ctx.id}:sr-status`
export const getPreviewHeaderId = (ctx: Scope) => ctx.ids?.previewHeader ?? `fileInput:${ctx.id}:preview-header`
export const getPreviewListId = (ctx: Scope) => ctx.ids?.previewList ?? `fileInput:${ctx.id}:preview-list`
export const getPreviewItemId = (ctx: Scope, value: string) => `fileInput:${ctx.id}:preview-item:${value}`
export const getPreviewItemIconId = (ctx: Scope, value: string) => `fileInput:${ctx.id}:preview-item-icon:${value}`
export const getPreviewItemContentId = (ctx: Scope, value: string) => `fileInput:${ctx.id}:preview-item-content:${value}`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getDropzoneEl = (ctx: Scope) => ctx.getById(getDropzoneId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getErrorMessageEl = (ctx: Scope) => ctx.getById(getErrorMessageId(ctx))
export const getInstructionsEl = (ctx: Scope) => ctx.getById(getInstructionsId(ctx))
export const getSrStatusEl = (ctx: Scope) => ctx.getById(getSrStatusId(ctx))
export const getPreviewHeaderEl = (ctx: Scope) => ctx.getById(getPreviewHeaderId(ctx))
export const getPreviewListEl = (ctx: Scope) => ctx.getById(getPreviewListId(ctx))
export const getPreviewItemEl = (ctx: Scope, value: string) => ctx.getById(getPreviewItemId(ctx, value))
export const getPreviewItemIconEl = (ctx: Scope, value: string) => ctx.getById(getPreviewItemIconId(ctx, value))
export const getPreviewItemContentEl = (ctx: Scope, value: string) => ctx.getById(getPreviewItemContentId(ctx, value))
