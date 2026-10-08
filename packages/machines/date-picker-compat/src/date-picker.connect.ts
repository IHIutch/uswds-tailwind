import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type {
  DatePickerApi,
  DatePickerEvent,
  DatePickerService,
  DayTableCellProps,
  InputProps,
  MonthTableCellProps,
  NavigationTriggerProps,
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
    const page = key === 'PageUp' || key === 'PageDown'
    return view === 'day' && page ? { type: key === 'PageUp' ? 'TABLE.PAGE_UP' : 'TABLE.PAGE_DOWN', larger: true } : null
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
  const [selectedDate, selectedEnd] = selectedValue
  const activeSelectedDate = selectedValue[activeIndex]
  const focusedValue = context.get('focusedValue')
  const isOpeningRender = context.get('isOpeningRender')
  const min = prop('min')
  const max = prop('max')
  const todaysDate = today()

  const effectiveBounds = computed('activeBounds')
  const { min: effMin, max: effMax } = effectiveBounds

  // Hover affects only interior fill; committed markers follow selection or the display date.
  const peerAnchor = prop('rangeAnchor')
  const rangeAnchor = peerAnchor ?? (isRange ? selectedDate : undefined)
  const conclusion = (selectedValue.length === 2 ? selectedEnd : selectedDate) ?? focusedValue
  const committedBounds = rangeAnchor ? setRangeDates(conclusion, rangeAnchor) : undefined
  const previewConclusion = peerAnchor
    ? selectedDate ?? hoveredValue ?? focusedValue
    : selectedValue.length === 2
      ? selectedEnd
      : selectedValue.length === 1 ? hoveredValue ?? focusedValue : focusedValue
  const withinBounds = rangeAnchor && previewConclusion ? setRangeDates(rangeAnchor, previewConclusion) : undefined

  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const rovingYear = context.get('focusedYear')
  const rovingMonth = context.get('focusedMonth')
  const navigation = computed('navigation')
  const { yearChunkStart } = navigation
  const years: number[] = []
  for (let y = yearChunkStart; y < yearChunkStart + YEAR_CHUNK; y += 1) years.push(y)

  const locale = prop('locale') ?? (scope.getDoc().documentElement.lang || 'en')
  const monthLabels = getMonthLabels(locale)
  const weekdayLabels = getWeekdayLabels(locale)
  const weekdayNarrow = getWeekdayNarrow(locale)

  const focusedMonthName = monthLabels[focusedValue.getMonth()] ?? ''
  const focusedYear = focusedValue.getFullYear()

  const weeks = chunk(getVisibleDays(focusedValue), 7)
  const weekDays: WeekDay[] = weekdayNarrow.map((narrow, i) => ({ narrow, long: weekdayLabels[i] ?? '' }))

  // Selection follows the date anchor; tabindex follows the independently roving cell.
  function getSelectionCellProps(view: 'month' | 'year', value: number) {
    const month = view === 'month'
    const date = month ? setMonth(focusedValue, value) : setYear(focusedValue, value)
    const selected = value === (month ? focusedValue.getMonth() : focusedYear)
    const focused = value === (month ? rovingMonth : rovingYear)
    const cellDisabled = month ? isDatesMonthOutsideMinOrMax(date, effMin, effMax) : isDatesYearOutsideMinOrMax(date, effMin, effMax)
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

  let srStatusText = ''
  if (open && view === 'month') {
    srStatusText = 'Select a month.'
  }
  else if (open && view === 'year') {
    // USWDS escapes numeric zero as an empty string in the first year-chunk announcement.
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

  function getNavigationProps(direction: 'prev' | 'next', props: NavigationTriggerProps = {}) {
    const { view = 'day', unit = 'month' } = props
    const allowed = view === 'year'
      ? direction === 'prev' ? navigation.canChunkPrev : navigation.canChunkNext
      : direction === 'prev' ? navigation.canGoPrev : navigation.canGoNext
    return normalize.button({
      ...parts[direction === 'prev' ? 'prevTrigger' : 'nextTrigger'].attrs,
      'data-view': view,
      'data-unit': view === 'day' ? unit : undefined,
      'dir': prop('dir'),
      'type': 'button',
      'aria-label': `Navigate ${direction === 'prev' ? 'back' : 'forward'} ${view === 'year' ? `${YEAR_CHUNK} years` : `one ${unit}`}`,
      'disabled': !allowed,
      onClick() {
        send({ type: direction === 'prev' ? 'GOTO.PREV' : 'GOTO.NEXT', view, unit: view === 'day' ? unit : undefined })
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
    valueAsString: computed('valueAsString'),
    setValue(value) {
      send({ type: 'VALUE.SET', value })
    },
    clearValue() {
      send({ type: 'VALUE.SET', value: [] })
    },
    setOpen(nextOpen, index = 0) {
      // Always send imperative changes: a render snapshot can be stale across same-task calls.
      send(nextOpen ? { type: 'OPEN', index } : { type: 'CLOSE' })
    },

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

    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
        id: dom.getControlId(scope),
      })
    },

    getInputProps(props: InputProps = {}) {
      const index = isEndpointIndex(props.index) ? props.index : 0
      // Validate this endpoint independently of the currently open calendar.
      const inputBounds = getEffectiveDateBounds(isRange, index, selectedValue, min, max)
      const inputMin = inputBounds.min
      const inputMax = inputBounds.max
      const text = context.get('inputValues')[index] ?? ''
      const invalid = text !== '' && isDateInputInvalid(text, inputMin, inputMax)
      // Preserve validation messages owned by other validators.
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
        'data-index': isRange ? index : undefined,
        'data-invalid': dataAttr(invalid),
        'aria-invalid': ariaAttr(invalid),
        onInput(event) {
          const el = event.currentTarget as HTMLInputElement
          send({ type: 'INPUT.CHANGE', value: el.value, index })
        },
        // Enter validates even while the input is composing.
        onKeyDown(event) {
          if (getEventKey(event) === 'Enter')
            validate(event.currentTarget as HTMLInputElement)
        },
        onBlur(event) {
          validate(event.currentTarget as HTMLInputElement)
        },
      })
    },

    // USWDS uses a hidden text input without id or name as the non-submitting ISO mirror.
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
        // USWDS's trigger omits aria-controls.
        'disabled': disabled,
        'aria-disabled': ariaAttr(readOnly),
        'data-state': open ? 'open' : 'closed',
        'data-index': isRange && eventIndex !== undefined ? index : undefined,
        onClick() {
          send({ type: 'TRIGGER.CLICK', index: eventIndex })
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'dir': prop('dir'),
        'id': dom.getContentId(scope),
        'role': 'application',
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        // USWDS omits the focused-date attribute until the first open.
        'data-value': open ? formatDate(focusedValue) : undefined,
        // Wrap only at the focus boundaries; middle Tab presses use normal browser ordering.
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

    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'dir': prop('dir'),
        'id': dom.getStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
      })
    },

    // Keep the navigation header available as a focus fallback when the day grid is hidden.
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
    getViewControlProps() {
      return normalize.element({
        ...parts.viewControl.attrs,
        // eslint-disable-next-line style/quote-props
        'dir': prop('dir'),
        tabIndex: -1,
      })
    },

    getPrevTriggerProps(props = {}) {
      return getNavigationProps('prev', props)
    },
    getNextTriggerProps(props = {}) {
      return getNavigationProps('next', props)
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
      return normalize.button({
        ...parts.tableCellTrigger.attrs,
        'dir': prop('dir'),
        'type': 'button',
        'data-view': 'day',
        'data-day': day,
        'data-month': month + 1,
        'data-year': year,
        'data-value': formatDate(value),
        'aria-label': `${day} ${monthLabels[month] ?? ''} ${year} ${weekdayLabels[value.getDay()] ?? ''}`,
        'aria-selected': selected ? 'true' : 'false',
        'tabIndex': focused ? 0 : -1,
        'disabled': disabled,
        'data-selected': dataAttr(selected),
        'data-today': dataAttr(isTodayCell),
        'aria-current': isTodayCell ? 'date' : undefined,
        'data-focus': dataAttr(focused),
        'data-outside-month': dataAttr(outsideMonth),
        'data-range-date': dataAttr(isSameDay(value, rangeAnchor)),
        'data-range-start': dataAttr(isSameDay(value, committedBounds?.rangeStartDate)),
        'data-range-end': dataAttr(isSameDay(value, committedBounds?.rangeEndDate)),
        'data-in-range': dataAttr(!!(withinBounds?.withinRangeStartDate && withinBounds.withinRangeEndDate && isDateWithinMinAndMax(value, withinBounds.withinRangeStartDate, withinBounds.withinRangeEndDate))),
        onClick() {
          send({ type: 'CELL.CLICK', value })
        },
        onKeyDown(event) {
          const next = gridKeyEvent(event, 'day')
          if (next) {
            event.preventDefault()
            send(next)
          }
        },
        onPointerOver(event) {
          // A blank single picker can preview against its coordinated peer anchor.
          if (event.pointerType !== 'touch' && !disabled && !outsideMonth && !activeSelectedDate
            && (isRange || (rangeAnchor && selectedValue.length === 0))) {
            send({ type: 'CELL.POINTER_MOVE', value })
          }
        },
      })
    },

    getMonthTableCellTriggerProps(props: MonthTableCellProps) {
      return getSelectionCellProps('month', props.value)
    },

    getYearTableCellTriggerProps(props: YearTableCellProps) {
      return getSelectionCellProps('year', props.value)
    },

  }
}
