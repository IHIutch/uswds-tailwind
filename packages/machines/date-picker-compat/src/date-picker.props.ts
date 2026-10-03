import type { DatePickerProps, InputProps } from './date-picker.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

// The parity prop keys. `name`/`id` denote the EXTERNAL input's form identity (the visible `MM/DD/YYYY` input
// submits; the internal ISO mirror carries neither). NO `format`/`parse`/`numOfMonths`/`closeOnSelect`/
// `translations`/`positioning`/`presets`/`inline` — Zag's date-picker has those keys, but USWDS has no equivalent
// behavior to port (formats are fixed, one month renders, select always closes).
export const props = createProps<DatePickerProps>()([
  'dir',
  'disabled',
  'defaultValue',
  'defaultFocusedValue',
  'defaultDate',
  'focusedValue',
  'getRootNode',
  'id',
  'ids',
  'locale',
  'max',
  'min',
  'name',
  'onOpenChange',
  'onValueChange',
  'onViewChange',
  'readOnly',
  'required',
  'rangeAnchor',
  'selectionMode',
  'value',
])

export const splitProps = createSplitProps<Partial<DatePickerProps>>(props)

// Per-input split — the range two-input chrome passes `{ index }` (0 = start, 1 = end) to
// `getInputProps`. `getHiddenInputProps` takes no argument; range hidden inputs are located by DOM order.
export const inputProps = createProps<InputProps>()(['index', 'name'])
export const splitInputProps = createSplitProps<InputProps>(inputProps)
