import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `accordion:${ctx.id}`
export const getTriggerId = (ctx: Scope, value: string) => `accordion:${ctx.id}:trigger:${value}`
export const getContentId = (ctx: Scope, value: string) => `accordion:${ctx.id}:content:${value}`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getTriggerEl = (ctx: Scope, value: string) => ctx.getById(getTriggerId(ctx, value))
export const getContentEl = (ctx: Scope, value: string) => ctx.getById(getContentId(ctx, value))
export const getAllTriggerEls = (ctx: Scope) => Array.from(getRootEl(ctx)?.querySelectorAll<HTMLElement>('[data-part="accordion-trigger"]') ?? [])
