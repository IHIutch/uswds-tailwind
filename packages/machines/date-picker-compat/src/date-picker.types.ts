import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Date view type
 * ----------------------------------------------------------------------------- */

export type DateView = 'day' | 'month' | 'year'

export type SelectionMode = 'single' | 'range'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface ValueChangeDetails {
  value: Date[]
  valueAsString: string[]
}

export interface FocusChangeDetails {
  focusedValue: Date
  view: DateView
}

export interface ViewChangeDetails {
  view: DateView
}

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  input: string
  trigger: string
  calendar: string
  dayPicker: string
  monthPicker: string
  yearPicker: string
  grid: string
  status: string
  cellTrigger: (dateString: string) => string
  prevYearTrigger: string
  prevMonthTrigger: string
  monthSelection: string
  yearSelection: string
  nextMonthTrigger: string
  nextYearTrigger: string
  prevYearChunkTrigger: string
  nextYearChunkTrigger: string
}>

export interface DayCell {
  date: Date
  dateString: string
  day: number
  isPreviousMonth: boolean
  isCurrentMonth: boolean
  isNextMonth: boolean
  isToday: boolean
  isSelected: boolean
  isFocused: boolean
  isDisabled: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isWithinRange: boolean
  isRangeDate: boolean
  ariaLabel: string
}

export interface MonthCell {
  month: number
  label: string
  isFocused: boolean
  isSelected: boolean
  isDisabled: boolean
}

export interface YearCell {
  year: number
  isFocused: boolean
  isSelected: boolean
  isDisabled: boolean
}

export interface WeekDay {
  narrow: string
  long: string
}

export interface DatepickerProps extends CommonProperties {
  selectionMode?: SelectionMode | undefined
  ids?: ElementIds | undefined
  min?: string | undefined
  max?: string | undefined
  defaultValue?: string[] | undefined
  value?: Date[] | undefined
  disabled?: boolean | undefined
  locale?: string | undefined
  rangeDate?: string | undefined
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
  onViewChange?: ((details: ViewChangeDetails) => void) | undefined
  onFocusChange?: ((details: FocusChangeDetails) => void) | undefined
}

type PropsWithDefault
  = | 'selectionMode'
    | 'min'
    | 'locale'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface DatepickerSchema {
  props: RequiredBy<DatepickerProps, PropsWithDefault>
  state: 'idle' | 'focused' | 'open'
  context: {
    value: Date[]
    focusedValue: Date
    view: DateView
    inputValue: string
    hoveredValue: Date | null
    activeIndex: number
    lastKeydownCode: number | null
    statusMessage: string
  }
  computed: {
    minDate: Date
    maxDate: Date | null
    isInteractive: boolean
    isInvalid: boolean
    valueAsString: string[]
    weeks: DayCell[][]
    weekDays: WeekDay[]
    months: MonthCell[]
    years: YearCell[]
    monthLabel: string
    yearLabel: string
    yearChunkStart: number
    isPrevMonthDisabled: boolean
    isNextMonthDisabled: boolean
    isPrevYearDisabled: boolean
    isNextYearDisabled: boolean
    isPrevYearChunkDisabled: boolean
    isNextYearChunkDisabled: boolean
    rangeDates: {
      rangeStartDate: Date | null
      rangeEndDate: Date | null
      withinRangeStartDate: Date | null
      withinRangeEndDate: Date | null
    }
  }
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type DatepickerService = Service<DatepickerSchema>
export type DatepickerMachine = Machine<DatepickerSchema>

/* -----------------------------------------------------------------------------
 * Cell trigger props for connect (passed to get*CellTriggerProps)
 * ----------------------------------------------------------------------------- */

export interface DayCellProps {
  cell: DayCell
}

export interface MonthCellProps {
  cell: MonthCell
}

export interface YearCellProps {
  cell: YearCell
}

/* -----------------------------------------------------------------------------
 * Input props for connect (range mode has two inputs)
 * ----------------------------------------------------------------------------- */

export interface InputProps {
  index?: number | undefined
}

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface DatepickerApi<T extends PropTypes = PropTypes> {
  open: boolean
  focused: boolean
  disabled: boolean
  view: DateView
  value: Date[]
  valueAsString: string[]
  inputValue: string
  focusedValue: Date
  hoveredValue: Date | null
  isInvalid: boolean
  selectionMode: SelectionMode
  weeks: DayCell[][]
  weekDays: WeekDay[]
  months: MonthCell[]
  years: YearCell[]
  monthLabel: string
  yearLabel: string
  yearChunkStart: number
  isPrevMonthDisabled: boolean
  isNextMonthDisabled: boolean
  isPrevYearDisabled: boolean
  isNextYearDisabled: boolean
  isPrevYearChunkDisabled: boolean
  isNextYearChunkDisabled: boolean
  statusMessage: string

  setValue: (values: Date[]) => void
  clearValue: () => void
  setOpen: (open: boolean) => void
  setView: (view: DateView) => void
  setFocusedValue: (value: Date) => void
  goToNext: () => void
  goToPrev: () => void

  getRootProps: () => T['element']
  getInputProps: (props?: InputProps) => T['input']
  getTriggerProps: () => T['button']
  getCalendarProps: () => T['element']
  getDayPickerProps: () => T['element']
  getMonthPickerProps: () => T['element']
  getYearPickerProps: () => T['element']
  getGridProps: () => T['element']
  getHeaderProps: () => T['element']
  getHeaderRowProps: () => T['element']
  getHeaderCellProps: (props: { day: WeekDay }) => T['element']
  getBodyProps: () => T['element']
  getRowProps: () => T['element']
  getCellProps: (props: DayCellProps) => T['element']
  getDayCellTriggerProps: (props: DayCellProps) => T['element']
  getMonthCellTriggerProps: (props: MonthCellProps) => T['element']
  getYearCellTriggerProps: (props: YearCellProps) => T['element']
  getPrevYearTriggerProps: () => T['button']
  getPrevMonthTriggerProps: () => T['button']
  getMonthSelectionProps: () => T['button']
  getYearSelectionProps: () => T['button']
  getNextMonthTriggerProps: () => T['button']
  getNextYearTriggerProps: () => T['button']
  getPrevYearChunkTriggerProps: () => T['button']
  getNextYearChunkTriggerProps: () => T['button']
  getStatusProps: () => T['element']
}
