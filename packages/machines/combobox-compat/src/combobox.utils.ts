import type { ComboboxItem } from './combobox.types'

export interface ComboboxOptionData {
  value: string

  label: string
}

/**
 * Selects and orders the supplied source options for a specialized consumer.
 * Returned entries must be references from `options`; Combobox retains their labels.
 */
export type ComboboxCustomFilter = (inputValue: string, options: readonly ComboboxOptionData[]) => readonly ComboboxOptionData[]

export function getAdjacentItem(items: readonly ComboboxItem[], id: string, direction: 1 | -1) {
  const currentIndex = items.findIndex(item => item.id === id)
  if (currentIndex < 0)
    return undefined
  return items[currentIndex + direction]
}

export interface BuildItemsParams {

  optionData: ComboboxOptionData[]

  inputValueRaw: string

  customFilter?: ComboboxCustomFilter | undefined

  isPristine: boolean

  disableFiltering: boolean

  selectValue: string

  baseId: string
}

export interface BuildItemsResult {
  items: ComboboxItem[]

  highlightedId: string | null

  /** The one source `displayList` path that calls `highlightOption` while opening. */
  promotionId: string | null
}

export function buildItems(params: BuildItemsParams): BuildItemsResult {
  const { optionData, inputValueRaw, customFilter, isPristine, disableFiltering, selectValue, baseId } = params
  const inputValueLower = inputValueRaw.toLowerCase()

  const optionMatchesQuery = (label: string) => label.toLowerCase().includes(inputValueLower)

  const candidates = optionData.filter(option =>
    option.value && (disableFiltering || isPristine || !inputValueLower || optionMatchesQuery(option.label)),
  )

  let ordered: ComboboxOptionData[]
  if (disableFiltering || isPristine) {
    ordered = candidates
  }
  else if (customFilter && inputValueLower) {
    const available = optionData.filter(option => option.value)
    ordered = customFilter(inputValueRaw, [...available]).flatMap((option) => {
      const index = available.indexOf(option)
      if (index < 0)
        return []
      return available.splice(index, 1)
    })
  }
  else {
    const startsWith: ComboboxOptionData[] = []
    const contains: ComboboxOptionData[] = []
    for (const option of candidates) {
      if (option.label.toLowerCase().startsWith(inputValueLower))
        startsWith.push(option)
      else contains.push(option)
    }
    ordered = [...startsWith, ...contains]
  }

  const items: ComboboxItem[] = ordered.map((option, index) => ({
    id: `${baseId}${index}`,
    value: option.value,
    label: option.label,
  }))

  // `displayList` overwrites selectedItemId for every matching source option,
  // leaving the last rendered duplicate selected (index.js L467-480).
  const selectedItemId = selectValue
    ? ([...items].reverse().find(item => item.value === selectValue)?.id ?? null)
    : null

  let firstFoundId: string | null = null
  if (disableFiltering) {
    const firstMatchIdx = ordered.findIndex(option => optionMatchesQuery(option.label))
    if (firstMatchIdx >= 0)
      firstFoundId = `${baseId}${firstMatchIdx}`
  }

  const renderHighlightId = selectedItemId ?? (items[0]?.id ?? null)

  const itemToFocusId = isPristine && selectedItemId ? selectedItemId : disableFiltering && firstFoundId ? firstFoundId : null

  const highlightedId = itemToFocusId ?? renderHighlightId

  return { items, highlightedId, promotionId: itemToFocusId }
}
