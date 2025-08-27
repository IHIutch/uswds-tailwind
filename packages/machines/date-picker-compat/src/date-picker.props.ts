import type { DatePickerProps } from './date-picker.types'

export const props: (keyof DatePickerProps)[] = [
  'ids',
  'open',
  'defaultOpen',
  'startValue',
  'endValue',
  'defaultStartValue',
  'defaultEndValue',
  'minDate',
  'maxDate',
  'disabled',
  'readonly',
  'selectionMode',
  'onValueChange',
  'onOpenChange',
  'onInteractOutside',
  'onFocusOutside',
  'onPointerDownOutside',
  'onEscapeKeyDown',
]
