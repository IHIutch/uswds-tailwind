import type { ComboboxOption } from './combobox.types'

export interface ComboboxOptionData {
  value: string

  label: string
}

/**
 * Selects and orders the supplied source options for a specialized consumer.
 * Returned entries must be references from `options`; Combobox retains their labels.
 */
export type ComboboxCustomFilter = (inputValue: string, options: readonly ComboboxOptionData[]) => readonly ComboboxOptionData[]

export function getAdjacentOption(options: readonly ComboboxOption[], id: string, direction: 1 | -1) {
  const currentIndex = options.findIndex(option => option.id === id)
  if (currentIndex < 0)
    return undefined
  return options[currentIndex + direction]
}

export interface BuildOptionsParams {

  optionData: ComboboxOptionData[]

  inputValueRaw: string

  customFilter?: ComboboxCustomFilter | undefined

  isPristine: boolean

  disableFiltering: boolean

  selectValue: string

  baseId: string
}

export interface BuildOptionsResult {
  options: ComboboxOption[]

  highlightedId: string | null

  /** The one source `displayList` path that calls `highlightOption` while opening. */
  promotionId: string | null

  srStatusText: string
}

export function buildFilteredOptions(params: BuildOptionsParams): BuildOptionsResult {
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

  const numOptions = ordered.length
  const options: ComboboxOption[] = ordered.map((option, index) => ({
    id: `${baseId}${index}`,
    value: option.value,
    label: option.label,
  }))

  // `displayList` overwrites selectedItemId for every matching source option,
  // leaving the last rendered duplicate selected (index.js L467-480).
  const selectedItemId = selectValue
    ? ([...options].reverse().find(option => option.value === selectValue)?.id ?? null)
    : null

  let firstFoundId: string | null = null
  if (disableFiltering) {
    const firstMatchIdx = ordered.findIndex(option => optionMatchesQuery(option.label))
    if (firstMatchIdx >= 0)
      firstFoundId = `${baseId}${firstMatchIdx}`
  }

  const renderHighlightId = selectedItemId ?? (options[0]?.id ?? null)

  const itemToFocusId = isPristine && selectedItemId ? selectedItemId : disableFiltering && firstFoundId ? firstFoundId : null

  const highlightedId = itemToFocusId ?? renderHighlightId

  const srStatusText = numOptions ? `${numOptions} result${numOptions > 1 ? 's' : ''} available.` : 'No results.'

  return { options, highlightedId, promotionId: itemToFocusId, srStatusText }
}
