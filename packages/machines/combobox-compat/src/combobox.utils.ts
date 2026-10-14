import type { Scope } from '@zag-js/core'
import * as dom from './combobox.dom'

export interface ComboboxOptionData {
  value: string
  label: string
}

/**
 * Internal time-picker filter. Not a public API.
 * Returned entries must be references from `options`; Combobox retains their labels.
 * @internal
 */
export type ComboboxCustomFilter = (inputValue: string, options: readonly ComboboxOptionData[]) => readonly ComboboxOptionData[]

// USWDS treats substituted query text as literal text inside the regex template.
export function generateDynamicRegExp(filter: string, query = '', extras: Record<string, string> = {}) {
  const escapeRegExp = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const pattern = filter.replace(/\{\{(.*?)\}\}/g, (_, name: string) => {
    const key = name.trim()
    const queryFilter = extras[key]
    if (key !== 'query' && queryFilter) {
      const matches = query.match(new RegExp(queryFilter, 'i'))
      return matches ? escapeRegExp(matches[1]!) : ''
    }
    return escapeRegExp(query)
  })
  return new RegExp(`^(?:${pattern})$`, 'i')
}

export interface BuildItemsParams {
  optionData: ComboboxOptionData[]
  inputValueRaw: string
  customFilter?: ComboboxCustomFilter | undefined
  filter: string
  filterExtras?: Record<string, string> | undefined
  isPristine: boolean
  disableFiltering: boolean
  selectValue: string
}

function getOrderedOptions(params: BuildItemsParams, query: string, regex: RegExp) {
  const { optionData, inputValueRaw, customFilter, isPristine, disableFiltering } = params
  const available = optionData.filter(option => option.value)

  if (disableFiltering || isPristine || !query)
    return available

  if (customFilter) {
    return [...customFilter(inputValueRaw, available)]
  }

  const startsWith: ComboboxOptionData[] = []
  const contains: ComboboxOptionData[] = []
  for (const option of available) {
    if (!regex.test(option.label))
      continue
    if (option.label.toLowerCase().startsWith(query))
      startsWith.push(option)
    else contains.push(option)
  }
  return [...startsWith, ...contains]
}

export function buildItems(params: BuildItemsParams) {
  const { inputValueRaw, filter, filterExtras, isPristine, disableFiltering, selectValue } = params
  const query = inputValueRaw.toLowerCase()
  const regex = generateDynamicRegExp(filter || '.*{{query}}.*', query, filterExtras)
  const items = getOrderedOptions(params, query, regex)

  // `displayList` overwrites the selection for every matching source option,
  // leaving the last rendered duplicate selected (index.js L467-480).
  let selectedIndex: number | null = null
  for (const [index, item] of items.entries()) {
    if (item.value === selectValue)
      selectedIndex = index
  }

  let promotionIndex = isPristine ? selectedIndex : null
  if (promotionIndex === null && disableFiltering) {
    const index = items.findIndex(item => regex.test(item.label))
    if (index >= 0)
      promotionIndex = index
  }

  return {
    items,
    highlightedIndex: promotionIndex ?? selectedIndex ?? (items.length ? 0 : null),
    promotionIndex,
  }
}

/**
 * Focus an already rendered option during the native keydown turn.  The
 * headless machine may not have committed a newly opened list yet, so callers
 * must treat false as a request for its cancellable deferred path instead.
 * Once an eligible item receives the focus attempt, the request is handled:
 * consumer focus listeners may intentionally redirect the resulting focus.
 */
export function focusVisibleItem(scope: Scope, index: number | null): boolean {
  if (index === null)
    return false
  const listEl = dom.getListEl(scope)
  const itemEl = dom.getItemEl(scope, index)
  if (!listEl || listEl.hidden || !itemEl || !itemEl.isConnected)
    return false
  itemEl.focus({ preventScroll: true })
  return true
}

export function scrollItemIntoView(scope: Scope, index: number): boolean {
  const listEl = dom.getListEl(scope)
  const optionEl = dom.getItemEl(scope, index)
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
