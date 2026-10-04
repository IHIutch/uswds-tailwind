import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `combobox:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `combobox:${ctx.id}:label`
export const getHiddenSelectId = (ctx: Scope) => ctx.ids?.hiddenSelect ?? `combobox:${ctx.id}:hidden-select`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `combobox:${ctx.id}:input`
export const getListId = (ctx: Scope) => ctx.ids?.list ?? `combobox:${ctx.id}:list`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `combobox:${ctx.id}:status`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `combobox:${ctx.id}:trigger`
export const getClearTriggerId = (ctx: Scope) => ctx.ids?.clearTrigger ?? `combobox:${ctx.id}:clear`

export const getItemId = (ctx: Scope, index: number) => `combobox:${ctx.id}:item:${index}`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getHiddenSelectEl = (ctx: Scope) => ctx.getById<HTMLSelectElement>(getHiddenSelectId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getListEl = (ctx: Scope) => ctx.getById(getListId(ctx))
export const getItemEl = (ctx: Scope, index: number) => ctx.getById<HTMLElement>(getItemId(ctx, index))
