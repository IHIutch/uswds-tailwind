import type { DatepickerProps, DayCellProps, InputProps, MonthCellProps, YearCellProps } from './date-picker.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<DatepickerProps>()([
  'id',
  'ids',
  'getRootNode',
  'selectionMode',
  'min',
  'max',
  'defaultValue',
  'value',
  'disabled',
  'locale',
  'rangeDate',
  'onValueChange',
  'onOpenChange',
  'onViewChange',
  'onFocusChange',
])

export const splitProps = createSplitProps<Partial<DatepickerProps>>(props)

export const dayCellProps = createProps<DayCellProps>()(['cell'])
export const splitDayCellProps = createSplitProps<DayCellProps>(dayCellProps)

export const monthCellProps = createProps<MonthCellProps>()(['cell'])
export const splitMonthCellProps = createSplitProps<MonthCellProps>(monthCellProps)

export const yearCellProps = createProps<YearCellProps>()(['cell'])
export const splitYearCellProps = createSplitProps<YearCellProps>(yearCellProps)

export const inputProps = createProps<InputProps>()(['index'])
export const splitInputProps = createSplitProps<InputProps>(inputProps)
