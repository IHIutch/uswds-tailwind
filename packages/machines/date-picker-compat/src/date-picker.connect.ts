import type { Service } from '@zag-js/core'
import type { EventKeyMap, JSX, NormalizeProps, PropTypes } from '@zag-js/types'
import type { DatepickerApi, DatepickerSchema } from './date-picker.types'
import { dataAttr, getEventKey } from '@zag-js/dom-query'
import { parts } from './date-picker.anatomy'
import * as dom from './date-picker.dom'

export function connect<T extends PropTypes>(
  service: Service<DatepickerSchema>,
  normalize: NormalizeProps<T>,
): DatepickerApi<T> {
  const { state, context, send, prop, scope, computed } = service

  const open = state.matches('open')
  const focused = state.matches('focused', 'open')
  const disabled = !!prop('disabled')
  const isInteractive = computed('isInteractive')
  const view = context.get('view')

  // --- Keyboard event map for day cell triggers ---
  const dayKeyMap: EventKeyMap = {
    ArrowUp(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_UP' })
    },
    ArrowDown(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_DOWN' })
    },
    ArrowLeft(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_LEFT' })
    },
    ArrowRight(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_RIGHT' })
    },
    Home(event) {
      event.preventDefault()
      send({ type: 'TABLE.HOME' })
    },
    End(event) {
      event.preventDefault()
      send({ type: 'TABLE.END' })
    },
    PageDown(event) {
      event.preventDefault()
      if (event.shiftKey) {
        send({ type: 'TABLE.SHIFT_PAGE_DOWN' })
      }
      else {
        send({ type: 'TABLE.PAGE_DOWN' })
      }
    },
    PageUp(event) {
      event.preventDefault()
      if (event.shiftKey) {
        send({ type: 'TABLE.SHIFT_PAGE_UP' })
      }
      else {
        send({ type: 'TABLE.PAGE_UP' })
      }
    },
  }

  // --- Keyboard event map for month cell triggers ---
  const monthKeyMap: EventKeyMap = {
    ArrowUp(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_UP' })
    },
    ArrowDown(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_DOWN' })
    },
    ArrowLeft(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_LEFT' })
    },
    ArrowRight(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_RIGHT' })
    },
    Home(event) {
      event.preventDefault()
      send({ type: 'TABLE.HOME' })
    },
    End(event) {
      event.preventDefault()
      send({ type: 'TABLE.END' })
    },
    PageDown(event) {
      event.preventDefault()
      send({ type: 'TABLE.PAGE_DOWN' })
    },
    PageUp(event) {
      event.preventDefault()
      send({ type: 'TABLE.PAGE_UP' })
    },
  }

  // --- Keyboard event map for year cell triggers ---
  const yearKeyMap: EventKeyMap = {
    ArrowUp(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_UP' })
    },
    ArrowDown(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_DOWN' })
    },
    ArrowLeft(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_LEFT' })
    },
    ArrowRight(event) {
      event.preventDefault()
      send({ type: 'TABLE.ARROW_RIGHT' })
    },
    Home(event) {
      event.preventDefault()
      send({ type: 'TABLE.HOME' })
    },
    End(event) {
      event.preventDefault()
      send({ type: 'TABLE.END' })
    },
    PageDown(event) {
      event.preventDefault()
      send({ type: 'TABLE.PAGE_DOWN' })
    },
    PageUp(event) {
      event.preventDefault()
      send({ type: 'TABLE.PAGE_UP' })
    },
  }

  return {
    // --- State properties ---
    open,
    focused,
    disabled,
    view,
    value: context.get('value'),
    valueAsString: computed('valueAsString'),
    inputValue: context.get('inputValue'),
    focusedValue: context.get('focusedValue'),
    hoveredValue: context.get('hoveredValue'),
    isInvalid: computed('isInvalid'),
    selectionMode: prop('selectionMode'),
    weeks: computed('weeks'),
    weekDays: computed('weekDays'),
    months: computed('months'),
    years: computed('years'),
    monthLabel: computed('monthLabel'),
    yearLabel: computed('yearLabel'),
    yearChunkStart: computed('yearChunkStart'),
    isPrevMonthDisabled: computed('isPrevMonthDisabled'),
    isNextMonthDisabled: computed('isNextMonthDisabled'),
    isPrevYearDisabled: computed('isPrevYearDisabled'),
    isNextYearDisabled: computed('isNextYearDisabled'),
    isPrevYearChunkDisabled: computed('isPrevYearChunkDisabled'),
    isNextYearChunkDisabled: computed('isNextYearChunkDisabled'),
    statusMessage: context.get('statusMessage'),

    // --- Imperative API methods ---

    setValue(values) {
      send({ type: 'VALUE.SET', values })
    },
    clearValue() {
      send({ type: 'VALUE.CLEAR' })
    },
    setOpen(nextOpen) {
      if (nextOpen) {
        send({ type: 'TRIGGER.CLICK' })
      }
      else {
        send({ type: 'TRIGGER.CLICK' })
      }
    },
    setView(nextView) {
      send({ type: 'VIEW.SET', view: nextView })
    },
    setFocusedValue(value) {
      send({ type: 'FOCUSED_VALUE.SET', value })
    },
    goToNext() {
      send({ type: 'GOTO.NEXT' })
    },
    goToPrev() {
      send({ type: 'GOTO.PREV' })
    },

    // --- Props getters ---

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-state': open ? 'open' : 'closed',
        'data-disabled': dataAttr(disabled),
        //   if (!this.contains(event.relatedTarget)) { hideCalendar(this) }
        onFocusOut(event: any) {
          const rootEl = dom.getRootEl(scope)
          if (rootEl && !rootEl.contains(event.relatedTarget as Node)) {
            send({ type: 'FOCUS_OUTSIDE' })
          }
        },
      })
    },

    //   - input [DATE_PICKER_EXTERNAL_INPUT] (L2251-2254) → reconcileInputValues + updateCalendarIfVisible
    //   - focusout [DATE_PICKER_EXTERNAL_INPUT] (L2241-2242) → validateDateInput
    //   - keydown [DATE_PICKER_EXTERNAL_INPUT] Enter (L2167-2170) → validateDateInput
    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        disabled,
        'data-state': open ? 'open' : 'closed',
        'aria-describedby': dom.getStatusId(scope),
        'value': context.get('inputValue'),
        onFocus() {
          send({ type: 'INPUT.FOCUS' })
        },
        onBlur() {
          send({ type: 'INPUT.BLUR' })
        },
        onInput(event) {
          const target = event.target as HTMLInputElement
          send({ type: 'INPUT.CHANGE', value: target.value })
        },
        onKeyDown(event) {
          if (event.key === 'Enter') {
            send({ type: 'INPUT.ENTER' })
          }
        },
      })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'type': 'button',
        disabled,
        'aria-label': open ? 'Close calendar' : 'Toggle calendar',
        'data-state': open ? 'open' : 'closed',
        onClick() {
          if (!isInteractive)
            return
          send({ type: 'TRIGGER.CLICK' })
        },
      })
    },

    getCalendarProps() {
      return normalize.element({
        ...parts.calendar.attrs,
        'id': dom.getCalendarId(scope),
        'role': 'application',
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        onKeyDown(event) {
          send({ type: 'CALENDAR.KEYDOWN', keyCode: event.keyCode })

          if (event.key === 'Escape') {
            event.preventDefault()
            send({ type: 'TABLE.ESCAPE' })
          }
        },
        onKeyUp(event) {
          const lastKeydownCode = context.get('lastKeydownCode')
          if (lastKeydownCode !== null && event.keyCode !== lastKeydownCode) {
            event.preventDefault()
          }
        },
      })
    },

    // --- Day picker (contains nav buttons + grid) ---

    getDayPickerProps() {
      return normalize.element({
        ...parts.dayPicker.attrs,
        id: dom.getDayPickerId(scope),
        tabIndex: -1,
        hidden: view !== 'day',
        onKeyDown(event) {
          if (event.key === 'Tab') {
            handleTabTrapping(event, dom.getDayPickerEl(scope))
          }
        },
      })
    },

    getMonthPickerProps() {
      return normalize.element({
        ...parts.monthPicker.attrs,
        id: dom.getMonthPickerId(scope),
        tabIndex: -1,
        hidden: view !== 'month',
        onKeyDown(event) {
          if (event.key === 'Tab') {
            handleTabTrapping(event, dom.getMonthPickerEl(scope))
          }
        },
      })
    },

    getYearPickerProps() {
      return normalize.element({
        ...parts.yearPicker.attrs,
        id: dom.getYearPickerId(scope),
        tabIndex: -1,
        hidden: view !== 'year',
        onKeyDown(event) {
          if (event.key === 'Tab') {
            handleTabTrapping(event, dom.getYearPickerEl(scope))
          }
        },
      })
    },

    getGridProps() {
      return normalize.element({
        ...parts.grid.attrs,
        id: dom.getGridId(scope),
        role: 'grid',
      })
    },

    getHeaderProps() {
      return normalize.element({
        ...parts.header.attrs,
      })
    },

    getHeaderRowProps() {
      return normalize.element({
        ...parts.headerRow.attrs,
        role: 'row',
      })
    },

    getHeaderCellProps({ day }) {
      return normalize.element({
        ...parts.headerCell.attrs,
        'role': 'columnheader',
        'scope': 'col',
        'aria-label': day.long,
      })
    },

    getBodyProps() {
      return normalize.element({
        ...parts.body.attrs,
      })
    },

    getRowProps() {
      return normalize.element({
        ...parts.row.attrs,
        role: 'row',
      })
    },

    getCellProps({ cell }) {
      return normalize.element({
        ...parts.cell.attrs,
        role: 'gridcell',
      })
    },

    //   CLICK [CALENDAR_DATE] → selectDate (L2122-2124) +
    //   keydown [CALENDAR_DATE] arrow/home/end/page handlers (L2172-2188) +
    //   mouseover [CALENDAR_DATE_CURRENT_MONTH] → handleMouseoverFromDate (L2258-2264)
    getDayCellTriggerProps({ cell }) {
      return normalize.element({
        ...parts.cellTrigger.attrs,
        'id': dom.getCellTriggerId(scope, cell.dateString),
        'role': 'button',
        'tabIndex': cell.isFocused ? 0 : -1,
        'disabled': cell.isDisabled || undefined,
        'aria-label': cell.ariaLabel,
        'aria-selected': cell.isSelected,
        'data-value': cell.dateString,
        'data-day': cell.day,
        'data-today': dataAttr(cell.isToday),
        'data-selected': dataAttr(cell.isSelected),
        'data-focused': dataAttr(cell.isFocused),
        'data-disabled': dataAttr(cell.isDisabled),
        'data-current-month': dataAttr(cell.isCurrentMonth),
        'data-previous-month': dataAttr(cell.isPreviousMonth),
        'data-next-month': dataAttr(cell.isNextMonth),
        'data-range-start': dataAttr(cell.isRangeStart),
        'data-range-end': dataAttr(cell.isRangeEnd),
        'data-within-range': dataAttr(cell.isWithinRange),
        'data-range-date': dataAttr(cell.isRangeDate),
        onClick() {
          if (cell.isDisabled)
            return
          send({ type: 'CELL.CLICK', value: cell.dateString })
        },
        onKeyDown(event) {
          const handler = dayKeyMap[getEventKey(event)]
          handler?.(event)
        },
        onPointerMove() {
          if (cell.isCurrentMonth) {
            send({ type: 'CELL.POINTER_MOVE', value: cell.date })
          }
        },
      })
    },

    //   CLICK [CALENDAR_MONTH] → selectMonth (L2125-2126) +
    //   keydown [CALENDAR_MONTH] (L2193-2206)
    getMonthCellTriggerProps({ cell }) {
      return normalize.element({
        ...parts.cellTrigger.attrs,
        'role': 'button',
        'tabIndex': cell.isFocused ? 0 : -1,
        'disabled': cell.isDisabled || undefined,
        'data-value': cell.month,
        'aria-label': cell.label,
        'aria-selected': cell.isSelected,
        'data-selected': dataAttr(cell.isSelected),
        'data-focused': dataAttr(cell.isFocused),
        'data-disabled': dataAttr(cell.isDisabled),
        onClick() {
          if (cell.isDisabled)
            return
          send({ type: 'MONTH.SELECT', value: cell.month })
        },
        onKeyDown(event) {
          const handler = monthKeyMap[getEventKey(event)]
          handler?.(event)
        },
      })
    },

    //   CLICK [CALENDAR_YEAR] → selectYear (L2128-2129) +
    //   keydown [CALENDAR_YEAR] (L2211-2224)
    getYearCellTriggerProps({ cell }) {
      return normalize.element({
        ...parts.cellTrigger.attrs,
        'role': 'button',
        'tabIndex': cell.isFocused ? 0 : -1,
        'disabled': cell.isDisabled || undefined,
        'data-value': cell.year,
        'aria-selected': cell.isSelected,
        'data-selected': dataAttr(cell.isSelected),
        'data-focused': dataAttr(cell.isFocused),
        'data-disabled': dataAttr(cell.isDisabled),
        onClick() {
          if (cell.isDisabled)
            return
          send({ type: 'YEAR.SELECT', value: cell.year })
        },
        onKeyDown(event) {
          const handler = yearKeyMap[getEventKey(event)]
          handler?.(event)
        },
      })
    },

    //   CLICK [CALENDAR_PREVIOUS_YEAR] → displayPreviousYear (L2137-2139)
    getPrevYearTriggerProps() {
      return normalize.button({
        ...parts.prevYearTrigger.attrs,
        'id': dom.getPrevYearTriggerId(scope),
        'type': 'button',
        'aria-label': 'Navigate back one year',
        'disabled': computed('isPrevYearDisabled'),
        onClick() {
          send({ type: 'GOTO.PREV_YEAR' })
        },
      })
    },

    //   CLICK [CALENDAR_PREVIOUS_MONTH] → displayPreviousMonth (L2131-2133)
    getPrevMonthTriggerProps() {
      return normalize.button({
        ...parts.prevMonthTrigger.attrs,
        'id': dom.getPrevMonthTriggerId(scope),
        'type': 'button',
        'aria-label': 'Navigate back one month',
        'disabled': computed('isPrevMonthDisabled'),
        onClick() {
          send({ type: 'GOTO.PREV_MONTH' })
        },
      })
    },

    //   CLICK [CALENDAR_MONTH_SELECTION] (L2149-2151)
    getMonthSelectionProps() {
      return normalize.button({
        ...parts.monthSelection.attrs,
        'id': dom.getMonthSelectionId(scope),
        'type': 'button',
        'aria-label': `${computed('monthLabel')}. Select month`,
        onClick() {
          send({ type: 'VIEW.SET_MONTH' })
        },
      })
    },

    //   CLICK [CALENDAR_YEAR_SELECTION] (L2153-2155)
    getYearSelectionProps() {
      return normalize.button({
        ...parts.yearSelection.attrs,
        'id': dom.getYearSelectionId(scope),
        'type': 'button',
        'aria-label': `${computed('yearLabel')}. Select year`,
        onClick() {
          send({ type: 'VIEW.SET_YEAR' })
        },
      })
    },

    //   CLICK [CALENDAR_NEXT_MONTH] → displayNextMonth (L2134-2136)
    getNextMonthTriggerProps() {
      return normalize.button({
        ...parts.nextMonthTrigger.attrs,
        'id': dom.getNextMonthTriggerId(scope),
        'type': 'button',
        'aria-label': 'Navigate forward one month',
        'disabled': computed('isNextMonthDisabled'),
        onClick() {
          send({ type: 'GOTO.NEXT_MONTH' })
        },
      })
    },

    //   CLICK [CALENDAR_NEXT_YEAR] → displayNextYear (L2140-2142)
    getNextYearTriggerProps() {
      return normalize.button({
        ...parts.nextYearTrigger.attrs,
        'id': dom.getNextYearTriggerId(scope),
        'type': 'button',
        'aria-label': 'Navigate forward one year',
        'disabled': computed('isNextYearDisabled'),
        onClick() {
          send({ type: 'GOTO.NEXT_YEAR' })
        },
      })
    },

    //   CLICK [CALENDAR_PREVIOUS_YEAR_CHUNK] → displayPreviousYearChunk (L2143-2145)
    getPrevYearChunkTriggerProps() {
      return normalize.button({
        ...parts.prevYearChunkTrigger.attrs,
        'id': dom.getPrevYearChunkTriggerId(scope),
        'type': 'button',
        'aria-label': 'Navigate back 12 years',
        'disabled': computed('isPrevYearChunkDisabled'),
        onClick() {
          send({ type: 'GOTO.PREV_YEAR_CHUNK' })
        },
      })
    },

    //   CLICK [CALENDAR_NEXT_YEAR_CHUNK] → displayNextYearChunk (L2146-2148)
    getNextYearChunkTriggerProps() {
      return normalize.button({
        ...parts.nextYearChunkTrigger.attrs,
        'id': dom.getNextYearChunkTriggerId(scope),
        'type': 'button',
        'aria-label': 'Navigate forward 12 years',
        'disabled': computed('isNextYearChunkDisabled'),
        onClick() {
          send({ type: 'GOTO.NEXT_YEAR_CHUNK' })
        },
      })
    },

    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'id': dom.getStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
        'aria-atomic': 'true',
      })
    },
  } as DatepickerApi<T>
}

function handleTabTrapping(event: JSX.KeyboardEvent<HTMLElement>, container: HTMLElement | null) {
  if (!container)
    return

  const focusableEls = container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
  )
  if (focusableEls.length === 0)
    return

  const firstFocusable = focusableEls[0]!
  const lastFocusable = focusableEls[focusableEls.length - 1]!
  const activeEl = container.ownerDocument.activeElement

  if (event.shiftKey) {
    // Shift+Tab: if at first or not found, wrap to last
    const isFirst = activeEl === firstFocusable
    const isNotFound = !Array.from(focusableEls).includes(activeEl as HTMLElement)
    if (isFirst || isNotFound) {
      event.preventDefault()
      lastFocusable.focus()
    }
  }
  else {
    // Tab: if at last or not found, wrap to first
    const isLast = activeEl === lastFocusable
    const isNotFound = !Array.from(focusableEls).includes(activeEl as HTMLElement)
    if (isLast || isNotFound) {
      event.preventDefault()
      firstFocusable.focus()
    }
  }
}
