import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `combobox:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `combobox:${ctx.id}:label`
export const getControlId = (ctx: Scope) => ctx.ids?.control ?? `combobox:${ctx.id}:control`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `combobox:${ctx.id}:input`
export const getListboxId = (ctx: Scope) => ctx.ids?.listbox ?? `combobox:${ctx.id}:listbox`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `combobox:${ctx.id}:trigger`
export const getClearTriggerId = (ctx: Scope) => ctx.ids?.clearTrigger ?? `combobox:${ctx.id}:clear-trigger`
export const getStatusId = (ctx: Scope) => `combobox:${ctx.id}:status`
export function getOptionId(ctx: Scope, value: string, index: number) {
  return ctx.ids?.option?.(value, index) ?? `combobox:${ctx.id}:option:${index}`
}

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getListboxEl = (ctx: Scope) => ctx.getById(getListboxId(ctx))
export const getTriggerEl = (ctx: Scope) => ctx.getById(getTriggerId(ctx))
export const getClearTriggerEl = (ctx: Scope) => ctx.getById(getClearTriggerId(ctx))
export const getStatusEl = (ctx: Scope) => ctx.getById(getStatusId(ctx))

export function focusInputEl(ctx: Scope) {
  const inputEl = getInputEl(ctx)
  if (ctx.isActiveElement(inputEl))
    return
  inputEl?.focus({ preventScroll: true })
}

export function getOptionEl(ctx: Scope, value: string) {
  const listboxEl = getListboxEl(ctx)
  if (!listboxEl)
    return null
  return listboxEl.querySelector<HTMLElement>(
    `[role=option][data-value="${CSS.escape(value)}"]`,
  )
}

export function focusOptionEl(ctx: Scope, value: string, preventScroll = false) {
  const optionEl = getOptionEl(ctx, value)
  optionEl?.focus({ preventScroll })
}
