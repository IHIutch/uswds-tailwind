import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `combobox:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `combobox:${ctx.id}:label`
export const getHiddenSelectId = (ctx: Scope) => ctx.ids?.hiddenSelect ?? `combobox:${ctx.id}:hidden-select`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `combobox:${ctx.id}:input`
export const getListId = (ctx: Scope) => ctx.ids?.list ?? `combobox:${ctx.id}:list`
export const getStatusId = (ctx: Scope) => ctx.ids?.status ?? `combobox:${ctx.id}:status`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `combobox:${ctx.id}:trigger`
export const getClearTriggerId = (ctx: Scope) => ctx.ids?.clearTrigger ?? `combobox:${ctx.id}:clear`

export const getItemBaseId = (ctx: Scope) => `combobox:${ctx.id}:item:`

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))
export const getHiddenSelectEl = (ctx: Scope) => ctx.getById<HTMLSelectElement>(getHiddenSelectId(ctx))
export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))
export const getListEl = (ctx: Scope) => ctx.getById(getListId(ctx))
export const getItemEl = (ctx: Scope, id: string | null) => (id ? ctx.getById<HTMLElement>(id) : null)

/**
 * Focus an already rendered option during the native keydown turn.  The
 * headless machine may not have committed a newly opened list yet, so callers
 * must treat false as a request for its cancellable deferred path instead.
 * Once an eligible item receives the focus attempt, the request is handled:
 * consumer focus listeners may intentionally redirect the resulting focus.
 */
export function focusVisibleItem(scope: Scope, id: string | null): boolean {
  const listEl = getListEl(scope)
  const itemEl = getItemEl(scope, id)
  if (!listEl || listEl.hidden || !itemEl || !itemEl.isConnected)
    return false
  itemEl.focus({ preventScroll: true })
  return true
}

export function changeElementValue(el: HTMLInputElement | HTMLSelectElement, value = '') {
  // USWDS assigns on every bridge, including reselects and case-only resets,
  // before dispatching its change CustomEvent (index.js:46–56).
  el.value = value
  el.dispatchEvent(new CustomEvent('change', { bubbles: true, cancelable: true, detail: { value } }))
}

// Native writes follow accepted machine state. USWDS emits select changes
// before input changes, including on reselect and initial default bridging.
export function syncNativeSelect(scope: Scope, value: string) {
  const selectEl = getHiddenSelectEl(scope)
  if (selectEl)
    changeElementValue(selectEl, value)
}

export function syncNativeInput(scope: Scope, value: string) {
  const inputEl = getInputEl(scope)
  if (inputEl)
    changeElementValue(inputEl, value)
}

export function syncNativeSelection(scope: Scope, value: string, label: string) {
  syncNativeSelect(scope, value)
  syncNativeInput(scope, label)
}

export function scrollItemIntoView(scope: Scope, id: string): boolean {
  const listEl = getListEl(scope)
  const optionEl = getItemEl(scope, id)
  if (!listEl || !optionEl)
    return false
  const optionBottom = optionEl.offsetTop + optionEl.offsetHeight
  const currentBottom = listEl.scrollTop + listEl.offsetHeight
  if (optionBottom > currentBottom)
    listEl.scrollTop = optionBottom - listEl.offsetHeight
  if (optionEl.offsetTop < listEl.scrollTop)
    listEl.scrollTop = optionEl.offsetTop
  return true
}

export function observePartMutations(scope: Scope, onMutation: () => boolean): () => void {
  const observer = new (scope.getWin().MutationObserver)(() => {
    if (onMutation())
      observer.disconnect()
  })
  observer.observe(scope.getRootNode(), { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] })
  return () => observer.disconnect()
}
