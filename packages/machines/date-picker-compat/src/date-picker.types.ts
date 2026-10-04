import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'
import type { getEffectiveDateBounds, getNavigationAvailability } from './date-picker.utils'

/* -----------------------------------------------------------------------------
 * Value representation — USWDS's own date math is ported; `@internationalized/date` deliberately rejected
 * ----------------------------------------------------------------------------- */

// The internal date value is a plain normalized JS `Date` — USWDS's OWN representation throughout
// `single-index.js` (`setDate` L154 = `new Date(0)`+`setFullYear` ⇒ genuine year-0..9999 support; `today` L165;
// all add/sub/isSame helpers operate on `Date`). Kept deliberately THIN so a future `@internationalized/date`
// swap stays a localized change confined to `date-picker.utils.ts`.
export type DateValue = Date

/* -----------------------------------------------------------------------------
 * Public enums
 * ----------------------------------------------------------------------------- */

// One consolidated machine parameterized by selection mode. Zag's `"multiple"` is OUT of scope (net-new with no
// USWDS behavior to port): USWDS single-index only ever selects ONE date; range is two coordinated single pickers
// (`range-index.js`).
export type SelectionMode = 'single' | 'range'

/** The two source range pickers: index 0 is start and index 1 is end. */
export type EndpointIndex = 0 | 1

// The three USWDS calendar renders (day grid `renderCalendar` L977 / month picker `displayMonthSelection` L1383 /
// year picker `displayYearSelection` L1477), modeled as CONTEXT (not nested states) — open/closed is the only
// real state pair; the view is data.
export type DateView = 'day' | 'month' | 'year'

export interface ViewProps {
  view?: DateView
}

export interface ViewTriggerProps {
  view: Exclude<DateView, 'day'>
}

export interface TableProps extends ViewProps {}

export type NavigationUnit = 'month' | 'year' | 'chunk'

export interface NavigationTriggerProps {
  unit?: NavigationUnit
}

/* -----------------------------------------------------------------------------
 * Callback details (net-new Zag-idiom surface — USWDS has no callbacks; each is anchored to a USWDS observable)
 * ----------------------------------------------------------------------------- */

// `onValueChange` is anchored to the internal-input `changeElementValue` write (`single-index.js:634`, called by
// `setCalendarValue` L886) — the closest USWDS observable to a value-change callback. `valueAsString` mirrors the
// two serialized formats (external `MM/DD/YYYY`, internal `YYYY-MM-DD`; both fixed, as in USWDS).
// RANGE slots: index 0 = start, index 1 = end — each may be `undefined` independently, exactly like the original's
// two internal inputs (`range-index.js` typed entry: either picker's value can be set/cleared without the other;
// e.g. typing only the END yields `[undefined, end]`). `valueAsString` carries `""` for an empty slot (the
// original's blanked internal input). Single mode is always dense (`[date]`/`[]`).
export interface ValueChangeDetails {
  value: (DateValue | undefined)[]
  /** ISO `YYYY-MM-DD` strings matching `value`; `''` preserves an absent range endpoint, including a sparse-array hole. Native visible fields use `MM/DD/YYYY`. */
  valueAsString: string[]
  view: DateView
}

export interface ViewChangeDetails {
  view: DateView
}

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Element ids (connect owns these; USWDS's markup-derived ids DISSOLVE under the headless port)
 * ----------------------------------------------------------------------------- */

// Inputs are INDEXED (range chrome = one calendar + two inputs bound to value[0]/value[1]). Single always uses
// index 0. There are deliberately NO structural calendar ids (table/cell/nav) — nothing queries those by id
// (focus targeting uses `data-part`), so they would be dead surface.
export type ElementIds = Partial<{
  root: string
  control: string
  /** EXTERNAL input — carries the developer id/name, the form-submit value, and the `<label for>` target. */
  input: string | ((index: number) => string)
  // NO `hiddenInput` id (the INTERNAL input is STRIPPED of id+name, `single-index.js:946-947`; it is a
  // non-submitting ISO mirror,
  // never a `<label for>` target, and the machine — not the DOM — is its source of truth, so it needs no id).
  /** Range triggers are indexed: a string stays unchanged for index 0 and gets an `:index` suffix after that. */
  trigger: string | ((index: number) => string)
  content: string
  status: string
}>

/* -----------------------------------------------------------------------------
 * Props
 * ----------------------------------------------------------------------------- */

// Parity prop surface + flagged net-new callbacks. NO `format`/`parse`/`dateFormat` (USWDS's formats are FIXED:
// external `MM/DD/YYYY`, internal `YYYY-MM-DD`); NO `numOfMonths` (USWDS renders exactly one month); NO
// `selectionMode: "multiple"` (no USWDS analog); NO `closeOnSelect` (effectively hard-true, `selectDate`→
// `hideCalendar` L1331). Extends
// `DirectionProperty` for `dir` + `CommonProperties` for `id`/`getRootNode`.
export interface DatePickerProps extends DirectionProperty, CommonProperties {
  /** ids of the elements — useful for composition. */
  ids?: ElementIds | undefined
  /**
   * BCP-47 locale for month/weekday labels — NET-NEW (USWDS has no locale prop). Defaults to the document's `lang` (`||
   * "en"`), faithfully mirroring USWDS's `document.documentElement.lang || "en"` (`single-index.js:705`).
   */
  locale?: string | undefined
  /**
   * Single-date vs date-range selection over the ONE machine. Range = `value` length 2 + `activeIndex`
   * (`range-index.js`'s two-picker dataset cross-sync REPRODUCED as an intra-machine min/max clamp).
   * @default "single"
   */
  selectionMode?: SelectionMode | undefined
  /**
   * Controlled selected value(s). single ⇒ len ≤1, range ⇒ len ≤2 with slot 0 = start / slot 1 = end. A range
   * slot may be `undefined` when only the other endpoint is committed (`range-index.js` typed entry — either
   * picker's value stands alone), so `ValueChangeDetails.value` round-trips as-is.
   */
  value?: (DateValue | undefined)[] | undefined
  /** Initial selected value(s) when uncontrolled — re-homes `data-default-value` (`single-index.js:900`,953). */
  defaultValue?: (DateValue | undefined)[] | undefined
  /** Controlled calendar-focused (roving) date — distinct from `value` (`calendarEl.dataset.value` L695). */
  focusedValue?: DateValue | undefined
  /** Initial focused date when uncontrolled. */
  defaultFocusedValue?: DateValue | undefined
  /** Source `data-default-date`: navigation fallback only; it does not select or submit a value. */
  defaultDate?: DateValue | undefined
  /** Fixed source `data-range-date` anchor for range markers/preview, independent of committed endpoints. */
  rangeAnchor?: DateValue | undefined
  // NO `view`/`defaultView` props — USWDS has no view prop and every open lands on the day grid (`renderCalendar`
  // L977 via `toggleCalendar`), so a declared view prop would be dead surface; see `resetView` in the machine.
  /** Minimum selectable date — `data-min-date`/input `min` (L913). Defaults to `0000-01-01` when absent (L100). */
  min?: DateValue | undefined
  /** Maximum selectable date — `data-max-date`/input `max` (L919). */
  max?: DateValue | undefined
  /** Fully disabled — `disable()` L755 (`.disabled` on trigger + external input). */
  disabled?: boolean | undefined
  /**
   * Aria-disabled + readonly — `ariaDisable()` L767 (USWDS's aria-disable maps to this `readOnly` prop).
   * Unlike combobox/file-input `ariaDisabled`, this sibling re-home also makes the date input readonly.
   */
  readOnly?: boolean | undefined
  /** Required — carried by the EXTERNAL input only (USWDS sets `required = false` on the internal, L948). */
  required?: boolean | undefined
  /** `name` of the form-submit field — the EXTERNAL input (the visible `MM/DD/YYYY` value submits; the internal mirror has no name, L947). */
  name?: string | undefined

  // — net-new callbacks (no USWDS equivalent; each is anchored to a concrete USWDS observable) —
  /** Fired where USWDS dispatches the internal-input `change` (`changeElementValue` L634 / `setCalendarValue` L886). `details.valueAsString` is ISO `YYYY-MM-DD` (or `''` for an absent endpoint); visible native fields remain `MM/DD/YYYY`. */
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
  onViewChange?: ((details: ViewChangeDetails) => void) | undefined
}

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

// Props defaulted in the machine → promoted to required in the internal schema props type: `selectionMode`
// (`"single"`) and `min` (resolved to `0000-01-01` when absent, `single-index.js:100`, so open-time clamping
// always has a lower bound).
type PropsWithDefault = 'selectionMode' | 'min'

// The event vocabulary (semantic; USWDS binding → event, `datePickerEvents` L2117-2256). Payloads are the minimal
// documented shape. GOTO events follow Zag, with a unit for USWDS month/year/chunk controls.
export type DatePickerEvent
  = | { type: 'TRIGGER.CLICK', index?: EndpointIndex } // toggle button CLICK → `toggleCalendar` L2119; `index` is NET-NEW range endpoint targeting (the original IS two triggers, one per picker — range-index.js)
    | { type: 'OPEN', index?: EndpointIndex }
    | { type: 'BOUNDS.CHANGE' } // accepted reciprocal props refresh the visible calendar
    | { type: 'CLOSE' } // programmatic close
    | { type: 'CELL.CLICK', value?: DateValue } // `.__date`/`.__month`/`.__year` L2122-2128; the machine reads the current view from context
    | { type: 'VIEW.SET', view: DateView } // `.__month-selection`/`.__year-selection` L2149/2153
    | { type: 'GOTO.PREV' | 'GOTO.NEXT', unit: NavigationUnit }
    | { type: 'INPUT.CHANGE', value: string, index?: EndpointIndex } // external `input` → reconcile L2251; `index` = the typed FIELD (0=start/single, 1=range end) so the commit merges into that pair slot (each range field commits independently, as in `range-index.js`)
    // (No INPUT.ENTER/INPUT.BLUR events: Enter/focusout validation L2167/L2241 is a pure DOM side-effect wired
    // directly in connect's getInputProps — it never reaches the machine.)
    | { type: 'INTERACT_OUTSIDE' } // outside pointer or focus interaction → close
    | { type: 'TABLE.ESCAPE' } // keydown Escape → `handleEscapeFromCalendar` L2232 (focuses the EXTERNAL input, L1731)
    | { type: 'CELL.POINTER_MOVE', value: DateValue } // hover-capable pointer previews the range while choosing its end
    | { type: 'TABLE.ARROW_LEFT' | 'TABLE.ARROW_RIGHT' | 'TABLE.ARROW_UP' | 'TABLE.ARROW_DOWN' } // grid nav L2172
    | { type: 'TABLE.HOME' | 'TABLE.END' } // startOfWeek/endOfWeek L2181-2182
    | { type: 'TABLE.PAGE_UP' | 'TABLE.PAGE_DOWN', larger?: boolean } // page navigation; Shift uses a larger year step in day view
    | { type: 'VALUE.SET', value: (DateValue | undefined)[] } // NET-NEW programmatic setter (no USWDS binding)

export interface DatePickerSchema {
  props: RequiredBy<DatePickerProps, PropsWithDefault>
  computed: {
    activeBounds: ReturnType<typeof getEffectiveDateBounds>
    navigation: ReturnType<typeof getNavigationAvailability>
  }
  // Two states only — Zag's separate `focused` closed state is dropped; USWDS just `hideCalendar` + physical `.focus()`.
  // Open ⇔ `calendarEl.hidden === false` + `--active` (L1123/1201); closed ⇔ `hideCalendar` L1311.
  state: 'idle' | 'open'
  // Explicit context (USWDS re-derives all of this from the DOM every event via `getDatePickerContext` L670; the
  // headless port holds it as bindable state). `view` is context, not a nested state.
  context: {
    /**
     * committed selection — internal input `YYYY-MM-DD` (L693). RANGE: slot 0 = start, slot 1 = end; a slot is
     * `undefined` when only the other endpoint is committed (the original's per-picker internal inputs are
     * independent — `range-index.js` typed entry). Trailing empties are trimmed; single mode is always dense.
     */
    value: (DateValue | undefined)[]
    /** Raw text of each external field (0=start/single, 1=end) — NET-NEW: backs the data-driven aria-invalid emission (USWDS holds this only in the DOM). */
    inputValues: string[]
    /** calendar roving/center date — `calendarEl.dataset.value` (L695) / the `tabindex=0` cell (L1075). */
    focusedValue: DateValue
    /** current picker view (day|month|year). */
    view: DateView
    /** range hover-preview date for the current calendar DOM — `handleMouseoverFromDate` L1841. */
    hoveredValue: DateValue | null
    /** Input owning the current calendar, 0=start/single or 1=end. */
    activeIndex: EndpointIndex
    /**
     * true on the render right after open → status announces the nav-help block; nav flips it (`calendarWasHidden`
     * L993/L1209). Set by the open transition; cleared by any subsequent while-open re-render (nav/view/typing).
     */
    isOpeningRender: boolean
    /**
     * The year view's ROVING focused year (`displayYearSelection` `focusedYear`/`yearToDisplay` L1482). Distinct
     * from the anchor `focusedValue.getFullYear()` (= `selectedYear` L1481, which does NOT move on chunk nav). Set
     * on entering the year view; shifted ±12 by chunk nav.
     */
    focusedYear: number
    /**
     * The month view's ROVING focused month (0-11) — `displayMonthSelection` `focusedMonth` L1388 (analogous to
     * `focusedYear`). Set on entering the month view; moved by keyboard nav.
     */
    focusedMonth: number
  }
  refs: {
    /** Pending renderer frames, cancelled at close and machine exit (post-unmount callback race). */
    focusRafCleanup: VoidFunction | null
    nativeSyncRafCleanup: Set<VoidFunction>
    acceptedSyncCleanup: VoidFunction | null
  }
  // Name unions of the machine's implementations block — a typo'd guard/action/effect name in a transition
  // fails typecheck instead of silently never matching.
  guard:
    | 'isInteractive'
    | 'isDifferentActiveIndex'
    | 'isSelectableDate'
    | 'canGoPrev'
    | 'canGoNext'
    | 'isSelectableViewCell'
    | 'isChoosingRangeEnd'
  action:
    | 'setSelectedDate'
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

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

// Optional index for the range two-input chrome (0 = start, 1 = end). Single omits it (defaults to 0).
export interface InputProps {
  index?: EndpointIndex | undefined
  name?: string | undefined
}

/** Optional endpoint the trigger opens for (0 = start, 1 = end). Omit for single mode / legacy behavior. */
export interface TriggerProps {
  index?: EndpointIndex | undefined
}

/** One day cell = one visible date (`generateDateHtml` L1017). */
export interface DayTableCellProps {
  value: DateValue
}

/** One day-of-week header (`<th>` L1183). `index` 0=Sunday. */
export interface TableHeaderProps {
  index: number
}

/** One month cell (`displayMonthSelection` L1390). `value` is the 0-based month index. */
export interface MonthTableCellProps {
  value: number
}

/** One year cell (`displayYearSelection` L1500). `value` is the full year. */
export interface YearTableCellProps {
  value: number
}

/** A weekday label pair for the header row — `narrow` = the `<th>` text, `long` = its `aria-label`. */
export interface WeekDay {
  narrow: string
  long: string
}

export interface DatePickerApi<T extends PropTypes = PropTypes> {
  /** Whether the calendar is open. */
  open: boolean
  /** The current view: day grid | month picker | year picker. */
  view: DateView
  /** The calendar's focused/center date (roving). */
  focusedValue: DateValue
  /** Open a specific input's calendar, defaulting to index 0, or close it. Opening another endpoint switches the existing calendar. */
  setOpen: (open: boolean, index?: EndpointIndex) => void
  /** The committed selection — single mode uses index 0; range slots may be `undefined`. */
  value: (DateValue | undefined)[]
  /** `value` formatted as ISO `YYYY-MM-DD` per slot; `''` for an absent endpoint or sparse-array hole (mirrors `onValueChange`). The visible native input remains `MM/DD/YYYY`. */
  valueAsString: string[]
  /** Programmatically set the selection (normalized like `defaultValue`); fires `onValueChange`. */
  setValue: (value: (DateValue | undefined)[]) => void
  /** Clear the selection; fires `onValueChange` with `[]`. */
  clearValue: () => void
  /** The visible day grid — 4-6 whole weeks of 7 (`getVisibleDays`). Consumer maps rows→cells. */
  weeks: DateValue[][]
  /** Sun..Sat header labels (narrow text + long aria-label). */
  weekDays: WeekDay[]
  /** The 12 month indices `[0..11]` for the month picker (`displayMonthSelection`). */
  months: number[]
  /** Month indices grouped into three-column display rows. */
  monthRows: number[][]
  /** The 12 years of the current chunk for the year picker (`displayYearSelection`). */
  years: number[]
  /** Years grouped into three-column display rows. */
  yearRows: number[][]
  /**
   * The live-region status string (`renderCalendar` L1203-1221 / `displayMonth/YearSelection` L1445/1636);
   * `""` when closed (`hideCalendar` L1316).
   */
  srStatusText: string
  /** The focused month's localized name (month/year trigger text, month-cell labels source). */
  monthLabel: string
  /** The focused year as a string (year trigger text). */
  yearLabel: string
  /** All 12 localized month names for the current locale (indexes align with `months`). */
  monthLabels: string[]

  getRootProps: () => T['element']
  getControlProps: () => T['element']
  /** EXTERNAL input — developer id/name, form-submit value, `MM/DD/YYYY`. */
  getInputProps: (props?: InputProps) => T['input']
  /**
   * INTERNAL input with no id or name, the non-submitting ISO source of truth, emitted with inline `display:none`
   * and `type=text` (`enhanceDatePicker`, `single-index.js:929`, `:944-947`). Range hidden inputs are located by
   * DOM order, so the getter takes no index.
   */
  getHiddenInputProps: () => T['input']
  getTriggerProps: (props?: TriggerProps) => T['button']
  getContentProps: () => T['element']
  getStatusProps: () => T['element']

  // — shared calendar structure —
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
  /** The cell `<td>` is differentiated by its per-cell data value; the trigger carries the full matrix. */
  getDayTableCellProps: (props: DayTableCellProps) => T['element']
  getDayTableCellTriggerProps: (props: DayTableCellProps) => T['button']

  // — month picker view —
  getMonthTableCellTriggerProps: (props: MonthTableCellProps) => T['button']

  // — year picker view —
  getYearTableCellTriggerProps: (props: YearTableCellProps) => T['button']
}
