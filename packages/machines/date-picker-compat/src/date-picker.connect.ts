import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type {
  DatePickerApi,
  DatePickerEvent,
  DatePickerService,
  DateValue,
  DayTableCellProps,
  InputProps,
  MonthTableCellProps,
  NavigationUnit,
  TableHeaderProps,
  TriggerProps,
  WeekDay,
  YearTableCellProps,
} from './date-picker.types'
import { ariaAttr, dataAttr, getEventKey, getTabbables } from '@zag-js/dom-query'
import { chunk } from '@zag-js/utils'
import { parts, rangeParts } from './date-picker.anatomy'
import * as dom from './date-picker.dom'
import {
  formatDate,
  getEffectiveDateBounds,
  getMonthLabels,
  getVisibleDays,
  getWeekdayLabels,
  getWeekdayNarrow,
  isDateInputInvalid,
  isDatesMonthOutsideMinOrMax,
  isDatesYearOutsideMinOrMax,
  isDateWithinMinAndMax,
  isEndpointIndex,
  isSameDay,
  isSameMonth,
  setMonth,
  setRangeDates,
  setYear,
  today,
  YEAR_CHUNK,
} from './date-picker.utils'

const GRID_KEYS: Record<string, DatePickerEvent> = {
  ArrowUp: { type: 'TABLE.ARROW_UP' },
  ArrowDown: { type: 'TABLE.ARROW_DOWN' },
  ArrowLeft: { type: 'TABLE.ARROW_LEFT' },
  ArrowRight: { type: 'TABLE.ARROW_RIGHT' },
  Home: { type: 'TABLE.HOME' },
  End: { type: 'TABLE.END' },
  PageUp: { type: 'TABLE.PAGE_UP' },
  PageDown: { type: 'TABLE.PAGE_DOWN' },
}

function gridKeyEvent(event: Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>, view: 'day' | 'month' | 'year'): DatePickerEvent | null {
  if (event.altKey || event.ctrlKey || event.metaKey)
    return null
  const key = getEventKey(event)
  if (event.shiftKey) {
    if (view === 'day' && key === 'PageUp')
      return { type: 'TABLE.PAGE_UP', larger: true }
    if (view === 'day' && key === 'PageDown')
      return { type: 'TABLE.PAGE_DOWN', larger: true }
    return null
  }
  return GRID_KEYS[key] ?? null
}

export function connect<T extends PropTypes>(
  service: DatePickerService,
  normalize: NormalizeProps<T>,
): DatePickerApi<T> {
  const { state, prop, send, scope, context, computed } = service

  const open = state.matches('open')
  const disabled = Boolean(prop('disabled'))
  const readOnly = Boolean(prop('readOnly'))

  const view = context.get('view')
  const selectionMode = prop('selectionMode')
  const isRange = selectionMode === 'range'
  const activeIndex = context.get('activeIndex')
  const hoveredValue = context.get('hoveredValue')
  const selectedValue = context.get('value')
  const selectedDate = selectedValue[0] // single value / range start
  const activeSelectedDate = selectedValue[activeIndex]
  const focusedValue = context.get('focusedValue')
  const isOpeningRender = context.get('isOpeningRender')
  const min = prop('min')
  const max = prop('max')
  const todaysDate = today()

  // Active endpoint bounds replace `range-index.js`'s dataset cross-sync; single mode uses prop bounds.
  const effectiveBounds = computed('activeBounds')
  const { min: effMin, max: effMax } = effectiveBounds

  // `data-range-date` is independent of this picker's selection; an authored peer anchor wins (`setRangeDates` L470).
  const rangeAnchor = prop('rangeAnchor') ?? (isRange ? selectedValue[0] : undefined)
  // Source `renderCalendar` uses selection or display date for the range conclusion (L1013); hover changes only fill.
  const rangeConclusion = selectedValue.length === 2
    ? selectedValue[1] ?? focusedValue
    : selectedValue[0] ?? focusedValue
  const committedBounds = rangeAnchor ? setRangeDates(rangeConclusion, rangeAnchor) : undefined
  // Fill previews against hover or focused date while choosing the end; focus is the render fallback (L1013).
  const withinOther
    = prop('rangeAnchor')
      ? selectedValue[0] ?? hoveredValue ?? focusedValue
      : selectedValue.length === 2
        ? selectedValue[1]
        : selectedValue.length === 1
          ? (hoveredValue ?? focusedValue)
          : focusedValue
  const withinBounds = rangeAnchor && withinOther ? setRangeDates(rangeAnchor, withinOther) : undefined

  // Month/year selected cells follow the anchor; roving cells and year chunks move independently (L1383/L1477).
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const rovingYear = context.get('focusedYear')
  const rovingMonth = context.get('focusedMonth')
  const navigation = computed('navigation')
  const { yearChunkStart } = navigation
  const years: number[] = []
  for (let y = yearChunkStart; y < yearChunkStart + YEAR_CHUNK; y += 1) years.push(y)

  // Locale labels — USWDS reads `document.documentElement.lang || "en"` (L705); `locale` prop overrides (net-new).
  const locale = prop('locale') ?? (scope.getDoc().documentElement.lang || 'en')
  const monthLabels = getMonthLabels(locale)
  const weekdayLabels = getWeekdayLabels(locale)
  const weekdayNarrow = getWeekdayNarrow(locale)

  const focusedMonthName = monthLabels[focusedValue.getMonth()] ?? ''
  const focusedYear = focusedValue.getFullYear()

  // Navigation and disabled cells share the active endpoint bounds (`range-index.js` L72/L96).

  const weeks = chunk(getVisibleDays(focusedValue), 7)
  const weekDays: WeekDay[] = weekdayNarrow.map((narrow, i) => ({ narrow, long: weekdayLabels[i] ?? '' }))

  // Selection belongs to the anchor; tabindex follows roving focus. Keep explicit aria-selected="false"
  // and send the unclamped target; the machine guards and clamps month/year selection (L1455/L1707).
  function getSelectionCellProps(view: 'month' | 'year', value: number, date: DateValue, selected: boolean, focused: boolean, cellDisabled: boolean) {
    return normalize.button({
      ...parts.tableCellTrigger.attrs,
      'dir': prop('dir'),
      'type': 'button',
      'data-view': view,
      'data-value': value,
      ...(view === 'month' ? { 'data-label': monthLabels[value] ?? '' } : {}),
      'aria-selected': selected ? 'true' : 'false',
      'tabIndex': focused ? 0 : -1,
      'disabled': cellDisabled,
      'data-selected': dataAttr(selected),
      'data-focus': dataAttr(focused),
      onClick() {
        send({ type: 'CELL.CLICK', value: date })
      },
      onKeyDown(event) {
        const next = gridKeyEvent(event, view)
        if (next) {
          event.preventDefault()
          send(next)
        }
      },
    })
  }

  // Status live-region. `""` when closed (`hideCalendar` clears it, L1316). Per view:
  //   • month view → "Select a month." (L1445)
  //   • year view  → "Showing years {chunkStart} to {chunkStart+11}. Select a year." (L1636)
  //   • day view   → "Selected date" (when focused==selected) + nav-help on the opening render (L1209) else
  //                  "{month} {year}" (L1217/1219).
  let srStatusText = ''
  if (open && view === 'month') {
    srStatusText = 'Select a month.'
  }
  else if (open && view === 'year') {
    // The original uses Sanitizer.escapeHTML for this interpolation. That helper turns a numeric zero into an
    // empty string (`value || ""`), so the first chunk literally announces "Showing years  to 11.".
    const sourceYearChunkStart = yearChunkStart === 0 ? '' : String(yearChunkStart)
    srStatusText = `Showing years ${sourceYearChunkStart} to ${yearChunkStart + YEAR_CHUNK - 1}. Select a year.`
  }
  else if (open) {
    const statuses: string[] = []
    if (isSameDay(activeSelectedDate, focusedValue))
      statuses.push('Selected date')
    if (isOpeningRender) {
      statuses.push(
        'You can navigate by day using left and right arrows',
        'Weeks by using up and down arrows',
        'Months by using page up and page down keys',
        'Years by using shift plus page up and shift plus page down',
        'Home and end keys navigate to the beginning and end of a week',
      )
    }
    else {
      statuses.push(`${focusedMonthName} ${focusedYear}`)
    }
    srStatusText = statuses.join('. ')
  }

  function getNavigationProps(direction: 'prev' | 'next', unit: NavigationUnit = 'month') {
    const allowed = unit === 'chunk'
      ? direction === 'prev' ? navigation.canChunkPrev : navigation.canChunkNext
      : direction === 'prev' ? navigation.canGoPrev : navigation.canGoNext
    return normalize.button({
      ...parts[direction === 'prev' ? 'prevTrigger' : 'nextTrigger'].attrs,
      'data-unit': unit,
      'dir': prop('dir'),
      'type': 'button',
      'aria-label': `Navigate ${direction === 'prev' ? 'back' : 'forward'} ${unit === 'chunk' ? `${YEAR_CHUNK} years` : `one ${unit}`}`,
      'disabled': !allowed,
      onClick() {
        send({ type: direction === 'prev' ? 'GOTO.PREV' : 'GOTO.NEXT', unit })
      },
    })
  }

  return {
    open,
    view,
    focusedValue,
    weeks,
    weekDays,
    months,
    monthRows: chunk(months, 3),
    years,
    yearRows: chunk(years, 3),
    srStatusText,
    monthLabel: focusedMonthName,
    yearLabel: String(focusedYear),
    monthLabels,
    value: selectedValue,
    valueAsString: Array.from(selectedValue, d => (d ? formatDate(d) : '')),
    setValue(value) {
      send({ type: 'VALUE.SET', value })
    },
    clearValue() {
      send({ type: 'VALUE.SET', value: [] })
    },
    setOpen(nextOpen, index = 0) {
      // `open` is the renderer snapshot. Two imperative calls in one task must
      // reach the machine in order; otherwise `setOpen(true); setOpen(false)`
      // compares both calls against the old closed snapshot and drops the close.
      // The state chart naturally ignores a same-state OPEN/CLOSE event.
      send(nextOpen ? { type: 'OPEN', index } : { type: 'CLOSE' })
    },

    // Escape closes an open calendar and restores focus to the visible input.
    getRootProps() {
      return normalize.element({
        ...(isRange ? rangeParts.root.attrs : parts.root.attrs),
        'dir': prop('dir'),
        'id': dom.getRootId(scope),
        'data-state': open ? 'open' : 'closed',
        'data-disabled': dataAttr(disabled),
        'data-readonly': dataAttr(readOnly),
        onKeyDown(event) {
          if (!event.defaultPrevented && getEventKey(event) === 'Escape') {
            event.preventDefault()
            send({ type: 'TABLE.ESCAPE' })
          }
        },
      })
    },

    // Control `.usa-date-picker__wrapper` (L927).
    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
        id: dom.getControlId(scope),
      })
    },

    // EXTERNAL input — developer id/name, form-submit value `MM/DD/YYYY`.
    getInputProps(props: InputProps = {}) {
      const index = isEndpointIndex(props.index) ? props.index : 0
      // Each field validates against its own endpoint bounds, independent of activeIndex (`range-index.js` L72/L96).
      const inputBounds = getEffectiveDateBounds(isRange, index, selectedValue, min, max)
      const inputMin = inputBounds.min
      const inputMax = inputBounds.max
      const text = context.get('inputValues')[index] ?? ''
      const invalid = text !== '' && isDateInputInvalid(text, inputMin, inputMax)
      // DOM validity is scoped to this field; foreign messages remain intact.
      const validate = (el: HTMLInputElement) => {
        dom.applyDateInputValidity(el, el.value, inputMin, inputMax)
      }
      const rangeBoundsProps = isRange
        ? {
            min: formatDate(inputMin) !== '0000-01-01' ? formatDate(inputMin) : undefined,
            max: inputMax ? formatDate(inputMax) : undefined,
          }
        : {}
      return normalize.input({
        ...parts.input.attrs,
        'dir': prop('dir'),
        'id': dom.getInputId(scope, index),
        'name': props.name ?? prop('name'),
        ...rangeBoundsProps,
        'type': 'text',
        'required': prop('required'),
        'disabled': disabled,
        'readOnly': readOnly,
        'aria-disabled': ariaAttr(readOnly),
        // `data-index` is NET-NEW range two-input wiring (USWDS encodes the picker in the element id instead) —
        // emitted ONLY in range mode, so a single-mode input carries no spurious attribute vs the original.
        'data-index': isRange ? index : undefined,
        // NET-NEW data-driven invalidity for headless consumers: USWDS exposes this only through
        // `setCustomValidity` on blur/Enter, while the machine retains the raw text for continuous rendering.
        'data-invalid': dataAttr(invalid),
        'aria-invalid': ariaAttr(invalid),
        // `input` on external (L2251): `reconcileInputValues` (L858) writes THIS FIELD's INTERNAL ISO
        // (write-if-changed L866 + bubbling `change`), then `updateCalendarIfVisible` re-centers the open calendar
        // (machine). `index` rides the event so the commit merges into the typed field's pair slot (range typed
        // entry — each picker reconciles its own input, range-index.js).
        onInput(event) {
          const el = event.currentTarget as HTMLInputElement
          send({ type: 'INPUT.CHANGE', value: el.value, index })
        },
        // Enter validates the visible input, including when its text is still composing.
        onKeyDown(event) {
          if (getEventKey(event) === 'Enter')
            validate(event.currentTarget as HTMLInputElement)
        },
        // Blurring the external input validates it. The dismissable layer handles outside interaction.
        onBlur(event) {
          validate(event.currentTarget as HTMLInputElement)
        },
      })
    },

    // INTERNAL input — no id/name; ISO source-of-truth, non-submitting. `display:none` emitted INLINE +
    // `type="text"` (`enhanceDatePicker` L944/L929) — deliberately part of the emitted attributes (not left to
    // consumer CSS) so the at-rest DOM matches the original.
    getHiddenInputProps() {
      return normalize.input({
        ...parts.hiddenInput.attrs,
        'dir': prop('dir'),
        'type': 'text',
        'aria-hidden': true,
        'tabIndex': -1,
        'style': { display: 'none' },
      })
    },

    // Trigger `.usa-date-picker__button` (L937) → `toggleCalendar` (guarded by `isInteractive`).
    getTriggerProps(props: TriggerProps = {}) {
      const index = isEndpointIndex(props.index) ? props.index : 0
      const eventIndex = isEndpointIndex(props.index) ? props.index : undefined
      return normalize.button({
        ...parts.trigger.attrs,
        'dir': prop('dir'),
        'id': dom.getTriggerId(scope, index),
        'type': 'button',
        'aria-haspopup': true,
        'aria-label': 'Toggle calendar',
        // ABSENT aria-controls: USWDS's toggle (single-index.js L937) carries only aria-haspopup + aria-label — emitting a trigger→content link here would be net-new surface, unlike collapse/dropdown/modal whose originals write it.
        'disabled': disabled,
        'aria-disabled': ariaAttr(readOnly),
        'data-state': open ? 'open' : 'closed',
        // `data-index` is NET-NEW range endpoint targeting; single mode stays identical to the original.
        'data-index': isRange && eventIndex !== undefined ? index : undefined,
        onClick() {
          send({ type: 'TRIGGER.CLICK', index: eventIndex })
        },
      })
    },

    // Content `.usa-date-picker__calendar` (L938). `role=application`; `hidden` toggles with open; `data-value` =
    // the focused date ISO anchor (`calendarEl.dataset.value = currentFormattedDate` L1121, the CONTRACT that seeds
    // `calendarDate` on the next context read).
    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'dir': prop('dir'),
        'id': dom.getContentId(scope),
        'role': 'application',
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        // `calendarEl.dataset.value` is set only by `renderCalendar` (L1121) — absent on the never-opened calendar.
        'data-value': open ? formatDate(focusedValue) : undefined,
        // Tab focus-trap (`tabHandler` L2085-2107): Tab at the LAST focusable wraps to FIRST, Shift+Tab at the FIRST
        // wraps to LAST (also when focus is not in the set). Synchronous `.focus()` (no re-render). Middle Tabs fall
        // through to the browser's natural order. Zag's tabbable query excludes hidden and disabled view controls.
        onKeyDown(event) {
          if (getEventKey(event) !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey)
            return
          const focusables = getTabbables(dom.getContentEl(scope))
          if (focusables.length === 0)
            return
          const index = focusables.indexOf(scope.getActiveElement() as HTMLElement)
          if (event.shiftKey) {
            if (index <= 0) {
              event.preventDefault()
              focusables[focusables.length - 1]?.focus()
            }
          }
          else if (index === -1 || index === focusables.length - 1) {
            event.preventDefault()
            focusables[0]?.focus()
          }
        },
      })
    },

    // Status `.usa-date-picker__status` (L939) — sr-only live region. Text is `srStatusText` (consumer renders it).
    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'dir': prop('dir'),
        'id': dom.getStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
      })
    },

    // ── Calendar day view (renderCalendar L977) ──

    // The day wrapper owns visibility, leaving the navigation header free to serve as a focus fallback.
    getViewProps(props = {}) {
      const cellView = props.view ?? 'day'
      return normalize.element({
        ...parts.view.attrs,
        'dir': prop('dir'),
        'data-view': cellView,
        'hidden': view !== cellView,
        'tabIndex': cellView === 'day' ? undefined : -1,
      })
    },
    // The `CALENDAR_DATE_PICKER` navigation header (L1125) receives fallback focus when a bound disables a nav button (L1241).
    getViewControlProps() {
      return normalize.element({
        ...parts.viewControl.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
        tabIndex: -1,
      })
    },

    // Nav buttons (L1128-1167). prev year/month share `prevButtonsDisabled` (L1005); next share `nextButtonsDisabled`
    // (L1006). aria-labels verbatim. `onClick` → `display*` (L2131-2141); native `disabled` blocks clicking a
    // boundary button, and the machine's `canGoPrev`/`canGoNext` guard mirrors it.
    getPrevTriggerProps(props = {}) {
      return getNavigationProps('prev', props.unit)
    },
    getNextTriggerProps(props = {}) {
      return getNavigationProps('next', props.unit)
    },
    getViewTriggerProps(props) {
      const targetView = props.view
      return normalize.button({
        ...parts.viewTrigger.attrs,
        'dir': prop('dir'),
        'type': 'button',
        'data-view': targetView,
        'aria-label': targetView === 'month' ? `${focusedMonthName}. Select month` : `${focusedYear}. Select year`,
        onClick() {
          send({ type: 'VIEW.SET', view: targetView })
        },
      })
    },

    // Table `.usa-date-picker__calendar__table` (L1174) + head/body/rows.
    getTableProps(props = {}) {
      return normalize.element({
        ...parts.table.attrs,
        'dir': prop('dir'),
        'data-view': props.view ?? 'day',
        'role': props.view && props.view !== 'day' ? 'presentation' : undefined,
      })
    },
    getTableHeadProps() {
      return normalize.element({
        ...parts.tableHead.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
      })
    },
    // Day-of-week `<th scope="col" aria-label="{weekdayLong}">` (L1182-1187). Text (narrow) is `weekDays[i].narrow`.
    getTableHeaderProps(props: TableHeaderProps) {
      return normalize.element({
        ...parts.tableHeader.attrs,
        'dir': prop('dir'),
        'scope': 'col',
        'aria-label': weekdayLabels[props.index] ?? '',
      })
    },
    getTableBodyProps() {
      return normalize.element({
        ...parts.tableBody.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
      })
    },
    getTableRowProps() {
      return normalize.element({
        ...parts.tableRow.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
      })
    },
    getDayTableCellProps(props: DayTableCellProps) {
      return normalize.element({
        ...parts.tableCell.attrs,
        'dir': prop('dir'),
        'data-value': formatDate(props.value),
      })
    },

    // ONE day cell button (`generateDateHtml` L1017-1101). The full observable matrix: data-day/month(1-based)/
    // year/value(ISO), aria-label "{day} {monthLong} {year} {weekdayLong}", aria-selected "true"/"false", roving
    // tabindex (0 only on focused), native `disabled` outside [min,max]. CSS `--modifier` classes → `data-*` state
    // (no CSS classes leak from the headless layer); the range attrs compute in every mode but only light up in range.
    getDayTableCellTriggerProps(props: DayTableCellProps) {
      const value = props.value
      const day = value.getDate()
      const month = value.getMonth()
      const year = value.getFullYear()
      const disabled = !isDateWithinMinAndMax(value, effMin, effMax)
      const selected = isSameDay(value, selectedDate) || (isRange && isSameDay(value, selectedValue[1]))
      const focused = isSameDay(value, focusedValue)
      const isTodayCell = isSameDay(value, todaysDate)
      const outsideMonth = !isSameMonth(value, focusedValue)
      // Committed endpoints stay fixed while hover or keyboard focus previews only the strict interior.
      const rangeDate = !!(rangeAnchor && isSameDay(value, rangeAnchor))
      const rangeStart = !!(committedBounds?.rangeStartDate && isSameDay(value, committedBounds.rangeStartDate))
      const rangeEnd = !!(committedBounds?.rangeEndDate && isSameDay(value, committedBounds.rangeEndDate))
      const inRange = !!(
        withinBounds?.withinRangeStartDate
        && withinBounds.withinRangeEndDate
        && isDateWithinMinAndMax(value, withinBounds.withinRangeStartDate, withinBounds.withinRangeEndDate)
      )
      return normalize.button({
        ...parts.tableCellTrigger.attrs,
        'dir': prop('dir'),
        'type': 'button',
        'data-view': 'day',
        'data-day': day,
        'data-month': month + 1, // 1-based (L1088)
        'data-year': year,
        'data-value': formatDate(value),
        'aria-label': `${day} ${monthLabels[month] ?? ''} ${year} ${weekdayLabels[value.getDay()] ?? ''}`,
        'aria-selected': selected ? 'true' : 'false', // always-present string pair (single-index.js L1095) — ariaAttr/native boolean would drop the "false" case
        'tabIndex': focused ? 0 : -1, // roving (L1076/1084-1085)
        'disabled': disabled, // outside effective [min,max] (L1096-1098)
        'data-selected': dataAttr(selected),
        'data-today': dataAttr(isTodayCell),
        'aria-current': isTodayCell ? 'date' : undefined,
        'data-focus': dataAttr(focused),
        'data-outside-month': dataAttr(outsideMonth),
        'data-range-date': dataAttr(rangeDate),
        'data-range-start': dataAttr(rangeStart),
        'data-range-end': dataAttr(rangeEnd),
        'data-in-range': dataAttr(inRange),
        // `__date` CLICK → `selectDate` (L2122). A disabled cell can't fire click (native `disabled`); the machine's
        // `isSelectableDate` guards the L1325 early-return.
        onClick() {
          send({ type: 'CELL.CLICK', value })
        },
        // Day-grid keymap (L2172): arrows/Home/End/Page/Shift+Page → move focus via `adjustCalendar`.
        onKeyDown(event) {
          const next = gridKeyEvent(event, 'day')
          if (next) {
            event.preventDefault()
            send(next)
          }
        },
        // Hover-capable pointers preview the range. Touch does not hover; disabled and adjacent-month
        // cells do not preview. Repeated hover on the same date is ignored by semantic state equality.
        onPointerOver(event) {
          // A coordinated source endpoint is a single picker, but its blank side still previews against its
          // peer's `data-range-date` (single-index.js:1841-1867).
          if (event.pointerType !== 'touch' && !disabled && !outsideMonth && !activeSelectedDate
            && (isRange || (rangeAnchor && selectedValue.length === 0))) {
            send({ type: 'CELL.POINTER_MOVE', value })
          }
        },
      })
    },

    // ── Month picker view (displayMonthSelection L1383) ──

    // `CALENDAR_MONTH_PICKER` container (tabindex=-1, L1429).
    // One month cell (L1390-1425). `data-value` 0-11, `data-label` = month name, `aria-selected`, roving tabindex,
    // `disabled` = `isDatesMonthOutsideMinOrMax` (L1393/440). On entry `focusedMonth == selectedMonth ==
    // focusedValue.getMonth()`. Shares the `cellTrigger` part so the open-view focus finds it.
    getMonthTableCellTriggerProps(props: MonthTableCellProps) {
      const value = props.value
      const monthDate = setMonth(focusedValue, value)
      const disabled = isDatesMonthOutsideMinOrMax(monthDate, effMin, effMax)
      const selected = value === focusedValue.getMonth() // anchor (L1402)
      const focused = value === rovingMonth // roving (L1404)
      return getSelectionCellProps('month', value, monthDate, selected, focused, disabled)
    },

    // ── Year picker view (displayYearSelection L1477) ──

    // `CALENDAR_YEAR_PICKER` container (tabindex=-1, L1542) — the year-chunk focus-fallback target (L1667).
    // One year cell (L1500-1534). `data-value` = year, `aria-selected`, roving tabindex, `disabled` =
    // `isDatesYearOutsideMinOrMax` (L1503/451). On entry `focusedYear == selectedYear == focusedValue.getFullYear()`.
    getYearTableCellTriggerProps(props: YearTableCellProps) {
      const value = props.value
      const yearDate = setYear(focusedValue, value)
      const disabled = isDatesYearOutsideMinOrMax(yearDate, effMin, effMax)
      const selected = value === focusedValue.getFullYear() // anchor (L1512), does NOT follow chunk nav
      const focused = value === rovingYear // roving (L1514)
      return getSelectionCellProps('year', value, yearDate, selected, focused, disabled)
    },

  }
}
