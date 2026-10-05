import type { Params, Scope } from '@zag-js/core'
import type { DatePickerSchema, DateValue, DateView, ValueChangeDetails } from './date-picker.types'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import * as dom from './date-picker.dom'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  DEFAULT_EXTERNAL_DATE_FORMAT,
  endOfWeek,
  formatDate,
  getEffectiveDateBounds,
  getNavigationAvailability,
  INTERNAL_DATE_FORMAT,
  isDatesMonthOutsideMinOrMax,
  isDatesYearOutsideMinOrMax,
  isDateWithinMinAndMax,
  isEndpointIndex,
  isSameDay,
  isSameMonth,
  isSameYear,
  keepDateBetweenMinAndMax,
  normalizeDate,
  parseDateString,
  reconcileInputValues,
  setDate,
  setMonth,
  setRangeEndpoint,
  setYear,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  today,
  YEAR_CHUNK,
} from './date-picker.utils'

// Open/close maps to `toggleCalendar`/`hideCalendar` (`single-index.js` L1341/L1311). Focus uses the
// owning window's RAF so rendered cells exist before physical focus. `view` remains context.
//
// `setCalendarValue` (L886-889) mirrors committed ISO and display text with native change events.
// Controlled accepted values use this path; `bridgeMountedInputs` owns mount initialization.
function rememberVisibleInput(context: Params<DatePickerSchema>['context'], index: number, value: string): void {
  const inputValues = context.get('inputValues')
  if (inputValues[index] === value)
    return
  const next = [...inputValues]
  next[index] = value
  context.set('inputValues', next)
}

function syncOneInput(
  scope: Scope,
  context: Params<DatePickerSchema>['context'],
  index: number,
  dateValue: DateValue | undefined,
  min: DateValue,
  max: DateValue | undefined,
): void {
  const internalStr = dateValue ? formatDate(dateValue, INTERNAL_DATE_FORMAT) : ''
  const externalStr = dateValue ? formatDate(dateValue, DEFAULT_EXTERNAL_DATE_FORMAT) : ''

  const hiddenEl = dom.getHiddenInputEl(scope, index)
  if (hiddenEl && hiddenEl.value !== internalStr)
    dom.changeElementValue(hiddenEl, internalStr)

  // Do NOT reformat/validate the input the user is actively editing — typing writes the internal ISO only (L858);
  // the external is reformatted only by a cell-click / mount (`setCalendarValue` L887), when it is NOT the active
  // element. This keeps the typed string intact while the value commits behind it (so the calendar highlights it).
  // Write-if-changed (mirror `reconcileInputValues`' L866 guard): a range commit in ONE field must not re-dispatch
  // a spurious `change` on the OTHER field whose text already reads the same value.
  const externalEl = dom.getExternalInputEl(scope, index)
  if (externalEl && !scope.isActiveElement(externalEl)) {
    if (externalEl.value !== externalStr) {
      dom.changeElementValue(externalEl, externalStr)
      dom.applyDateInputValidity(externalEl, externalStr, min, max)
    }
    // The DOM can already show an accepted value while the cached draft is stale.
    // Reconcile that cache without dispatching a redundant native change event.
    rememberVisibleInput(context, index, externalStr)
  }
}

// `setCalendarValue` is an action boundary, not a value observer. It always writes the
// operated input pair in source order, even when the selected day was reselected.
function commitCalendarInput(scope: Scope, context: Params<DatePickerSchema>['context'], index: number, dateValue: DateValue | undefined, min: DateValue, max: DateValue | undefined): void {
  const internalStr = dateValue ? formatDate(dateValue, INTERNAL_DATE_FORMAT) : ''
  const externalStr = dateValue ? formatDate(dateValue, DEFAULT_EXTERNAL_DATE_FORMAT) : ''
  const hiddenEl = dom.getHiddenInputEl(scope, index)
  if (hiddenEl)
    dom.changeElementValue(hiddenEl, internalStr)
  const externalEl = dom.getExternalInputEl(scope, index)
  if (externalEl) {
    dom.changeElementValue(externalEl, externalStr)
    dom.applyDateInputValidity(externalEl, externalStr, min, max)
    rememberVisibleInput(context, index, externalStr)
  }
}

// Semantic equality for date bindables, following Zag's `isDateEqual`/`isDateArrayEqual`
// (zag `date-picker.machine.ts:50-57`, `date-utils/assertion.ts:4-8`). Two `Date` objects naming the same
// calendar day are one value under USWDS's own `isSameYear`/`isSameMonth`/`isSameDay` chain
// (`single-index.js:378-405`), and an absent slot equals only an absent slot.
function isDateEqual(a: DateValue | null | undefined, b: DateValue | null | undefined): boolean {
  if (a == null || b == null)
    return a === b
  return isSameDay(a, b)
}
function isDateArrayEqual(a: (DateValue | undefined)[], b: (DateValue | undefined)[] | undefined): boolean {
  if (b === undefined || a.length !== b.length)
    return false
  return a.every((date, index) => isDateEqual(date, b[index]))
}

// One payload shape for every commit path, anchored to the internal-input write (`single-index.js:634`). Each
// slot carries its ISO `YYYY-MM-DD` string or `''` for an absent range endpoint, alongside the current view.
function emitValueChange({ context, prop }: Pick<Params<DatePickerSchema>, 'context' | 'prop'>, value: (DateValue | undefined)[]): void {
  const details: ValueChangeDetails = {
    value,
    valueAsString: Array.from(value, d => (d ? formatDate(d) : '')),
    view: context.get('view'),
  }
  prop('onValueChange')?.(details)
}

function scheduleCalendarInputs(params: Params<DatePickerSchema>, indexes: number[]): void {
  const { scope, refs, context, prop } = params
  // Uncontrolled actions commit synchronously, preserving every intermediate value.
  if (prop('value') === undefined) {
    for (const index of indexes)
      commitCalendarInput(scope, context, index, context.get('value')[index], prop('min'), prop('max'))
    return
  }
  const win = scope.getWin()
  const pending = refs.get('nativeSyncRafCleanup')
  let live = true
  let id: number
  const cleanup = () => {
    live = false
    win.cancelAnimationFrame(id)
    pending.delete(cleanup)
  }
  id = win.requestAnimationFrame(() => {
    if (!live)
      return
    cleanup()
    for (const index of indexes)
      commitCalendarInput(scope, context, index, context.get('value')[index], prop('min'), prop('max'))
  })
  pending.add(cleanup)
}

/** Renderer timing is owned by this machine's window and survives cancellation only when live. */
function scheduleFocusFrame({ scope, refs }: Pick<Params<DatePickerSchema>, 'scope' | 'refs'>, callback: () => void): void {
  refs.get('focusRafCleanup')?.()
  const win = scope.getWin()
  let live = true
  let id = 0
  const cleanup = () => {
    live = false
    win.cancelAnimationFrame(id)
    if (refs.get('focusRafCleanup') === cleanup)
      refs.set('focusRafCleanup', null)
  }
  id = win.requestAnimationFrame(() => {
    if (!live)
      return
    cleanup()
    callback()
  })
  refs.set('focusRafCleanup', cleanup)
}

// Keyboard grid nav (`adjustCalendar` L1745 / `adjustMonthSelectionScreen` L1879 / `adjustYearSelectionScreen`
// L1970). Same TABLE.* event maps to a different adjustment PER VIEW.
function dayKeyTarget(type: string, d: DateValue, larger = false): DateValue {
  switch (type) {
    case 'TABLE.ARROW_UP': return subWeeks(d, 1) // L1765
    case 'TABLE.ARROW_DOWN': return addWeeks(d, 1) // L1772
    case 'TABLE.ARROW_LEFT': return subDays(d, 1) // L1779
    case 'TABLE.ARROW_RIGHT': return addDays(d, 1) // L1786
    case 'TABLE.HOME': return startOfWeek(d) // L1793
    case 'TABLE.END': return endOfWeek(d) // L1800
    case 'TABLE.PAGE_UP': return larger ? subYears(d, 1) : subMonths(d, 1) // L1814
    case 'TABLE.PAGE_DOWN': return larger ? addYears(d, 1) : addMonths(d, 1) // L1807
    default: return d
  }
}
function monthKeyTarget(type: string, month: number): number {
  switch (type) {
    case 'TABLE.ARROW_UP': return month - 3 // L1906
    case 'TABLE.ARROW_DOWN': return month + 3 // L1913
    case 'TABLE.ARROW_LEFT': return month - 1 // L1920
    case 'TABLE.ARROW_RIGHT': return month + 1 // L1927
    case 'TABLE.HOME': return month - (month % 3) // L1934
    case 'TABLE.END': return month + 2 - (month % 3) // L1943
    case 'TABLE.PAGE_UP': return 0 // L1959
    case 'TABLE.PAGE_DOWN': return 11 // L1952
    default: return month
  }
}
function yearKeyTarget(type: string, year: number): number {
  switch (type) {
    case 'TABLE.ARROW_UP': return year - 3 // L1997
    case 'TABLE.ARROW_DOWN': return year + 3 // L2004
    case 'TABLE.ARROW_LEFT': return year - 1 // L2011
    case 'TABLE.ARROW_RIGHT': return year + 1 // L2018
    case 'TABLE.HOME': return year - (year % 3) // L2025
    case 'TABLE.END': return year + 2 - (year % 3) // L2034
    case 'TABLE.PAGE_UP': return year - YEAR_CHUNK // L2043
    case 'TABLE.PAGE_DOWN': return year + YEAR_CHUNK // L2052
    default: return year
  }
}
// Shared source updateCalendarIfVisible behavior for typed drafts and changed peer bounds.
function reconcileVisibleCalendar(params: Params<DatePickerSchema>, inputValue: string, inputIndex?: number) {
  const { context, prop, scope, action, state } = params
  if (!state.matches('open'))
    return
  const inputDate = parseDateString(inputValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
  if (!inputDate)
    return
  // `updateCalendarIfVisible` calls `renderCalendar` for every adjusted typed input. That replacement
  // discards the old DOM-only hover fill, so a retained preview cannot override the new focus.
  context.set('hoveredValue', null)
  const index = inputIndex ?? context.get('activeIndex')
  const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
  context.set('focusedValue', keepDateBetweenMinAndMax(inputDate, bounds.min, bounds.max))
  // `updateCalendarIfVisible` calls `renderCalendar` (L977), which ALWAYS renders the DAY grid — so typing
  // while the month/year PICKER is showing switches back to the day view.
  context.set('view', 'day')
  context.set('isOpeningRender', false)
  // When focus lives IN the calendar (not the input being typed), a BOUNDED re-center can hand the
  // focus-holding cell a now-disabled date — the browser blurs it → spurious INTERACT_OUTSIDE close. USWDS
  // stays open (`renderCalendar` swaps the grid without emitting focusout, L1364→977), so recover the same
  // way the nav focus-fallback does: raf-refocus the (re-centered) focused cell. Never steals focus from
  // the external input — the guard fires only when focus was already inside the content.
  const contentEl = dom.getContentEl(scope)
  const active = scope.getActiveElement()
  if (contentEl && active && contentEl.contains(active)) {
    action(['focusActiveCell'])
  }
}

export const machine = createMachine<DatePickerSchema>({
  // Defaults: `selectionMode: "single"`; `min` defaults to `0000-01-01` (`single-index.js:100`; = `setDate(0,0,1)`,
  // identical to `parseDateString("0000-01-01")`) so open-time `keepDateBetweenMinAndMax` always has a lower bound.
  // Placed AFTER the spread so undefined keys can't clobber the defaults.
  props({ props }) {
    // Normalize the consumer's raw `min`/`max` (`new Date(y,m,d)` = local midnight) through `setDate` so they
    // share the internal epoch-offset and boundary cells don't mis-clamp (see `normalizeDate`). Default `0000-01-01`.
    const min = props.min ? normalizeDate(props.min) : setDate(0, 0, 1)
    const max = props.max ? normalizeDate(props.max) : undefined
    // min > max — PORT of the original's OBSERVABLE guard: `getDatePickerContext`
    // throws "Minimum date cannot be after maximum date" on every event when BOTH bounds are provided and
    // min > max (`single-index.js:701-703`). Headless analog: throw at props-normalization (runs at machine
    // start), so an invalid config surfaces immediately instead of silently mis-clamping. Guarded to
    // `props.min && props.max` (both consumer-provided, mirroring `minDate && maxDate` from the datasets) so the
    // default `0000-01-01` min never trips it.
    if (props.min && props.max && max && min.getTime() > max.getTime())
      throw new Error('Minimum date cannot be after maximum date')
    return {
      ...props,
      selectionMode: props.selectionMode || 'single',
      min,
      max,
      defaultDate: props.defaultDate ? normalizeDate(props.defaultDate) : undefined,
      rangeAnchor: props.rangeAnchor ? normalizeDate(props.rangeAnchor) : undefined,
    }
  },

  // Calendar starts CLOSED (USWDS enhances with `hidden` L938; deliberately no `defaultOpen`/`inline` props —
  // USWDS has no such surface to port).
  initialState() {
    return 'idle'
  },

  refs() {
    return {
      /** Pending focus restore, cancelled on close and machine disposal. */
      focusRafCleanup: null,
      nativeSyncRafCleanup: new Set<VoidFunction>(),
      acceptedSyncCleanup: null,
    }
  },

  exit: ['cancelFocusRaf', 'cancelNativeSyncRaf'],

  computed: {
    // The active calendar's bounds; individually typed fields use their own index.
    activeBounds: ({ context, prop }) => getEffectiveDateBounds(
      prop('selectionMode') === 'range',
      context.get('activeIndex'),
      context.get('value'),
      prop('min'),
      prop('max'),
    ),
    navigation: ({ context, computed }) => {
      const bounds = computed('activeBounds')
      return getNavigationAvailability(context.get('focusedValue'), context.get('focusedYear'), bounds.min, bounds.max)
    },
  },

  context({ prop, bindable }) {
    return {
      // Normalize incoming raw Dates (see `normalizeDate`) so selection/focus comparisons stay Y/M/D-consistent
      // with the grid cells.
      // RANGE slots may be `undefined` (typed entry commits each field independently, range-index.js). `Array.from`
      // makes a sparse consumer array explicit, so each empty slot hashes/serializes to `''` like the blanked input.
      value: bindable<(DateValue | undefined)[]>(() => {
        const controlledValue = prop('value')
        return {
          defaultValue: Array.from(prop('defaultValue') ?? [], d => (d ? normalizeDate(d) : undefined)),
          value: controlledValue ? Array.from(controlledValue, d => (d ? normalizeDate(d) : undefined)) : undefined,
          isEqual: isDateArrayEqual,
          hash: v => v.map(d => (d ? formatDate(d) : '')).join(','),
          // Explicit native transactions read accepted state in the same action as the write.
          sync: true,
        }
      }),
      focusedValue: bindable<DateValue>(() => ({
        defaultValue: normalizeDate(prop('defaultFocusedValue') ?? today()),
        value: prop('focusedValue') ? normalizeDate(prop('focusedValue')!) : undefined,
        isEqual: isDateEqual,
        // Same-task read/write navigation needs the current roving date (`react.staleness.test.ts`).
        sync: true,
      })),
      // No `view`/`defaultView` props: the view always starts (and re-opens, `resetView`) on the day grid.
      view: bindable<DateView>(() => ({
        defaultValue: 'day',
        // `onViewChange` (NET-NEW; observable: month/year navigation) is wired HERE — anchored to the
        // `view` bindable so it fires exactly once per COMMITTED view change (a set to the same view is a no-op).
        onChange(view) {
          prop('onViewChange')?.({ view })
        },
      })),
      hoveredValue: bindable<DateValue | null>(() => ({
        defaultValue: null,
        isEqual: isDateEqual,
      })),
      activeIndex: bindable<0 | 1>(() => ({ defaultValue: 0, sync: true })),
      inputValues: bindable<string[]>(() => ({
        defaultValue: [],
        // A two-endpoint transaction can write both visible inputs in one task.
        sync: true,
      })),
      // true right after open → status announces the nav-help (`calendarWasHidden` L1209); nav clears it.
      isOpeningRender: bindable<boolean>(() => ({
        defaultValue: false,
      })),
      // Year-view roving focused year (set on entry / chunk nav; only meaningful while `view === "year"`).
      focusedYear: bindable<number>(() => ({
        defaultValue: 0,
        // Same-task year navigation reads the preceding roving year (`react.staleness.test.ts`).
        sync: true,
      })),
      // Month-view roving focused month (analogous to `focusedYear`): keyboard nav moves it
      // independently of the anchor. Set on entering the month view.
      focusedMonth: bindable<number>(() => ({
        defaultValue: 0,
        // Same-task month navigation reads the preceding roving month (`react.staleness.test.ts`).
        sync: true,
      })),
    }
  },

  // Initialization mirrors the tagged enhancement: an authored visible value is cleared without a change
  // event, then an accepted default/controlled selection initializes both input carriers. Late-mounted
  // framework inputs use the same bridge as soon as they mount, before an input event can occur.
  effects: ['bridgeMountedInputs'],

  watch({ track, prop, action, send }) {
    track([() => prop('value')?.map(date => date ? formatDate(date) : '').join(',')], () => {
      action(['syncInputElement'])
    })
    // range-index.js:81/105 refreshes the peer's visible calendar after reciprocal
    // bounds/anchor updates, without changing that peer's selected value.
    track([() => prop('min').getTime(), () => prop('max')?.getTime(), () => prop('rangeAnchor')?.getTime()], () => {
      send({ type: 'BOUNDS.CHANGE' })
    })
  },

  // NET-NEW programmatic setter (no USWDS binding), accepted in either state like Zag's global `VALUE.SET`
  // (zag `date-picker.machine.ts:278-281`).
  on: {
    'VALUE.SET': {
      actions: ['setDateValue'],
    },
    // Like Zag, typed input is handled in either state; only an open calendar re-centers.
    'INPUT.CHANGE': { actions: ['commitInputValue', 'reconcileCalendar'] },
  },

  states: {
    idle: {
      on: {
        // `toggleCalendar` open path (L1346): reset to day view, center on the selected date (or today), clamped
        // to [min,max] (L1347), then raf-focus the focused cell (open-state `entry`). Guard `isInteractive` ports
        // the disabled/aria-disabled early-return (L1342).
        'TRIGGER.CLICK': {
          target: 'open',
          guard: 'isInteractive',
          actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'invokeOnOpenChange'],
        },
        'OPEN': {
          target: 'open',
          guard: 'isInteractive',
          actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'invokeOnOpenChange'],
        },
        // Escape is bound on the DATE_PICKER root unconditionally (L2232) → `handleEscapeFromCalendar` focuses the
        // EXTERNAL input even when already closed (L1731). No state change.
        'TABLE.ESCAPE': {
          actions: ['focusInputElement'],
        },
      },
    },

    open: {
      effects: ['trackDismissableElement'],
      // A close invalidates opening/nav focus.
      // Transition actions that intentionally restore the external input run after
      // this exit and schedule their own fresh focus frame.
      exit: ['cancelFocusRaf'],
      // `toggleCalendar` focuses `CALENDAR_DATE_FOCUSED` after render (L1353) — raf-wrapped physical `.focus()`.
      entry: ['focusActiveCell'],
      on: {
        // Day-cell select (`__date` CLICK L2122 → `selectDate` L1324): explicit actions own callback/native
        // transactions, close (`hideCalendar` L1311), and external-input focus (L1333).
        'CELL.CLICK': [
          // Month/year picker: commit the picked month/year into focusedValue, drop back to the DAY grid
          // (`selectMonth` L1455 / `selectYear` L1707 → `renderCalendar`), then raf-focus the focused day cell.
          {
            guard: 'isSelectableViewCell',
            actions: ['setFocusedValueForView', 'resetView', 'focusActiveCell'],
          },
          // Day selection commits the active endpoint, closes, and restores its session input.
          {
            target: 'idle',
            guard: 'isSelectableDate',
            actions: ['setSelectedDate', 'focusInputElement', 'invokeOnOpenChange'],
          },
        ],
        // Range hovered-range preview (`handleMouseoverFromDate` L1841): active only while choosing the 2nd endpoint
        // (`value.length === 1` — start committed, end pending; USWDS reads the end picker's own empty value).
        // The connect getter sends this on hover-capable pointer events.
        'CELL.POINTER_MOVE': { guard: 'isChoosingRangeEnd', actions: ['setHoveredDate'] },
        // View switch (month-selection L2149 → month; year-selection L2153 → year), then focus the focused view cell.
        'VIEW.SET': { actions: ['setView', 'focusActiveCell'] },
        'BOUNDS.CHANGE': { actions: ['refreshCalendarBounds'] },
        // Keyboard grid nav — one action branches by view (`adjustCalendar`/`adjust*SelectionScreen`). `preventDefault`
        // is in connect (always); the boundary no-op is INSIDE `keyboardNav` (move + focus only if the clamped target
        // changed, L1753/1891/1982).
        'TABLE.ARROW_LEFT': { actions: ['keyboardNav'] },
        'TABLE.ARROW_RIGHT': { actions: ['keyboardNav'] },
        'TABLE.ARROW_UP': { actions: ['keyboardNav'] },
        'TABLE.ARROW_DOWN': { actions: ['keyboardNav'] },
        'TABLE.HOME': { actions: ['keyboardNav'] },
        'TABLE.END': { actions: ['keyboardNav'] },
        'TABLE.PAGE_UP': { actions: ['keyboardNav'] },
        'TABLE.PAGE_DOWN': { actions: ['keyboardNav'] },
        'GOTO.PREV': { guard: 'canGoPrev', actions: ['applyNav', 'clearHoveredDate', 'focusNavTrigger'] },
        'GOTO.NEXT': { guard: 'canGoNext', actions: ['applyNav', 'clearHoveredDate', 'focusNavTrigger'] },
        // `toggleCalendar` close path (L1355 → `hideCalendar` L1311). `data-state`/`hidden` derive from state in connect.
        'TRIGGER.CLICK': [
          {
            guard: 'isDifferentActiveIndex',
            actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'focusActiveCell'],
          },
          {
            target: 'idle',
            guard: 'isInteractive',
            actions: ['invokeOnOpenChange'],
          },
        ],
        'OPEN': {
          guard: 'isDifferentActiveIndex',
          actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'focusActiveCell'],
        },
        'CLOSE': {
          target: 'idle',
          actions: ['invokeOnOpenChange'],
        },
        // Focusout leaving the whole component (`!contains(relatedTarget)` L2244) → `hideCalendar`. USWDS restores
        // NO focus on this path (only Escape and select restore focus) — close only.
        'INTERACT_OUTSIDE': {
          target: 'idle',
          actions: ['invokeOnOpenChange'],
        },
        // Escape (L1727): `hideCalendar` + focus EXTERNAL input (L1731) + `preventDefault` (in connect).
        'TABLE.ESCAPE': {
          target: 'idle',
          actions: ['focusInputElement', 'invokeOnOpenChange'],
        },
      },
    },
  },

  implementations: {
    guards: {
      // `disable()` L755 + `ariaDisable()` L767 (aria-disable maps to the `readOnly` prop).
      isInteractive: ({ prop }) => !prop('disabled') && !prop('readOnly'),
      // A second endpoint trigger switches the shared calendar without closing it.
      isDifferentActiveIndex: ({ context, prop, event }) =>
        !prop('disabled') && !prop('readOnly') && (event.type === 'TRIGGER.CLICK' || event.type === 'OPEN')
        && prop('selectionMode') === 'range'
        && event.index !== undefined
        && event.index !== context.get('activeIndex'),
      // `selectDate` early-returns on a disabled cell (L1325); a selectable date is within [min,max].
      isSelectableDate: ({ computed, event }) => {
        if (!event.value)
          return false
        const bounds = computed('activeBounds')
        return isDateWithinMinAndMax(event.value, bounds.min, bounds.max)
      },
      // The prev/next buttons are disabled at the min/max month (`prevButtonsDisabled`/`nextButtonsDisabled`
      // L1005-1006) — nav is allowed only when the button is enabled (ports the `if(_buttonEl.disabled) return`).
      canGoPrev: ({ computed, event }) => event.unit === 'chunk' ? computed('navigation').canChunkPrev : computed('navigation').canGoPrev,
      canGoNext: ({ computed, event }) => event.unit === 'chunk' ? computed('navigation').canChunkNext : computed('navigation').canGoNext,
      // Ports `selectMonth`/`selectYear` `if (el.disabled) return` (L1456/1708) as a machine guard,
      // not just native `disabled`. `event.value` is the UNCLAMPED target month/year date.
      isSelectableViewCell: ({ context, computed, event }) => {
        const view = context.get('view')
        if (view === 'day' || !event.value)
          return false
        const bounds = computed('activeBounds')
        if (view === 'month')
          return !isDatesMonthOutsideMinOrMax(event.value, bounds.min, bounds.max)
        return !isDatesYearOutsideMinOrMax(event.value, bounds.min, bounds.max)
      },
      // Hovered-range preview is active while choosing the consolidated range end, and on a blank independent
      // source-range endpoint with a peer `rangeAnchor` (`handleMouseoverFromDate` L1841-1867).
      isChoosingRangeEnd: ({ context, prop }) =>
        (prop('selectionMode') === 'range' && context.get('activeIndex') === 1 && Boolean(context.get('value')[0]) && !context.get('value')[1])
        || (prop('selectionMode') === 'single' && Boolean(prop('rangeAnchor')) && context.get('value').length === 0),
    },

    actions: {
      // Calendar commits are source-shaped action transactions. The controlled
      // proposal is reported separately; DOM writes use the accepted read-back.
      setSelectedDate(params) {
        const { context, event } = params
        if (event.type !== 'CELL.CLICK' || !event.value)
          return
        const date = normalizeDate(event.value)
        const activeIndex = context.get('activeIndex')
        const isRange = params.prop('selectionMode') === 'range'
        const index = isRange ? activeIndex : 0
        // Selecting one range endpoint preserves the committed sibling, including end-only ranges.
        const next = isRange ? setRangeEndpoint(context.get('value'), index, date) : [date]
        context.set('value', next)
        emitValueChange(params, next)
        scheduleCalendarInputs(params, [index])
        if (isRange)
          context.set('hoveredValue', null)
      },
      setDateValue(params) {
        const { context, prop, event } = params
        if (event.type !== 'VALUE.SET')
          return
        const value = Array.from(event.value, date => (date ? normalizeDate(date) : undefined))
        context.set('value', value)
        emitValueChange(params, value)
        scheduleCalendarInputs(params, prop('selectionMode') === 'range' ? [0, 1] : [0])
      },

      setHoveredDate({ context, event }) {
        if (event.value)
          context.set('hoveredValue', normalizeDate(event.value))
      },
      clearHoveredDate({ context }) {
        context.set('hoveredValue', null)
      },

      syncInputElement({ context, prop, scope, refs }) {
        refs.get('acceptedSyncCleanup')?.()
        const win = scope.getWin()
        let live = true
        const id = win.requestAnimationFrame(() => {
          if (!live)
            return
          refs.set('acceptedSyncCleanup', null)
          // Explicit transactions own their unconditional events. If an accepted prop update
          // accompanies one, reconcile only after those earlier queued transactions finish.
          const value = context.get('value')
          // Index 1 is a no-op for a single picker without a second input.
          syncOneInput(scope, context, 0, value[0], prop('min'), prop('max'))
          syncOneInput(scope, context, 1, value[1], prop('min'), prop('max'))
        })
        refs.set('acceptedSyncCleanup', () => {
          live = false
          win.cancelAnimationFrame(id)
        })
      },
      // `toggleCalendar` L1347-1352: `keepDateBetweenMinAndMax(inputDate || defaultDate || today(), min, max)`.
      // Center on `inputDate` = the ADJUSTED parse of the EXTERNAL input (L1348), NOT the committed value —
      // so typing garbage then opening centers on the parsed/adjusted input, not the last committed date.
      setFocusedValueOnOpen({ context, prop, scope, event }) {
        const value = context.get('value')
        const index = (event.type === 'TRIGGER.CLICK' || event.type === 'OPEN') && isEndpointIndex(event.index) ? event.index : 0
        context.set('activeIndex', index)
        const externalEl = dom.getExternalInputEl(scope, index)
        const inputDate = externalEl
          ? parseDateString(externalEl.value, DEFAULT_EXTERNAL_DATE_FORMAT, true)
          : undefined
        const isRange = prop('selectionMode') === 'range'
        const fallback = isRange ? value[index] ?? value[1 - index] : externalEl ? undefined : value[index]
        const candidate = inputDate ?? fallback ?? prop('defaultDate') ?? today()
        const bounds = getEffectiveDateBounds(isRange, index, value, prop('min'), prop('max'))
        context.set('focusedValue', keepDateBetweenMinAndMax(candidate, bounds.min, bounds.max))
      },

      // Typed reconciliation preserves the raw external draft, commits only that endpoint's ISO slot, and sends
      // its explicit callback/conditional hidden-input transaction. Range peer updates tighten bounds only
      // (`range-index.js:65-105`), so an invalid end below start reconciles to empty without changing start.
      commitInputValue(params) {
        const { context, prop, scope, event } = params
        const index = isEndpointIndex(event.index) ? event.index : 0
        const nextTexts = [...context.get('inputValues')]
        nextTexts[index] = event.value
        context.set('inputValues', nextTexts)
        const current = context.get('value')
        const isRange = prop('selectionMode') === 'range'
        const bounds = getEffectiveDateBounds(isRange, index, current, prop('min'), prop('max'))
        const nextInternal = reconcileInputValues(event.value, bounds.min, bounds.max)
        const parsed = nextInternal ? parseDateString(nextInternal) : undefined
        // MERGE into the typed field's pair slot; trailing empty slots trim away, so single mode stays [parsed]/[]
        // and a cleared range end returns to [start]. A cleared start with a committed end keeps [undefined, end]
        // (the original's start picker blanks while the end picker's value stands, range-index L75-78).
        const next = isRange
          ? setRangeEndpoint(current, index, parsed)
          : parsed ? [parsed] : []
        // WRITE-IF-CHANGED — mirror `reconcileInputValues`' `internalInputEl.value !== newValue` guard (L866): a
        // no-op reconcile (invalid-from-empty, or re-typing the already-committed date) must NOT re-commit, so it
        // doesn't spuriously re-fire the value bindable's `onValueChange`. Genuine changes (incl. clearing a
        // committed slot) still commit — the slot comparison only suppresses true no-ops.
        if (isDateArrayEqual(current, next)) {
          return
        }
        context.set('value', next)
        emitValueChange(params, next)
        // A controlled parent may reject this proposal. Only the accepted slot may
        // reach the native ISO mirror; raw external typing is never reformatted.
        const accepted = context.get('value')[index]
        const acceptedInternal = accepted ? formatDate(accepted, INTERNAL_DATE_FORMAT) : ''
        if (acceptedInternal === nextInternal) {
          const hiddenEl = dom.getHiddenInputEl(scope, index)
          if (hiddenEl && hiddenEl.value !== acceptedInternal)
            dom.changeElementValue(hiddenEl, acceptedInternal)
        }
      },

      // `updateCalendarIfVisible` L1364: re-center the OPEN calendar on the adjusted external parse. Clear
      // `isOpeningRender` so the status is the month/year string, not the first-open nav-help. (Only in the day
      // view — typing is external-only; month/year views have no input.)
      reconcileCalendar(params) {
        reconcileVisibleCalendar(params, params.event.value, params.event.index)
      },
      refreshCalendarBounds(params) {
        const { scope, context } = params
        const index = context.get('activeIndex')
        const input = dom.getExternalInputEl(scope, index)
        // A blank/unparseable source peer is not refreshed, and a closed peer remains closed.
        if (input)
          reconcileVisibleCalendar(params, input.value, index)
      },

      // Every source open/reopen starts on the day grid (`renderCalendar` L977).
      resetView({ context }) {
        context.set('view', 'day')
      },

      // The just-opened render announces the nav-help block (`calendarWasHidden` L1209).
      markOpeningRender({ context }) {
        context.set('isOpeningRender', true)
      },

      // Month/year controls move the day anchor; chunks move only the year view's roving cell.
      applyNav({ context, computed, event }) {
        const bounds = computed('activeBounds')
        const step = event.type === 'GOTO.PREV' ? -1 : 1
        const anchor = context.get('focusedValue')
        const target = event.unit === 'chunk'
          ? setYear(anchor, Math.max(0, context.get('focusedYear') + step * YEAR_CHUNK))
          : event.unit === 'year' ? addYears(anchor, step) : addMonths(anchor, step)
        const capped = keepDateBetweenMinAndMax(target, bounds.min, bounds.max)
        if (event.unit === 'chunk')
          context.set('focusedYear', capped.getFullYear())
        else
          context.set('focusedValue', capped)
        context.set('isOpeningRender', false)
      },

      // Retain the clicked navigation button after rendering; disabled buttons fall back to the
      // day controls or year view (`single-index.js:1240-1243/1665-1668`).
      focusNavTrigger({ scope, event, refs }) {
        const direction = event.type === 'GOTO.PREV' ? 'prev' : 'next'
        scheduleFocusFrame({ scope, refs }, () => {
          const btn = dom.getNavTriggerEl(scope, direction, event.unit ?? 'month')
          if (btn && !btn.disabled)
            btn.focus()
          else (event.unit === 'chunk' ? dom.getYearViewEl(scope) : dom.getViewControlEl(scope))?.focus()
        })
      },

      // View switch (month/year-selection trigger). Clear `isOpeningRender` so the status is the view string
      // ("Select a month." / "Showing years…"), NOT the first-open nav-help. Entering the year view seeds the roving
      // `focusedYear` from the anchor (`focusedYear = selectedYear` on entry, L1482).
      setView({ context, event }) {
        if (event.view) {
          // `displayMonthSelection`/`displayYearSelection` replace the calendar node. A preview belongs only
          // to the previous day-grid DOM, never to the view history.
          context.set('hoveredValue', null)
          context.set('view', event.view)
          context.set('isOpeningRender', false)
          const anchor = context.get('focusedValue')
          if (event.view === 'year')
            context.set('focusedYear', anchor.getFullYear())
          if (event.view === 'month')
            context.set('focusedMonth', anchor.getMonth())
        }
      },

      // Month/year cell picked (`selectMonth` L1460 / `selectYear` L1712): clamp the target (`event.value` is the
      // UNCLAMPED month/year date) into `focusedValue`. `isOpeningRender` cleared (while-open re-render).
      setFocusedValueForView({ context, computed, event }) {
        if (event.value) {
          const bounds = computed('activeBounds')
          context.set('focusedValue', keepDateBetweenMinAndMax(event.value, bounds.min, bounds.max))
          context.set('isOpeningRender', false)
          context.set('hoveredValue', null)
        }
      },

      // `adjustCalendar` (L1752) clamps against the active endpoint's cross-synced bounds. Boundary
      // no-ops preserve hover, announcement and focus; real moves update only the view's roving value.
      keyboardNav({ context, computed, event, action }) {
        const bounds = computed('activeBounds')
        const view = context.get('view')
        const focusedValue = context.get('focusedValue')
        let moved = false
        if (view === 'month') {
          const month = context.get('focusedMonth')
          const currentDate = setMonth(focusedValue, month)
          const adjusted = Math.max(0, Math.min(11, monthKeyTarget(event.type, month)))
          const capped = keepDateBetweenMinAndMax(setMonth(focusedValue, adjusted), bounds.min, bounds.max)
          if (!isSameMonth(currentDate, capped)) {
            context.set('focusedMonth', capped.getMonth())
            moved = true
          }
        }
        else if (view === 'year') {
          const year = context.get('focusedYear')
          const currentDate = setYear(focusedValue, year)
          const adjusted = Math.max(0, yearKeyTarget(event.type, year))
          const capped = keepDateBetweenMinAndMax(setYear(focusedValue, adjusted), bounds.min, bounds.max)
          if (!isSameYear(currentDate, capped)) {
            context.set('focusedYear', capped.getFullYear())
            moved = true
          }
        }
        else {
          const capped = keepDateBetweenMinAndMax(dayKeyTarget(event.type, focusedValue, event.larger), bounds.min, bounds.max)
          if (!isSameDay(focusedValue, capped)) {
            context.set('focusedValue', capped)
            moved = true
          }
        }
        if (moved) {
          context.set('isOpeningRender', false)
          context.set('hoveredValue', null)
          action(['focusActiveCell'])
        }
      },

      // NET-NEW callback (USWDS has no open-change callback). Transition actions run AFTER the state bindable
      // commits (@zag-js/vanilla), so `state.matches("open")` reflects the NEW state → one action reports the
      // correct boolean on BOTH open and close.
      invokeOnOpenChange({ prop, state }) {
        prop('onOpenChange')?.({ open: state.matches('open') })
      },

      // Physical focus stays physical + `raf()`-wrapped — deferred to after the consumer paints
      // the (re)rendered DOM. Escape/select restore focus to the EXTERNAL input (L1731/L1333).
      focusInputElement({ scope, refs, context, prop }) {
        scheduleFocusFrame({ scope, refs }, () => {
          const index = prop('selectionMode') === 'range' ? context.get('activeIndex') : 0
          dom.getExternalInputEl(scope, index)?.focus()
        })
      },

      // Open focuses the roving-tabindex focused day cell (L1353). No-op if no cell is rendered yet.
      focusActiveCell({ scope, refs, context }) {
        scheduleFocusFrame({ scope, refs }, () => {
          dom.getFocusedCell(scope, context.get('view'))?.focus()
        })
      },

      cancelFocusRaf({ refs }) {
        refs.get('focusRafCleanup')?.()
        refs.set('focusRafCleanup', null)
      },
      cancelNativeSyncRaf({ refs }) {
        refs.get('nativeSyncRafCleanup').forEach(cleanup => cleanup())
        refs.get('nativeSyncRafCleanup').clear()
        refs.get('acceptedSyncCleanup')?.()
        refs.set('acceptedSyncCleanup', null)
      },
    },

    effects: {
      bridgeMountedInputs({ scope, context, prop }) {
        return dom.observeInitialInputs(scope, prop('selectionMode') === 'range' ? 2 : 1, (element, index, internal) => {
          const value = context.get('value')[index]
          const text = value ? formatDate(value, internal ? INTERNAL_DATE_FORMAT : DEFAULT_EXTERNAL_DATE_FORMAT) : ''
          if (value)
            dom.changeElementValue(element, text)
          else if (element.value)
            element.value = ''
          if (!internal)
            rememberVisibleInput(context, index, text)
          if (value && !internal) {
            const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
            dom.applyDateInputValidity(element, text, bounds.min, bounds.max)
          }
        })
      },
      trackDismissableElement({ scope, send }) {
        return trackDismissableElement(() => dom.getContentEl(scope), {
          type: 'popover',
          // Mount immediately for authored content so sibling pickers close before a
          // second trigger's click opens its layer. Defer only for conditional mounts.
          defer: !dom.getContentEl(scope),
          // Inputs and triggers sit outside content but inside the picker root.
          exclude: () => dom.getRootEl(scope),
          onEscapeKeyDown(event) {
            event.preventDefault()
            send({ type: 'TABLE.ESCAPE' })
          },
          onDismiss() {
            send({ type: 'INTERACT_OUTSIDE' })
          },
        })
      },
    },
  },
})
