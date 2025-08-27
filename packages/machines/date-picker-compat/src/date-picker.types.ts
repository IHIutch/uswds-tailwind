import type { Machine, Service } from '@zag-js/core'
import type { DismissableElementHandlers } from '@zag-js/dismissable'
import type { CommonProperties, DirectionProperty, PropTypes } from '@zag-js/types'

export type DateFormat = 'YYYY-MM-DD' | 'MM/dd/yyyy'
export type SelectionMode = 'single' | 'range'

export type NavigationDirection = 'next' | 'prev'
export type NavigationUnit = 'day' | 'week' | 'month' | 'year'

export type ElementIds = Partial<{
  root: string
  input: string
  trigger: string
  calendar: string
  status: string
  monthSelection: string
  yearSelection: string
}>

export interface DatePickerProps extends DirectionProperty,
  CommonProperties,
  DismissableElementHandlers {
  ids?: ElementIds
  open?: boolean
  defaultOpen?: boolean
  startValue?: string
  endValue?: string
  defaultStartValue?: string
  defaultEndValue?: string
  minDate?: string
  maxDate?: string
  disabled?: boolean
  readonly?: boolean
  selectionMode?: SelectionMode
  onValueChange?: (details: { value: string, valueAsDate: Date | null }) => void
  onOpenChange?: (details: { open: boolean }) => void
}

export interface DatePickerContext {
  // Core dates
  calendarDate: Date
  startDate: Date | null
  endDate: Date | null
  hoverDate: Date | null

  // Selection mode
  selectionMode: SelectionMode
  // Active input tracking
  activeInput: 'start' | 'end' | null

  // Constraints
  minDate: Date | null
  maxDate: Date | null

  // Input values for range mode
  startInputValue: string
  endInputValue: string

  // UI state
  focusedMonth: number | null
  focusedYear: number | null

  // Validation for range mode
  isStartInputValid: boolean
  isEndInputValid: boolean
  startValidationMessage: string
  endValidationMessage: string

  // Validation for single mode (backward compatibility)
  isInputValid: boolean
  validationMessage: string

  // Localization
  monthLabels: string[]
  dayOfWeekLabels: string[]
  dayOfWeekAbbreviations: string[]

  // Constants
  yearChunk: number
}

export interface DatePickerSchema {
  props: Partial<DatePickerProps>
  state: 'closed' | 'dateSelection' | 'monthSelection' | 'yearSelection'
  context: DatePickerContext
  effect: 'trackInteractOutside' | 'trackFocusVisible'
  action:
  // | 'updateInputValue'
  | 'updateStartInputValue'
  | 'updateEndInputValue'
  | 'validateStartInput'
  | 'validateEndInput'
  | 'updateCalendarDate'
  | 'selectDate'
  | 'selectRangeStart'
  | 'selectRangeEnd'
  | 'clearRange'
  | 'clearStartDate'
  | 'clearEndDate'
  // | 'focusStartInput'
  // | 'focusEndInput'
  | 'setActiveInput'
  | 'selectMonth'
  | 'selectYear'
  | 'navigateDate'
  | 'navigatePreviousMonth'
  | 'navigateNextMonth'
  | 'navigatePreviousYear'
  | 'navigateNextYear'
  | 'navigateMonthSelection'
  | 'navigateYearSelection'
  | 'navigatePreviousYearChunk'
  | 'navigateNextYearChunk'
  | 'focusCalendarDate'
  | 'focusCurrentMonth'
  | 'focusCurrentYear'
  // | 'enableComponent'
  // | 'disableComponent'
  | 'handleDateHover'
  | 'setControlledValue'
  | 'invokeOnValueChange'
  | 'invokeOnOpenChange'
  event:
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'ESCAPE' }
  // | { type: 'INPUT_CHANGE', value: string }
  | { type: 'START_INPUT_CHANGE', value: string }
  | { type: 'END_INPUT_CHANGE', value: string }
  | { type: 'INPUT_FOCUS' }
  | { type: 'START_INPUT_FOCUS' }
  | { type: 'END_INPUT_FOCUS' }
  | { type: 'ENABLE' }
  | { type: 'DISABLE' }
  | { type: 'SELECT_DATE', date: Date }
  | { type: 'SELECT_MONTH', month: number }
  | { type: 'SELECT_YEAR', year: number }
  | { type: 'SHOW_MONTH_SELECTION' }
  | { type: 'SHOW_YEAR_SELECTION' }
  | { type: 'NAVIGATE_DATE', direction: NavigationDirection, unit?: NavigationUnit, amount?: number }
  | { type: 'NAVIGATE_PREVIOUS_MONTH' }
  | { type: 'NAVIGATE_NEXT_MONTH' }
  | { type: 'NAVIGATE_PREVIOUS_YEAR' }
  | { type: 'NAVIGATE_NEXT_YEAR' }
  | { type: 'NAVIGATE_MONTH', direction: NavigationDirection, amount?: number }
  | { type: 'NAVIGATE_YEAR', direction: NavigationDirection, amount?: number }
  | { type: 'NAVIGATE_PREVIOUS_YEAR_CHUNK' }
  | { type: 'NAVIGATE_NEXT_YEAR_CHUNK' }
  | { type: 'FOCUS_OUT', relatedTarget?: EventTarget | null, currentTarget?: EventTarget | null }
  | { type: 'HOVER_DATE', date: Date }
  | { type: 'START_RANGE', date: Date }
  | { type: 'END_RANGE', date: Date }
  | { type: 'CLEAR_RANGE' }
  | { type: 'CONTROLLED.OPEN' | 'CONTROLLED.CLOSE' }
  | { type: 'CONTROLLED.VALUE_CHANGE', value: { start: string | null, end: string | null } }
}

export type DatePickerService = Service<DatePickerSchema>
export type DatePickerMachine = Machine<DatePickerSchema>

export interface DatePickerApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the calendar is open
   */
  open: boolean

  /**
   * The current value of the date picker
   */
  startValue: string | null

  /**
   * The current value as a Date object
   */
  startValueDate: Date | null

  endValue: string | null

  endValueDate: Date | null

  /**
   * The current view state
   */
  view: 'date' | 'month' | 'year'

  /**
   * Whether the input is focused
   */
  focused: boolean

  /**
   * Whether the date picker is disabled
   */
  disabled: boolean

  /**
   * Whether the date picker is readonly
   */
  readonly: boolean

  /**
   * Set the open state
   */
  setOpen: (open: boolean) => void

  /**
   * Set the value
   */
  // setValue: (value: string) => void

  /**
   * Set the start date (range mode)
   */
  setStartDate: (value: string) => void

  /**
   * Set the end date (range mode)
   */
  setEndDate: (value: string) => void

  /**
   * Clear the start date (range mode)
   */
  clearStartDate: () => void

  /**
   * Clear the end date (range mode)
   */
  clearEndDate: () => void

  /**
   * Focus the start input (range mode)
   */
  // focusStartInput: () => void

  /**
   * Focus the end input (range mode)
   */
  // focusEndInput: () => void

  /**
   * Clear the entire range (rang
  /**
   * Navigate to a specific date
   */
  goToDate: (date: Date) => void

  /**
   * Props for the root element
   */
  getRootProps: () => T['element']

  /**
   * Props for the input element (single mode)
   */
  getInputProps: () => T['input']

  /**
   * Props for the start date input element (range mode)
   */
  getStartInputProps: () => T['input']

  /**
   * Props for the end date input element (range mode)
   */
  getEndInputProps: () => T['input']

  /**
   * Props for the trigger button
   */
  getTriggerProps: (target?: 'start' | 'end') => T['button']

  /**
   * Props for the calendar container
   */
  getCalendarProps: () => T['element']

  /**
   * Props for the status region
   */
  getStatusProps: () => T['element']

  /**
   * Props for navigation buttons
   */
  getNavigationProps: (direction: 'prev' | 'next', unit: 'month' | 'year') => T['button']

  /**
   * Props for month/year selection buttons
   */
  getMonthYearSelectionProps: (type: 'month' | 'year') => T['button']

  /**
   * Props for the date grid container
   */
  getDateGridProps: () => T['element']

  /**
   * Props for day of week headers
   */
  getDayOfWeekHeaderProps: (dayIndex: number) => T['element']

  /**
   * Props for individual date buttons
   */
  getDateButtonProps: (date: Date) => T['button']

  /**
   * Props for month selection container
   */
  getMonthSelectionProps: () => T['element']

  /**
   * Props for individual month buttons
   */
  getMonthButtonProps: (month: number) => T['button']

  /**
   * Props for year selection container
   */
  getYearSelectionProps: () => T['element']

  /**
   * Props for year chunk navigation buttons
   */
  getDecadeNavigationProps: (direction: 'prev' | 'next') => T['button']

  /**
   * Props for individual year buttons
   */
  getYearButtonProps: (year: number) => T['button']

  /**
   * Get array of week days with props for template cloning
   */
  getWeekDays: () => Array<{ label: string, index: number, props: T['element'] }>

  /**
   * Get array of calendar dates with props for template cloning
   */
  getCalendarDates: () => Array<{ date: Date, props: T['button'] }>

  /**
   * Get array of months with props for template cloning
   */
  getMonthsGrid: () => Array<{ month: number, label: string, props: T['button'] }>

  /**
   * Get array of years with props for template cloning
   */
  getYearsGrid: () => Array<{ year: number, props: T['button'] }>

  /**
   * Get current year range information
   */
  getYearRange: () => { start: number, end: number, display: string }

  /**
   * Generate calendar weeks (internal method)
   */
  getWeeksInMonth: (date: Date) => (Date | null)[][]

  /**
   * Get props for the month picker container
   */
  getMonthPickerProps: () => T['element']

  /**
   * Get props for the year picker container
   */
  getYearPickerProps: () => T['element']
}
