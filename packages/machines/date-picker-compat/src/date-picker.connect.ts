import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type {
  DatePickerApi,
  DatePickerEvent,
  DatePickerService,
  DayTableCellProps,
  InputProps,
  LabelProps,
  MonthTableCellProps,
  TableHeaderProps,
  TriggerProps,
  YearTableCellProps,
} from './date-picker.types'
import { ariaAttr, dataAttr, getEventKey, getTabbables } from '@zag-js/dom-query'
import { chunk } from '@zag-js/utils'
import { parts, rangeParts } from './date-picker.anatomy'
import * as dom from './date-picker.dom'
import {
  getEffectiveDateBounds,
  getRangeDates,
  getVisibleDays,
  isDateInputInvalid,
  YEAR_CHUNK,
} from './date-picker.utils'
import {
  formatDate,
  getMonthLabels,
  getWeekDays,
  isMonthInInterval,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isYearInInterval,
  setMonth,
  setYear,
  startOfToday,
} from './date-utils'

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

function getRangeDisplayState({ isRange, selectedValue, focusedValue, hoveredValue, peerAnchor }: {
  isRange: boolean
  selectedValue: (Date | undefined)[]
  focusedValue: Date
  hoveredValue: Date | null
  peerAnchor: Date | undefined
}) {
  const [start, end] = selectedValue
  const anchor = peerAnchor ?? (isRange ? start : undefined)
  const committedEndpoint = (selectedValue.length === 2 ? end : start) ?? focusedValue

  let previewEndpoint: Date | undefined = focusedValue
  if (peerAnchor)
    previewEndpoint = start ?? hoveredValue ?? focusedValue
  else if (selectedValue.length === 2)
    previewEndpoint = end
  else if (selectedValue.length === 1)
    previewEndpoint = hoveredValue ?? focusedValue

  return {
    anchor,
    committedRange: anchor ? getRangeDates(committedEndpoint, anchor) : undefined,
    previewRange: anchor && previewEndpoint ? getRangeDates(anchor, previewEndpoint) : undefined,
  }
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
  const [selectedDate] = selectedValue
  const activeSelectedDate = selectedValue[activeIndex]
  const focusedValue = context.get('focusedValue')
  const isOpeningRender = context.get('isOpeningRender')
  const propMin = prop('min')
  const propMax = prop('max')
  const todaysDate = startOfToday()

  const effectiveBounds = computed('activeBounds')

  const { anchor: rangeAnchor, committedRange, previewRange } = getRangeDisplayState({
    isRange,
    selectedValue,
    focusedValue,
    hoveredValue,
    peerAnchor: prop('rangeAnchor'),
  })

  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const rovingYear = context.get('focusedYear')
  const rovingMonth = context.get('focusedMonth')
  const navigation = computed('navigation')
  const { yearChunkStart } = navigation
  const years: number[] = []
  for (let y = yearChunkStart; y < yearChunkStart + YEAR_CHUNK; y += 1) years.push(y)

  const locale = scope.getDoc().documentElement.lang || 'en'
  const monthLabels = getMonthLabels(locale)
  const weekDays = getWeekDays(locale)

  const focusedMonthName = monthLabels[focusedValue.getMonth()] ?? ''
  const focusedYear = focusedValue.getFullYear()

  const weeks = chunk(getVisibleDays(focusedValue), 7)

  // Selection follows the date anchor; tabindex follows the independently roving cell.
  function getSelectionCellProps(view: 'month' | 'year', value: number) {
    const month = view === 'month'
    const date = month ? setMonth(focusedValue, value) : setYear(focusedValue, value)
    const selected = value === (month ? focusedValue.getMonth() : focusedYear)
    const focused = value === (month ? rovingMonth : rovingYear)
    const cellDisabled = month ? !isMonthInInterval(date, effectiveBounds) : !isYearInInterval(date, effectiveBounds)
    return normalize.button({
      ...parts.tableCellTrigger.attrs,
      'type': 'button',
      'data-view': view,
      'data-value': value,
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

  function getStatusText() {
    if (!open)
      return ''
    if (view === 'month')
      return 'Select a month.'
    if (view === 'year') {
      // USWDS announces year zero as an empty string.
      const sourceYearChunkStart = yearChunkStart === 0 ? '' : String(yearChunkStart)
      return `Showing years ${sourceYearChunkStart} to ${yearChunkStart + YEAR_CHUNK - 1}. Select a year.`
    }

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
    return statuses.join('. ')
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
    srStatusText: getStatusText(),
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
      // Send every request; this snapshot can be stale within the same task.
      send(nextOpen ? { type: 'OPEN', index } : { type: 'CLOSE' })
    },

    getRootProps() {
      return normalize.element({
        ...(isRange ? rangeParts.root.attrs : parts.root.attrs),
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

    getLabelProps(props: LabelProps = {}) {
      const index = props.index ?? 0
      return normalize.label({
        ...parts.label.attrs,
        'id': dom.getLabelId(scope, index),
        'htmlFor': dom.getInputId(scope, index),
        'data-index': isRange ? index : undefined,
        'data-disabled': dataAttr(disabled),
      })
    },

    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        id: dom.getControlId(scope),
      })
    },

    getInputProps(props: InputProps = {}) {
      const index = props.index ?? 0
      const inputBounds = getEffectiveDateBounds(isRange, index, selectedValue, propMin, propMax)
      const inputMin = inputBounds.start
      const inputMax = inputBounds.end
      const text = context.get('inputValues')[index] ?? ''
      const invalid = text !== '' && isDateInputInvalid(text, inputMin, inputMax)
      const rangeBoundsProps = isRange
        ? {
            min: formatDate(inputMin) !== '0000-01-01' ? formatDate(inputMin) : undefined,
            max: inputMax ? formatDate(inputMax) : undefined,
          }
        : {}
      return normalize.input({
        ...parts.input.attrs,
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
        // Enter also validates during composition.
        onKeyDown(event) {
          if (getEventKey(event) === 'Enter')
            send({ type: 'INPUT.ENTER', index })
        },
        onBlur() {
          send({ type: 'INPUT.BLUR', index })
        },
      })
    },

    getTriggerProps(props: TriggerProps = {}) {
      const index = props.index ?? 0
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope, index),
        'type': 'button',
        'aria-haspopup': true,
        'aria-label': 'Toggle calendar',
        // USWDS's trigger omits aria-controls.
        'disabled': disabled,
        'aria-disabled': ariaAttr(readOnly),
        'data-state': open ? 'open' : 'closed',
        onClick() {
          send({ type: 'TRIGGER.CLICK', index })
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'role': 'application',
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        'data-value': open ? formatDate(focusedValue) : undefined,
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
        'id': dom.getStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
      })
    },

    getViewProps(props = {}) {
      const cellView = props.view ?? 'day'
      return normalize.element({
        ...parts.view.attrs,
        'id': dom.getViewId(scope, cellView),
        'data-view': cellView,
        'hidden': view !== cellView,
        'tabIndex': cellView === 'day' ? undefined : -1,
      })
    },
    getViewControlProps() {
      return normalize.element({
        ...parts.viewControl.attrs,
        id: dom.getViewControlId(scope),
        tabIndex: -1,
      })
    },

    getPrevTriggerProps(props = {}) {
      const { view = 'day', unit = 'month' } = props
      const allowed = view === 'year' ? navigation.canChunkPrev : navigation.canGoPrev
      return normalize.button({
        ...parts.prevTrigger.attrs,
        'id': dom.getNavTriggerId(scope, 'prev', view, unit),
        'data-view': view,
        'data-unit': view === 'day' ? unit : undefined,
        'type': 'button',
        'aria-label': `Navigate back ${view === 'year' ? `${YEAR_CHUNK} years` : `one ${unit}`}`,
        'disabled': !allowed,
        onClick() {
          send({ type: 'GOTO.PREV', view, unit: view === 'day' ? unit : undefined })
        },
      })
    },
    getNextTriggerProps(props = {}) {
      const { view = 'day', unit = 'month' } = props
      const allowed = view === 'year' ? navigation.canChunkNext : navigation.canGoNext
      return normalize.button({
        ...parts.nextTrigger.attrs,
        'id': dom.getNavTriggerId(scope, 'next', view, unit),
        'data-view': view,
        'data-unit': view === 'day' ? unit : undefined,
        'type': 'button',
        'aria-label': `Navigate forward ${view === 'year' ? `${YEAR_CHUNK} years` : `one ${unit}`}`,
        'disabled': !allowed,
        onClick() {
          send({ type: 'GOTO.NEXT', view, unit: view === 'day' ? unit : undefined })
        },
      })
    },
    getViewTriggerProps(props) {
      const targetView = props.view
      return normalize.button({
        ...parts.viewTrigger.attrs,
        'id': dom.getViewTriggerId(scope, targetView),
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
        'data-view': props.view ?? 'day',
        'role': props.view && props.view !== 'day' ? 'presentation' : undefined,
      })
    },
    getTableHeadProps() {
      return normalize.element({
        ...parts.tableHead.attrs,
      })
    },
    getTableHeaderProps(props: TableHeaderProps) {
      return normalize.element({
        ...parts.tableHeader.attrs,
        'scope': 'col',
        'aria-label': weekDays[props.index]?.long ?? '',
      })
    },
    getTableBodyProps() {
      return normalize.element({
        ...parts.tableBody.attrs,
      })
    },
    getTableRowProps() {
      return normalize.element({
        ...parts.tableRow.attrs,
      })
    },
    getDayTableCellProps(props: DayTableCellProps) {
      return normalize.element({
        ...parts.tableCell.attrs,
        'data-value': formatDate(props.value),
      })
    },

    getDayTableCellTriggerProps(props: DayTableCellProps) {
      const value = props.value
      const day = value.getDate()
      const month = value.getMonth()
      const year = value.getFullYear()
      const disabled = !isWithinInterval(value, effectiveBounds)
      const selected = isSameDay(value, selectedDate) || (isRange && isSameDay(value, selectedValue[1]))
      const focused = isSameDay(value, focusedValue)
      const isTodayCell = isSameDay(value, todaysDate)
      const outsideMonth = !isSameMonth(value, focusedValue)
      const inPreviewRange = !!previewRange && isWithinInterval(value, { start: previewRange.withinRangeStartDate, end: previewRange.withinRangeEndDate })
      const canPreviewRange = !disabled && !outsideMonth && !activeSelectedDate
        && (isRange || (!!rangeAnchor && selectedValue.length === 0))
      return normalize.button({
        ...parts.tableCellTrigger.attrs,
        'type': 'button',
        'data-view': 'day',
        'data-day': day,
        'data-month': month + 1,
        'data-year': year,
        'data-value': formatDate(value),
        'aria-label': `${day} ${monthLabels[month] ?? ''} ${year} ${weekDays[value.getDay()]?.long ?? ''}`,
        'aria-selected': selected ? 'true' : 'false',
        'tabIndex': focused ? 0 : -1,
        'disabled': disabled,
        'data-selected': dataAttr(selected),
        'data-startOfToday': dataAttr(isTodayCell),
        'aria-current': isTodayCell ? 'date' : undefined,
        'data-focus': dataAttr(focused),
        'data-outside-month': dataAttr(outsideMonth),
        'data-range-date': dataAttr(isSameDay(value, rangeAnchor)),
        'data-range-start': dataAttr(isSameDay(value, committedRange?.rangeStartDate)),
        'data-range-end': dataAttr(isSameDay(value, committedRange?.rangeEndDate)),
        'data-in-range': dataAttr(inPreviewRange),
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
          if (event.pointerType !== 'touch' && canPreviewRange) {
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
