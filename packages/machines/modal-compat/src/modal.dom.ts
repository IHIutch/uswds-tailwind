import type { Scope } from '@zag-js/core'

// trigger: [data-open-modal][aria-controls] (line 18)
// backdrop (wrapper): .usa-modal-wrapper with role=dialog (lines 267, 229)
// content: .usa-modal (line 8)
// title: element referenced by aria-labelledby (line 218)
// description: element referenced by aria-describedby (line 219)
// closeTrigger: [data-close-modal] (line 12)

export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `modal:${ctx.id}:trigger`
export const getBackdropId = (ctx: Scope) => ctx.ids?.backdrop ?? `modal:${ctx.id}:backdrop`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `modal:${ctx.id}:content`
export const getTitleId = (ctx: Scope) => ctx.ids?.title ?? `modal:${ctx.id}:title`
export const getDescriptionId = (ctx: Scope) => ctx.ids?.description ?? `modal:${ctx.id}:description`
export const getCloseTriggerId = (ctx: Scope) => ctx.ids?.closeTrigger ?? `modal:${ctx.id}:close-trigger`

export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getBackdropEl = (ctx: Scope) => ctx.getById(getBackdropId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById(getContentId(ctx))
export const getCloseEl = (ctx: Scope) => ctx.getById(getCloseTriggerId(ctx))
