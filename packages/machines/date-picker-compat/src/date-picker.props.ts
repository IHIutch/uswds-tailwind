import type { DatePickerProps } from './date-picker.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

// Form identity belongs to the visible input; formats and selection behavior follow USWDS.
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
