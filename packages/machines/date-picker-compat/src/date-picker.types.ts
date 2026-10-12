import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'
import type { getNavigationAvailability } from './date-picker.utils'
import type { Interval } from './date-utils'

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

export type NavigationUnit = 'month' | 'year'

export type NavigationTriggerProps
  = | { view?: 'day', unit?: NavigationUnit }
    | { view: 'year', unit?: never }

export interface ValueChangeDetails {
  /** Proposed dates, with start/end slots in range mode. */
  value: (Date | undefined)[]
  /** ISO dates, with '' for missing endpoints. */
  valueAsString: string[]
  view: DateView
}

export interface OpenChangeDetails {
  open: boolean
}

export type ElementIds = Partial<{
  root: string
  label: (index: number) => string
  control: string
  /** Visible form field and label target. */
  input: (index: number) => string
  trigger: (index: number) => string
  content: string
  status: string
}>

export interface DatePickerProps extends CommonProperties {
  ids?: ElementIds | undefined
  /** @default "single" */
  selectionMode?: SelectionMode | undefined
  /** Controlled selection. Range slots are start/end and may independently be undefined. */
  value?: (Date | undefined)[] | undefined
  /** Initial selection when uncontrolled. */
  defaultValue?: (Date | undefined)[] | undefined
  /** Navigation fallback; does not select or submit a value. */
  defaultDate?: Date | undefined
  /** Fixed peer anchor for range markers and preview, independent of selection. */
  rangeAnchor?: Date | undefined
  /** Minimum selectable date; defaults to 0000-01-01. */
  min?: Date | undefined
  max?: Date | undefined
  disabled?: boolean | undefined
  /** Make the visible input readonly and aria-disabled. */
  readOnly?: boolean | undefined
  required?: boolean | undefined
  /** Name of the MM/DD/YYYY form field. */
  name?: string | undefined

  /** Fired when proposed dates differ from the current selection, including controlled proposals. */
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

export type DatePickerEvent
  = | { type: 'TRIGGER.CLICK', index?: EndpointIndex }
    | { type: 'OPEN', index?: EndpointIndex }
    | { type: 'CLOSE' }
    | { type: 'CELL.CLICK', value: Date }
    | { type: 'VIEW.SET', view: DateView }
    | { type: 'GOTO.PREV' | 'GOTO.NEXT', view: 'day' | 'year', unit?: NavigationUnit }
    | { type: 'INPUT.CHANGE', value: string, index: EndpointIndex }
    | { type: 'INTERACT_OUTSIDE' }
    | { type: 'TABLE.ESCAPE' }
    | { type: 'CELL.POINTER_MOVE', value: Date }
    | { type: 'TABLE.ARROW_LEFT' | 'TABLE.ARROW_RIGHT' | 'TABLE.ARROW_UP' | 'TABLE.ARROW_DOWN' }
    | { type: 'TABLE.HOME' | 'TABLE.END' }
    | { type: 'TABLE.PAGE_UP' | 'TABLE.PAGE_DOWN', larger?: boolean }
    | { type: 'VALUE.SET', value: (Date | undefined)[] }

export interface DatePickerSchema {
  props: RequiredBy<DatePickerProps, 'selectionMode' | 'min'>
  computed: {
    valueAsString: string[]
    activeBounds: Interval
    navigation: ReturnType<typeof getNavigationAvailability>
  }
  state: 'idle' | 'open'
  context: {
    value: (Date | undefined)[]
    /** Raw input text, including unaccepted drafts. */
    inputValues: string[]
    focusedValue: Date
    view: DateView
    hoveredValue: Date | null
    activeIndex: EndpointIndex
    /** Show navigation help in the opening announcement. */
    isOpeningRender: boolean
    /** Focused year in the year grid; may differ from focusedValue. */
    focusedYear: number
    /** Focused month in the month grid; may differ from focusedValue. */
    focusedMonth: number
  }
  refs: {
    focusRafCleanup: VoidFunction | null
    inputSyncCleanup: VoidFunction | null
    /** Inputs whose next write emits change even when the text is unchanged. */
    explicitInputs: Set<EndpointIndex>
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
  effect: 'trackDismissableElement' | 'syncInputsOnMount'
  event: DatePickerEvent
}

export type DatePickerService = Service<DatePickerSchema>
export type DatePickerMachine = Machine<DatePickerSchema>

/** Endpoint the label names; defaults to index 0. */
export interface LabelProps {
  index?: EndpointIndex | undefined
}

export interface InputProps {
  index?: EndpointIndex | undefined
  name?: string | undefined
}

/** Endpoint to open; defaults to index 0. */
export interface TriggerProps {
  index?: EndpointIndex | undefined
}

export interface DayTableCellProps {
  value: Date
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

export interface WeekDay {
  narrow: string
  long: string
}

export interface DatePickerApi<T extends PropTypes = PropTypes> {
  open: boolean
  view: DateView
  /** Date anchoring the calendar and focused day cell. */
  focusedValue: Date
  /** Open or close the calendar; opening another endpoint switches the existing calendar. */
  setOpen: (open: boolean, index?: EndpointIndex) => void
  value: (Date | undefined)[]
  /** ISO YYYY-MM-DD per slot, with '' for absent endpoints; visible fields use MM/DD/YYYY. */
  valueAsString: string[]
  /** Propose a normalized selection; onValueChange fires when the dates differ. */
  setValue: (value: (Date | undefined)[]) => void
  /** Clear the selection; an already-empty selection does not fire onValueChange. */
  clearValue: () => void
  /** Visible day grid, grouped into 4-6 whole weeks. */
  weeks: Date[][]
  /** Sunday-first weekday labels for display and accessibility. */
  weekDays: WeekDay[]
  /** Month indices 0-11. */
  months: number[]
  /** Month indices grouped into three-column display rows. */
  monthRows: number[][]
  /** The twelve years displayed in the year view. */
  years: number[]
  /** Years grouped into three-column display rows. */
  yearRows: number[][]
  /** Live-region status text; empty when closed. */
  srStatusText: string
  monthLabel: string
  yearLabel: string
  /** Localized month names indexed from 0-11. */
  monthLabels: string[]

  getRootProps: () => T['element']
  getLabelProps: (props?: LabelProps) => T['label']
  getControlProps: () => T['element']
  /** Visible MM/DD/YYYY form field. */
  getInputProps: (props?: InputProps) => T['input']
  getTriggerProps: (props?: TriggerProps) => T['button']
  getContentProps: () => T['element']
  getStatusProps: () => T['element']

  getViewProps: (props?: ViewProps) => T['element']
  getViewTriggerProps: (props: ViewTriggerProps) => T['button']
  getViewControlProps: () => T['element']
  getPrevTriggerProps: (props?: NavigationTriggerProps) => T['button']
  getNextTriggerProps: (props?: NavigationTriggerProps) => T['button']
  /** Month/year tables use role="presentation"; the day table has no role. */
  getTableProps: (props?: ViewProps) => T['element']
  getTableHeadProps: () => T['element']
  getTableHeaderProps: (props: TableHeaderProps) => T['element']
  getTableBodyProps: () => T['element']
  getTableRowProps: () => T['element']
  getDayTableCellProps: (props: DayTableCellProps) => T['element']
  getDayTableCellTriggerProps: (props: DayTableCellProps) => T['button']

  getMonthTableCellTriggerProps: (props: MonthTableCellProps) => T['button']

  getYearTableCellTriggerProps: (props: YearTableCellProps) => T['button']
}
