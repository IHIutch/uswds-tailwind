import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `combobox:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `combobox:${ctx.id}:label`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `combobox:${ctx.id}:input`
export const getListId = (ctx: Scope) => ctx.ids?.list ?? `combobox:${ctx.id}:list`
export const getSelectId = (ctx: Scope) => ctx.ids?.select ?? `combobox:${ctx.id}:select`
export const getItemId = (ctx: Scope, value: string) => `combobox:${ctx.id}:item:${value}`
export const getClearButtonId = (ctx: Scope) => ctx.ids?.clearButton ?? `combobox:${ctx.id}:clear-button`
export const getToggleButtonId = (ctx: Scope) => ctx.ids?.toggleButton ?? `combobox:${ctx.id}:toggle-button`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getLabelEl = (ctx: Scope) => ctx.getById(getLabelId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getSelectEl = (ctx: Scope) => ctx.getById<HTMLSelectElement>(getSelectId(ctx))
export const getListEl = (ctx: Scope) => ctx.getById(getListId(ctx))
export const getItemEl = (ctx: Scope, value: string) => ctx.getById(getItemId(ctx, value))
export const getClearButtonEl = (ctx: Scope) => ctx.getById<HTMLButtonElement>(getClearButtonId(ctx))
export const getToggleButtonEl = (ctx: Scope) => ctx.getById<HTMLButtonElement>(getToggleButtonId(ctx))
