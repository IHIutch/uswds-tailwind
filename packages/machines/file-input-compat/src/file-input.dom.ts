import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `file-input:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `file-input:${ctx.id}:label`
export const getDropzoneId = (ctx: Scope) => ctx.ids?.dropzone ?? `file-input:${ctx.id}:dropzone`
export const getBoxId = (ctx: Scope) => ctx.ids?.box ?? `file-input:${ctx.id}:box`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `file-input:${ctx.id}:input`
export const getInstructionsId = (ctx: Scope) => ctx.ids?.instructions ?? `file-input:${ctx.id}:instructions`
export const getItemGroupId = (ctx: Scope) => ctx.ids?.itemGroup ?? `file-input:${ctx.id}:item-group`
export const getPreviewHeadingId = (ctx: Scope) => ctx.ids?.previewHeading ?? `file-input:${ctx.id}:preview-heading`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `file-input:${ctx.id}:sr-status`
export const getErrorTextId = (ctx: Scope) => ctx.ids?.errorText ?? `file-input:${ctx.id}:error`
