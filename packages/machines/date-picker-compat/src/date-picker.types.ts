import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'
import type { DatePickerInputs } from './date-picker.inputs'
import type { getEffectiveDateBounds, getNavigationAvailability } from './date-picker.utils'

export type DateValue = Date

export type SelectionMode = 'single' | 'range'

/** Index 0 is the range start; index 1 is the end. */
export type EndpointIndex = 0 | 1

export type DateView = 'day' | 'month' | 'year'

export interface ViewProps {
  view?: DateView
}

export interface ViewTriggerProps {
  view: Exclude<DateView, 'day'>
}

export interface TableProps extends ViewProps {}

export type NavigationUnit = 'month' | 'year'

export type NavigationTriggerProps
  = | { view?: 'day', unit?: NavigationUnit }
    | { view: 'year', unit?: never }

export interface ValueChangeDetails {
  /** Proposed selection with stable start/end slots. */
  value: (DateValue | undefined)[]
  /** ISO YYYY-MM-DD per slot; '' preserves an absent endpoint or sparse-array hole. */
  valueAsString: string[]
  view: DateView
}

export interface ViewChangeDetails {
  view: DateView
}

export interface OpenChangeDetails {
  open: boolean
}

export type ElementIds = Partial<{
  root: string
  control: string
  /** Visible form field and label target. */
  input: string | ((index: number) => string)
  /** A string id is unchanged for index 0 and gains an :index suffix for later endpoints. */
  trigger: string | ((index: number) => string)
  content: string
  status: string
}>

export interface DatePickerProps extends DirectionProperty, CommonProperties {
  /** Element ids for composition. */
  ids?: ElementIds | undefined
  /** BCP-47 locale for labels; defaults to the document language or en. */
  locale?: string | undefined
  /**
   * Selection mode. Range slots are start and end.
   * @default "single"
   */
  selectionMode?: SelectionMode | undefined
  /** Controlled selection. Range slots are start/end and may independently be undefined. */
  value?: (DateValue | undefined)[] | undefined
  /** Initial selection when uncontrolled. */
  defaultValue?: (DateValue | undefined)[] | undefined
  /** Controlled calendar focus, independent of selection. */
  focusedValue?: DateValue | undefined
  /** Initial focused date when uncontrolled. */
  defaultFocusedValue?: DateValue | undefined
  /** Navigation fallback; does not select or submit a value. */
  defaultDate?: DateValue | undefined
  /** Fixed peer anchor for range markers and preview, independent of selection. */
  rangeAnchor?: DateValue | undefined
  /** Minimum selectable date; defaults to 0000-01-01. */
  min?: DateValue | undefined
  /** Maximum selectable date. */
  max?: DateValue | undefined
  /** Disable the visible input and trigger. */
  disabled?: boolean | undefined
  /** Make the visible input readonly and aria-disabled. */
  readOnly?: boolean | undefined
  /** Mark the visible form field as required. */
  required?: boolean | undefined
  /** Name of the visible MM/DD/YYYY form field; the ISO mirror has no name. */
  name?: string | undefined

  /** Reports selection proposals with ISO dates in valueAsString. */
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
  onViewChange?: ((details: ViewChangeDetails) => void) | undefined
}

type PropsWithDefault = 'selectionMode' | 'min'

export type DatePickerEvent
  = | { type: 'TRIGGER.CLICK', index?: EndpointIndex }
    | { type: 'OPEN', index?: EndpointIndex }
    | { type: 'BOUNDS.CHANGE' }
    | { type: 'CLOSE' }
    | { type: 'CELL.CLICK', value?: DateValue }
    | { type: 'VIEW.SET', view: DateView }
    | { type: 'GOTO.PREV' | 'GOTO.NEXT', view: 'day' | 'year', unit?: NavigationUnit }
    | { type: 'INPUT.CHANGE', value: string, index?: EndpointIndex }
    | { type: 'INTERACT_OUTSIDE' }
    | { type: 'TABLE.ESCAPE' }
    | { type: 'CELL.POINTER_MOVE', value: DateValue }
    | { type: 'TABLE.ARROW_LEFT' | 'TABLE.ARROW_RIGHT' | 'TABLE.ARROW_UP' | 'TABLE.ARROW_DOWN' }
    | { type: 'TABLE.HOME' | 'TABLE.END' }
    | { type: 'TABLE.PAGE_UP' | 'TABLE.PAGE_DOWN', larger?: boolean }
    | { type: 'VALUE.SET', value: (DateValue | undefined)[] }

export interface DatePickerSchema {
  props: RequiredBy<DatePickerProps, PropsWithDefault>
  computed: {
    valueAsString: string[]
    activeBounds: ReturnType<typeof getEffectiveDateBounds>
    navigation: ReturnType<typeof getNavigationAvailability>
  }
  state: 'idle' | 'open'
  context: {
    /** Committed selection with stable start/end slots; either endpoint may be undefined. */
    value: (DateValue | undefined)[]
    /** Raw visible input drafts, used for validation. */
    inputValues: string[]
    /** Date anchoring the calendar and focused day cell. */
    focusedValue: DateValue
    view: DateView
    hoveredValue: DateValue | null
    /** Endpoint owning the open calendar. */
    activeIndex: EndpointIndex
    /** Announce navigation help on the first render after opening. */
    isOpeningRender: boolean
    /** Roving year, independent of the selected year; chunk navigation moves it by twelve. */
    focusedYear: number
    /** Roving month index 0-11, independent of the selected month. */
    focusedMonth: number
  }
  refs: {
    focusRafCleanup: VoidFunction | null
    inputs: DatePickerInputs | null
  }
  guard:
    | 'isInteractive'
    | 'isDifferentActiveIndex'
    | 'isSelectableDate'
    | 'canGoPrev'
    | 'canGoNext'
    | 'isSelectableViewCell'
    | 'isChoosingRangeEnd'
  action:
    | 'setDateValue'
    | 'setHoveredDate'
    | 'clearHoveredDate'
    | 'setFocusedValueOnOpen'
    | 'commitInputValue'
    | 'syncInputElement'
    | 'reconcileCalendar'
    | 'refreshCalendarBounds'
    | 'resetView'
    | 'markOpeningRender'
    | 'applyNav'
    | 'focusNavTrigger'
    | 'setView'
    | 'setFocusedValueForView'
    | 'keyboardNav'
    | 'invokeOnOpenChange'
    | 'focusInputElement'
    | 'focusActiveCell'
    | 'cancelFocusRaf'
    | 'cancelNativeSyncRaf'
  effect: 'trackDismissableElement' | 'bridgeMountedInputs'
  event: DatePickerEvent
}

export type DatePickerService = Service<DatePickerSchema>
export type DatePickerMachine = Machine<DatePickerSchema>

export interface InputProps {
  index?: EndpointIndex | undefined
  name?: string | undefined
}

/** Endpoint to open; defaults to index 0. */
export interface TriggerProps {
  index?: EndpointIndex | undefined
}

export interface DayTableCellProps {
  value: DateValue
}

/** Weekday column index, starting at 0 for Sunday. */
export interface TableHeaderProps {
  index: number
}

/** Month value is zero-based. */
export interface MonthTableCellProps {
  value: number
}

/** Year value is the full year. */
export interface YearTableCellProps {
  value: number
}

/** Narrow display label and full accessible weekday label. */
export interface WeekDay {
  narrow: string
  long: string
}

export interface DatePickerApi<T extends PropTypes = PropTypes> {
  /** Whether the calendar is open. */
  open: boolean
  view: DateView
  /** Date anchoring the calendar and focused day cell. */
  focusedValue: DateValue
  /** Open or close the calendar; opening another endpoint switches the existing calendar. */
  setOpen: (open: boolean, index?: EndpointIndex) => void
  /** Committed selection; range slots may independently be undefined. */
  value: (DateValue | undefined)[]
  /** ISO YYYY-MM-DD per slot, with '' for absent endpoints; visible fields use MM/DD/YYYY. */
  valueAsString: string[]
  /** Set the normalized selection and report it through onValueChange. */
  setValue: (value: (DateValue | undefined)[]) => void
  /** Clear the selection; fires `onValueChange` with `[]`. */
  clearValue: () => void
  /** Visible day grid, grouped into 4-6 whole weeks. */
  weeks: DateValue[][]
  /** Sunday-first weekday labels for display and accessibility. */
  weekDays: WeekDay[]
  /** Month indices 0-11. */
  months: number[]
  /** Month indices grouped into three-column display rows. */
  monthRows: number[][]
  /** Twelve years in the current navigation chunk. */
  years: number[]
  /** Years grouped into three-column display rows. */
  yearRows: number[][]
  /** Live-region status text; empty when closed. */
  srStatusText: string
  /** Localized name of the focused month. */
  monthLabel: string
  /** The focused year as a string (year trigger text). */
  yearLabel: string
  /** Localized month names indexed from 0-11. */
  monthLabels: string[]

  getRootProps: () => T['element']
  getControlProps: () => T['element']
  /** Visible MM/DD/YYYY form field. */
  getInputProps: (props?: InputProps) => T['input']
  /** Hidden text input with no id or name; range mirrors are located by DOM order. */
  getHiddenInputProps: () => T['input']
  getTriggerProps: (props?: TriggerProps) => T['button']
  getContentProps: () => T['element']
  getStatusProps: () => T['element']

  getViewProps: (props?: ViewProps) => T['element']
  getViewTriggerProps: (props: ViewTriggerProps) => T['button']
  getViewControlProps: () => T['element']
  getPrevTriggerProps: (props?: NavigationTriggerProps) => T['button']
  getNextTriggerProps: (props?: NavigationTriggerProps) => T['button']
  /** Month/year tables use role="presentation"; the day table has no role. */
  getTableProps: (props?: TableProps) => T['element']
  getTableHeadProps: () => T['element']
  getTableHeaderProps: (props: TableHeaderProps) => T['element']
  getTableBodyProps: () => T['element']
  getTableRowProps: () => T['element']
  getDayTableCellProps: (props: DayTableCellProps) => T['element']
  getDayTableCellTriggerProps: (props: DayTableCellProps) => T['button']

  getMonthTableCellTriggerProps: (props: MonthTableCellProps) => T['button']

  getYearTableCellTriggerProps: (props: YearTableCellProps) => T['button']
}
