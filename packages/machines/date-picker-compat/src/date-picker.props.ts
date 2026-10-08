import type { DatePickerProps } from './date-picker.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<DatePickerProps>()([
  'disabled',
  'defaultValue',
  'defaultDate',
  'getRootNode',
  'id',
  'ids',
  'max',
  'min',
  'name',
  'onOpenChange',
  'onValueChange',
  'readOnly',
  'required',
  'rangeAnchor',
  'selectionMode',
  'value',
])

export const splitProps = createSplitProps<Partial<DatePickerProps>>(props)
