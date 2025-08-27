import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { DatePickerApi, DatePickerSchema } from './date-picker.types'
import { parts } from './date-picker.anatomy'
import * as dom from './date-picker.dom'
import {
  formatDate,
  isAfter,
  isBefore,
  isDateInRange,
  isSameDay,
  isWithinInterval,
  parseDate,
  today,
} from './date-picker.utils'

export function connect<T extends PropTypes>(
  service: Service<DatePickerSchema>,
  normalize: NormalizeProps<T>,
): DatePickerApi<T> {
  const { state, send, scope, context, prop } = service

  const open = !state.matches('closed')
  const view = state.matches('monthSelection') ? 'month' : state.matches('yearSelection') ? 'year' : 'date'
  const disabled = !!prop('disabled')
  const readonly = !!prop('readonly')

  const selectionMode = context.get('selectionMode')
  const startDate = context.get('startDate')
  const endDate = context.get('endDate')
  const hoverDate = context.get('hoverDate')
  const activeInput = context.get('activeInput')
  const calendarDate = context.get('calendarDate')

  // Range mode values
  const startInputValue = context.get('startInputValue')
  const endInputValue = context.get('endInputValue')
  const isStartInputValid = context.get('isStartInputValid')
  const isEndInputValid = context.get('isEndInputValid')
  const startValidationMessage = context.get('startValidationMessage')
  const endValidationMessage = context.get('endValidationMessage')

  // Single mode values (backward compatibility)
  const isInputValid = context.get('isInputValid')
  const validationMessage = context.get('validationMessage')

  const minDate = context.get('minDate')
  const maxDate = context.get('maxDate')
  const monthLabels = context.get('monthLabels')
  const dayOfWeekLabels = context.get('dayOfWeekLabels')

  return {
    open,
    startValue: startDate ? formatDate(startDate, 'yyyy-MM-dd') : null,
    endValue: endDate ? formatDate(endDate, 'yyyy-MM-dd') : null,
    startValueDate: startDate,
    endValueDate: endDate,
    view,
    focused: false, // Would need to track focus state
    disabled,
    readonly,

    setOpen(next) {
      if (disabled)
        return
      if (open === next)
        return
      send({ type: next ? 'OPEN' : 'CLOSE' })
    },

    goToDate(date) {
      if (disabled)
        return
      send({ type: 'SELECT_DATE', date })
    },

    setStartDate(value) {
      if (disabled || readonly || selectionMode !== 'range')
        return
      const date = parseDate(value)
      if (date) {
        send({ type: 'START_RANGE', date })
      }
    },

    setEndDate(value) {
      if (disabled || readonly || selectionMode !== 'range')
        return
      const date = parseDate(value)
      if (date) {
        send({ type: 'END_RANGE', date })
      }
    },

    clearStartDate() {
      if (disabled || readonly || selectionMode !== 'range')
        return
      // Use existing clear range functionality, but only for start
      send({ type: 'CLEAR_RANGE' })
    },

    clearEndDate() {
      if (disabled || readonly || selectionMode !== 'range')
        return
      // Use existing clear range functionality, but only for end
      send({ type: 'CLEAR_RANGE' })
    },

    // focusStartInput() {
    //   if (disabled || selectionMode !== 'range')
    //     return
    //   send({ type: 'START_INPUT_FOCUS' })
    // },

    // focusEndInput() {
    //   if (disabled || selectionMode !== 'range')
    //     return
    //   send({ type: 'END_INPUT_FOCUS' })
    // },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-disabled': disabled ? 'true' : 'false',
        'data-readonly': readonly ? 'true' : 'false',
        'data-invalid': !isInputValid ? 'true' : 'false',
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'type': 'text',
        'value': startInputValue,
        disabled,
        'readOnly': readonly,
        'aria-invalid': !isInputValid,
        'aria-describedby': validationMessage ? dom.getStatusId(scope) : undefined,
        onChange(event) {
          const target = event.target as HTMLInputElement
          send({ type: 'START_INPUT_CHANGE', value: target.value })
        },
        onKeyDown(event) {
          if (disabled || readonly)
            return

          switch (event.key) {
            case 'Enter':
              event.preventDefault()
              if (isInputValid) {
                send({ type: 'OPEN' })
              }
              break
            case 'ArrowDown':
            case 'ArrowUp':
              event.preventDefault()
              send({ type: 'OPEN' })
              break
            case 'Escape':
              if (open) {
                event.preventDefault()
                send({ type: 'CLOSE' })
              }
              break
          }
        },
      })
    },

    getTriggerProps(target?: 'start' | 'end') {
      // For range mode, determine which input to activate
      const shouldSetActiveInput = selectionMode === 'range' && target

      return normalize.button({
        ...parts.trigger.attrs,
        'id': target ? `${dom.getTriggerId(scope)}-${target}` : dom.getTriggerId(scope),
        'type': 'button',
        disabled,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? dom.getCalendarId(scope) : undefined,
        'aria-label': target ? `Open calendar for ${target} date` : 'Toggle calendar',
        'data-state': open ? 'open' : 'closed',
        'data-target': target || undefined,
        onClick() {
          if (!disabled) {
            if (shouldSetActiveInput) {
              // Set the active input first, then open
              send({ type: target === 'start' ? 'START_INPUT_FOCUS' : 'END_INPUT_FOCUS' })
            }
            else {
              send({ type: 'TOGGLE' })
            }
          }
        },
        onKeyDown(event) {
          if (disabled)
            return

          switch (event.key) {
            case 'Enter':
            case ' ':
              event.preventDefault()
              if (shouldSetActiveInput) {
                send({ type: target === 'start' ? 'START_INPUT_FOCUS' : 'END_INPUT_FOCUS' })
              }
              else {
                send({ type: 'TOGGLE' })
              }
              break
            case 'ArrowDown':
              event.preventDefault()
              if (shouldSetActiveInput) {
                send({ type: target === 'start' ? 'START_INPUT_FOCUS' : 'END_INPUT_FOCUS' })
              }
              else {
                send({ type: 'OPEN' })
              }
              break
          }
        },
      })
    },

    getCalendarProps() {
      return normalize.element({
        ...parts.calendar.attrs,
        'id': dom.getCalendarId(scope),
        'role': 'application',
        'aria-label': 'Calendar',
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        'data-view': view,
        'tabIndex': -1,
        onKeyDown(event) {
          if (!open || disabled)
            return

          switch (event.key) {
            case 'Escape':
              event.preventDefault()
              send({ type: 'ESCAPE' })
              dom.getInputEl(scope)?.focus()
              break
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
        'aria-atomic': true,
        'className': 'sr-only',
      })
    },

    getNavigationProps(direction, unit) {
      let isDisabled = disabled

      // Check selected date range constraints for range mode
      if (!isDisabled && selectionMode === 'range') {
        if (activeInput === 'end' && startDate) {
          // When selecting end date, disable navigation before start date
          if (direction === 'prev' && unit === 'year') {
            isDisabled = calendarDate.getFullYear() <= startDate.getFullYear()
          }
          else if (direction === 'prev' && unit === 'month') {
            isDisabled = (calendarDate.getFullYear() === startDate.getFullYear() && calendarDate.getMonth() <= startDate.getMonth())
              || calendarDate.getFullYear() < startDate.getFullYear()
          }
        }
        else if (activeInput === 'start' && endDate) {
          // When selecting start date, disable navigation after end date
          if (direction === 'next' && unit === 'year') {
            isDisabled = calendarDate.getFullYear() >= endDate.getFullYear()
          }
          else if (direction === 'next' && unit === 'month') {
            isDisabled = (calendarDate.getFullYear() === endDate.getFullYear() && calendarDate.getMonth() >= endDate.getMonth())
              || calendarDate.getFullYear() > endDate.getFullYear()
          }
        }
        else if (startDate && endDate) {
          // When both dates selected, disable navigation outside range
          if (direction === 'prev' && unit === 'year') {
            isDisabled = calendarDate.getFullYear() <= startDate.getFullYear()
          }
          else if (direction === 'next' && unit === 'year') {
            isDisabled = calendarDate.getFullYear() >= endDate.getFullYear()
          }
          else if (direction === 'prev' && unit === 'month') {
            isDisabled = (calendarDate.getFullYear() === startDate.getFullYear() && calendarDate.getMonth() <= startDate.getMonth())
              || calendarDate.getFullYear() < startDate.getFullYear()
          }
          else if (direction === 'next' && unit === 'month') {
            isDisabled = (calendarDate.getFullYear() === endDate.getFullYear() && calendarDate.getMonth() >= endDate.getMonth())
              || calendarDate.getFullYear() > endDate.getFullYear()
          }
        }
      }
      // Also check min/max date constraints
      else if (!isDisabled) {
        isDisabled = !!(
          (direction === 'prev' && unit === 'year' && minDate && calendarDate.getFullYear() <= minDate.getFullYear())
          || (direction === 'next' && unit === 'year' && maxDate && calendarDate.getFullYear() >= maxDate.getFullYear())
          || (direction === 'prev' && unit === 'month' && minDate
            && calendarDate.getFullYear() === minDate.getFullYear() && calendarDate.getMonth() <= minDate.getMonth())
          || (direction === 'next' && unit === 'month' && maxDate
            && calendarDate.getFullYear() === maxDate.getFullYear() && calendarDate.getMonth() >= maxDate.getMonth())
        )
      }

      return normalize.button({
        ...parts.navigationButton.attrs,
        'type': 'button',
        'disabled': isDisabled || undefined,
        'aria-label': `Navigate ${direction} one ${unit}`,
        'data-direction': direction,
        'data-unit': unit,
        onClick() {
          if (isDisabled)
            return

          if (direction === 'prev' && unit === 'month') {
            send({ type: 'NAVIGATE_PREVIOUS_MONTH' })
          }
          else if (direction === 'next' && unit === 'month') {
            send({ type: 'NAVIGATE_NEXT_MONTH' })
          }
          else if (direction === 'prev' && unit === 'year') {
            send({ type: 'NAVIGATE_PREVIOUS_YEAR' })
          }
          else if (direction === 'next' && unit === 'year') {
            send({ type: 'NAVIGATE_NEXT_YEAR' })
          }
        },
      })
    },

    getMonthYearSelectionProps(type) {
      const currentValue = type === 'month'
        ? monthLabels[calendarDate.getMonth()]
        : calendarDate.getFullYear().toString()

      return normalize.button({
        'type': 'button',
        disabled,
        'aria-label': `${currentValue}. Select ${type}`,
        'data-type': type,
        onClick() {
          if (disabled)
            return
          const eventType = type === 'month' ? 'SHOW_MONTH_SELECTION' : 'SHOW_YEAR_SELECTION'
          send({ type: eventType })
        },
      })
    },

    getDateGridProps() {
      return normalize.element({
        ...parts.dateGrid.attrs,
        'role': 'grid',
        'aria-label': `${monthLabels[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`,
        'hidden': view !== 'date',
      })
    },

    getDayOfWeekHeaderProps(dayIndex) {
      return normalize.element({
        ...parts.dayOfWeekHeader.attrs,
        'role': 'columnheader',
        'aria-label': dayOfWeekLabels[dayIndex],
        'data-day-index': dayIndex,
      })
    },

    getDateButtonProps(date) {
      const isRangeMode = selectionMode === 'range'
      const isSelected = isRangeMode
        ? (startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate))
        : (startDate && isSameDay(date, startDate))
      const isToday = isSameDay(date, today())
      // Base disabled state (outside min/max range or component disabled)
      let isDisabled = disabled || (minDate && maxDate && !isWithinInterval(date, { start: minDate, end: maxDate })) || (minDate && !maxDate && isBefore(date, minDate)) || (!minDate && maxDate && isAfter(date, maxDate))

      // Range mode additional constraints
      if (isRangeMode && !isDisabled) {
        if (activeInput === 'end' && startDate) {
          // When selecting end date, disable dates before start date
          isDisabled = date < startDate
        }
        else if (activeInput === 'start' && endDate) {
          // When selecting start date, disable dates after end date
          isDisabled = date > endDate
        }
      }
      const isFocused = isSameDay(date, calendarDate)
      const month = date.getMonth()
      const currentMonth = calendarDate.getMonth()

      // Range-specific states
      const isRangeStart = isRangeMode && startDate && isSameDay(date, startDate)
      const isRangeEnd = isRangeMode && endDate && isSameDay(date, endDate)
      const isInRange = isRangeMode && startDate && endDate && isDateInRange(date, startDate, endDate)

      // Show hover range when selecting complementary date (not reselecting same type)
      const isInHoverRange = isRangeMode && hoverDate && (
        (startDate && activeInput === 'end' && isDateInRange(date, startDate, null, hoverDate) && !isSameDay(date, startDate)) // Has start, selecting end (exclude start date)
        || (endDate && activeInput === 'start' && isDateInRange(date, hoverDate, endDate, null) && !isSameDay(date, endDate)) // Has end, selecting start (exclude end date)
      )

      // Active input highlighting
      const isActiveInputDate = isRangeMode && (
        (activeInput === 'start' && startDate && isSameDay(date, startDate))
        || (activeInput === 'end' && endDate && isSameDay(date, endDate))
      )

      const monthContext = month < currentMonth
        ? 'prev'
        : month > currentMonth ? 'next' : 'current'

      return normalize.button({
        ...parts.dateButton.attrs,
        'type': 'button',
        'disabled': isDisabled ? true : undefined,
        'tabIndex': isSelected ? 0 : -1,
        'aria-label': `${date.getDate()} ${monthLabels[month]} ${date.getFullYear()} ${dayOfWeekLabels[date.getDay()]}`,
        'aria-selected': isSelected || undefined,
        'data-value': formatDate(date, 'yyyy-MM-dd'),
        'data-day': date.getDate(),
        'data-month': month,
        'data-year': date.getFullYear(),
        'data-selected': isSelected,
        'data-today': isToday,
        'data-disabled': isDisabled,
        'data-focus': isFocused,
        'data-month-context': monthContext,
        'data-range-start': isRangeStart || undefined,
        'data-range-end': isRangeEnd || undefined,
        'data-in-range': isInRange || undefined,
        'data-range-hover': isInHoverRange || undefined,
        'data-active-input': isActiveInputDate ? activeInput : undefined,
        onClick() {
          if (isDisabled)
            return
          send({ type: 'SELECT_DATE', date })
        },
        onKeyDown(event) {
          if (isDisabled)
            return

          switch (event.key) {
            case 'Enter':
            case ' ':
              event.preventDefault()
              send({ type: 'SELECT_DATE', date })
              break
            case 'Escape':
              if (isRangeMode && startDate && !endDate) {
                event.preventDefault()
                send({ type: 'CLEAR_RANGE' })
              }
              break
            case 'ArrowLeft':
              event.preventDefault()
              send({ type: 'NAVIGATE_DATE', direction: 'prev', unit: 'day' })
              break
            case 'ArrowRight':
              event.preventDefault()
              send({ type: 'NAVIGATE_DATE', direction: 'next', unit: 'day' })
              break
            case 'ArrowUp':
              event.preventDefault()
              send({ type: 'NAVIGATE_DATE', direction: 'prev', unit: 'week' })
              break
            case 'ArrowDown':
              event.preventDefault()
              send({ type: 'NAVIGATE_DATE', direction: 'next', unit: 'week' })
              break
            case 'Home': {
              event.preventDefault()
              send({ type: 'NAVIGATE_DATE', direction: 'prev', unit: 'day', amount: date.getDay() })
              break
            }
            case 'End': {
              event.preventDefault()
              send({ type: 'NAVIGATE_DATE', direction: 'next', unit: 'day', amount: 6 - date.getDay() })
              break
            }
            case 'PageUp':
              event.preventDefault()
              if (event.shiftKey) {
                send({ type: 'NAVIGATE_DATE', direction: 'prev', unit: 'year' })
              }
              else {
                send({ type: 'NAVIGATE_DATE', direction: 'prev', unit: 'month' })
              }
              break
            case 'PageDown':
              event.preventDefault()
              if (event.shiftKey) {
                send({ type: 'NAVIGATE_DATE', direction: 'next', unit: 'year' })
              }
              else {
                send({ type: 'NAVIGATE_DATE', direction: 'next', unit: 'month' })
              }
              break
          }
        },
        onMouseEnter() {
          if (!isDisabled) {
            send({ type: 'HOVER_DATE', date })
          }
        },
        onMouseLeave() {
          if (!isDisabled && isRangeMode && hoverDate) {
            // Clear hover state by setting it to the current date momentarily
            // This will be handled properly in the machine's hover logic
          }
        },
      })
    },

    getMonthSelectionProps() {
      return normalize.element({
        ...parts.monthSelection.attrs,
        'role': 'grid',
        'aria-label': 'Select month',
        'tabIndex': -1,
        'hidden': view !== 'month',
      })
    },

    getMonthButtonProps(month) {
      const isSelected = month === calendarDate.getMonth()
      const isFocused = month === (context.get('focusedMonth') ?? calendarDate.getMonth())
      let isDisabled = disabled

      // Add range-specific disabled logic for selected date range
      if (!isDisabled && selectionMode === 'range') {
        const testDate = new Date(calendarDate.getFullYear(), month, 1)
        const lastDayOfMonth = new Date(calendarDate.getFullYear(), month + 1, 0)

        if (activeInput === 'end' && startDate) {
          // When selecting end date, disable months before start date
          isDisabled = lastDayOfMonth < startDate
        }
        else if (activeInput === 'start' && endDate) {
          // When selecting start date, disable months after end date
          isDisabled = testDate > endDate
        }
        else if (startDate && endDate) {
          // When both dates selected, disable months outside range
          isDisabled = lastDayOfMonth < startDate || testDate > endDate
        }
      }
      // Also check min/max date constraints
      else if (!isDisabled && minDate && maxDate) {
        const testDate = new Date(calendarDate.getFullYear(), month, 1)
        const lastDayOfMonth = new Date(calendarDate.getFullYear(), month + 1, 0)
        // Disable if entire month is outside the allowed range
        isDisabled = lastDayOfMonth < minDate || testDate > maxDate
      }

      return normalize.button({
        ...parts.monthButton.attrs,
        'type': 'button',
        'disabled': isDisabled,
        'tabIndex': isFocused ? 0 : -1,
        'aria-selected': isSelected,
        'data-value': month,
        'data-label': monthLabels[month],
        'data-selected': isSelected,
        'data-focus': isFocused,
        onClick() {
          if (isDisabled)
            return
          send({ type: 'SELECT_MONTH', month })
        },
        onKeyDown(event) {
          if (isDisabled)
            return

          switch (event.key) {
            case 'Enter':
            case ' ':
              event.preventDefault()
              send({ type: 'SELECT_MONTH', month })
              break
            case 'ArrowLeft':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'prev' })
              break
            case 'ArrowRight':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'next' })
              break
            case 'ArrowUp':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'prev', amount: 3 })
              break
            case 'ArrowDown':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'next', amount: 3 })
              break
            case 'Home':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'prev', amount: month % 3 })
              break
            case 'End':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'next', amount: 2 - (month % 3) })
              break
            case 'PageUp':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'prev', amount: 12 })
              break
            case 'PageDown':
              event.preventDefault()
              send({ type: 'NAVIGATE_MONTH', direction: 'next', amount: 12 })
              break
          }
        },
      })
    },

    getYearSelectionProps() {
      return normalize.element({
        ...parts.yearSelection.attrs,
        'role': 'grid',
        'aria-label': 'Select year',
        'tabIndex': -1,
        'hidden': view !== 'year',
      })
    },

    getDecadeNavigationProps(direction) {
      const yearChunk = context.get('yearChunk')
      const focusedYear = context.get('focusedYear') ?? calendarDate.getFullYear()
      let isDisabled = disabled

      // Check selected date range constraints for range mode
      if (!isDisabled && selectionMode === 'range') {
        if (activeInput === 'end' && startDate) {
          // When selecting end date, disable decade navigation before start date
          if (direction === 'prev') {
            isDisabled = focusedYear - yearChunk < startDate.getFullYear()
          }
        }
        else if (activeInput === 'start' && endDate) {
          // When selecting start date, disable decade navigation after end date
          if (direction === 'next') {
            isDisabled = focusedYear + yearChunk > endDate.getFullYear()
          }
        }
        else if (startDate && endDate) {
          // When both dates selected, disable decade navigation outside range
          if (direction === 'prev') {
            isDisabled = focusedYear - yearChunk < startDate.getFullYear()
          }
          else if (direction === 'next') {
            isDisabled = focusedYear + yearChunk > endDate.getFullYear()
          }
        }
      }
      // Also check min/max date constraints
      else if (!isDisabled) {
        isDisabled = !!(
          (direction === 'prev' && minDate && focusedYear - yearChunk < minDate.getFullYear())
          || (direction === 'next' && maxDate && focusedYear + yearChunk > maxDate.getFullYear())
        )
      }

      return normalize.button({
        'type': 'button',
        'disabled': isDisabled || undefined,
        'aria-label': `Navigate ${direction} ${yearChunk} years`,
        'data-direction': direction,
        onClick() {
          if (isDisabled)
            return
          const eventType = direction === 'prev' ? 'NAVIGATE_PREVIOUS_YEAR_CHUNK' : 'NAVIGATE_NEXT_YEAR_CHUNK'
          send({ type: eventType })
        },
      })
    },

    getYearButtonProps(year) {
      const isSelected = year === calendarDate.getFullYear()
      const isFocused = year === (context.get('focusedYear') ?? calendarDate.getFullYear())
      let isDisabled = disabled

      // Add range-specific disabled logic for selected date range
      if (!isDisabled && selectionMode === 'range') {
        const yearStart = new Date(year, 0, 1)
        const yearEnd = new Date(year, 11, 31)

        if (activeInput === 'end' && startDate) {
          // When selecting end date, disable years before start date
          isDisabled = yearEnd < startDate
        }
        else if (activeInput === 'start' && endDate) {
          // When selecting start date, disable years after end date
          isDisabled = yearStart > endDate
        }
        else if (startDate && endDate) {
          // When both dates selected, disable years outside range
          isDisabled = yearEnd < startDate || yearStart > endDate
        }
      }
      // Also check min/max date constraints
      else if (!isDisabled && (minDate || maxDate)) {
        const yearStart = new Date(year, 0, 1)
        const yearEnd = new Date(year, 11, 31)
        isDisabled = !!(minDate && yearEnd < minDate) || !!(maxDate && yearStart > maxDate)
      }

      return normalize.button({
        ...parts.yearButton.attrs,
        'type': 'button',
        'disabled': isDisabled,
        'tabIndex': isFocused ? 0 : -1,
        'aria-selected': isSelected,
        'data-value': year,
        'data-selected': isSelected,
        'data-focus': isFocused,
        onClick() {
          if (isDisabled)
            return
          send({ type: 'SELECT_YEAR', year })
        },
        onKeyDown(event) {
          if (isDisabled)
            return

          switch (event.key) {
            case 'Enter':
            case ' ':
              event.preventDefault()
              send({ type: 'SELECT_YEAR', year })
              break
            case 'ArrowLeft':
              event.preventDefault()
              send({ type: 'NAVIGATE_YEAR', direction: 'prev' })
              break
            case 'ArrowRight':
              event.preventDefault()
              send({ type: 'NAVIGATE_YEAR', direction: 'next' })
              break
            case 'ArrowUp':
              event.preventDefault()
              send({ type: 'NAVIGATE_YEAR', direction: 'prev', amount: 3 })
              break
            case 'ArrowDown':
              event.preventDefault()
              send({ type: 'NAVIGATE_YEAR', direction: 'next', amount: 3 })
              break
            case 'Home': {
              event.preventDefault()
              const focusedYear = context.get('focusedYear') ?? calendarDate.getFullYear()
              const yearChunk = context.get('yearChunk')
              const chunkStart = Math.floor(focusedYear / yearChunk) * yearChunk
              send({ type: 'NAVIGATE_YEAR', direction: 'prev', amount: year - chunkStart })
              break
            }
            case 'End': {
              event.preventDefault()
              const focusedYearEnd = context.get('focusedYear') ?? calendarDate.getFullYear()
              const yearChunkEnd = context.get('yearChunk')
              const chunkEnd = Math.floor(focusedYearEnd / yearChunkEnd) * yearChunkEnd + yearChunkEnd - 1
              send({ type: 'NAVIGATE_YEAR', direction: 'next', amount: chunkEnd - year })
              break
            }
            case 'PageUp':
              event.preventDefault()
              send({ type: 'NAVIGATE_PREVIOUS_YEAR_CHUNK' })
              break
            case 'PageDown':
              event.preventDefault()
              send({ type: 'NAVIGATE_NEXT_YEAR_CHUNK' })
              break
          }
        },
      })
    },

    // Grid generation methods for template cloning
    getWeekDays() {
      return dayOfWeekLabels.map((label, index) => ({
        label,
        index,
        props: this.getDayOfWeekHeaderProps(index),
      }))
    },

    getCalendarDates() {
      const weeks = this.getWeeksInMonth(calendarDate)
      return weeks.flat().filter(date => date !== null).map(date => ({
        date,
        props: this.getDateButtonProps(date),
      }))
    },

    getWeeksInMonth(date: Date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDayOfMonth = new Date(year, month, 1)
      const lastDayOfMonth = new Date(year, month + 1, 0)
      const daysInMonth = lastDayOfMonth.getDate()
      const startingDayOfWeek = firstDayOfMonth.getDay()

      const weeks: (Date | null)[][] = []
      let currentWeek: (Date | null)[] = []

      // Fill cells before first day with previous month dates
      const prevMonth = month === 0 ? 11 : month - 1
      const prevMonthYear = month === 0 ? year - 1 : year
      const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

      for (let i = 0; i < startingDayOfWeek; i++) {
        const dayOfPrevMonth = prevMonthLastDay - (startingDayOfWeek - 1 - i)
        currentWeek.push(new Date(prevMonthYear, prevMonth, dayOfPrevMonth))
      }

      // Add all days of the current month
      for (let day = 1; day <= daysInMonth; day++) {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek)
          currentWeek = []
        }
        currentWeek.push(new Date(year, month, day))
      }

      // Fill remaining cells in last week with next month dates
      const nextMonth = month === 11 ? 0 : month + 1
      const nextMonthYear = month === 11 ? year + 1 : year
      let nextMonthDay = 1

      while (currentWeek.length < 7) {
        currentWeek.push(new Date(nextMonthYear, nextMonth, nextMonthDay))
        nextMonthDay++
      }
      weeks.push(currentWeek)

      return weeks
    },

    getMonthsGrid() {
      return monthLabels.map((label, index) => ({
        month: index,
        label,
        props: this.getMonthButtonProps(index),
      }))
    },

    getYearsGrid() {
      const focusedYear = context.get('focusedYear') ?? calendarDate.getFullYear()
      const yearChunk = context.get('yearChunk') ?? 12
      const startYear = Math.floor(focusedYear / yearChunk) * yearChunk
      const years = []

      for (let i = 0; i < yearChunk; i++) {
        const year = startYear + i
        years.push({
          year,
          props: this.getYearButtonProps(year),
        })
      }

      return years
    },

    getYearRange() {
      const focusedYear = context.get('focusedYear') ?? calendarDate.getFullYear()
      const yearChunk = context.get('yearChunk') ?? 12
      const startYear = Math.floor(focusedYear / yearChunk) * yearChunk
      return {
        start: startYear,
        end: startYear + yearChunk - 1,
        display: `${startYear} - ${startYear + yearChunk - 1}`,
      }
    },

    getStartInputProps() {
      if (selectionMode !== 'range') {
        // Return the same as getInputProps for backward compatibility
        return this.getInputProps()
      }

      return normalize.input({
        ...parts.input.attrs,
        'id': `${dom.getInputId(scope)}-start`,
        'type': 'text',
        'value': startInputValue,
        disabled,
        'readOnly': readonly,
        'aria-invalid': !isStartInputValid,
        'aria-describedby': startValidationMessage ? `${dom.getStatusId(scope)}-start` : undefined,
        'placeholder': 'MM/dd/yyyy',
        'aria-label': 'Start date',
        onChange(event) {
          const target = event.target as HTMLInputElement
          send({ type: 'START_INPUT_CHANGE', value: target.value })
        },
        // onFocus() {
        //   if (!disabled && !readonly) {
        //     send({ type: 'START_INPUT_FOCUS' })
        //   }
        // },
        onKeyDown(event) {
          if (disabled || readonly)
            return

          switch (event.key) {
            case 'Enter':
              event.preventDefault()
              // if (isStartInputValid && startDate) {
              //   // Focus end input after valid start date entry
              //   send({ type: 'END_INPUT_FOCUS' })
              // }
              break
            case 'ArrowDown':
            case 'ArrowUp':
              event.preventDefault()
              send({ type: 'OPEN' })
              break
            case 'Escape':
              if (open) {
                event.preventDefault()
                send({ type: 'CLOSE' })
              }
              break
          }
        },
      })
    },

    getEndInputProps() {
      if (selectionMode !== 'range') {
        // Return empty props for single mode
        return {}
      }

      return normalize.input({
        ...parts.input.attrs,
        'id': `${dom.getInputId(scope)}-end`,
        'type': 'text',
        'value': endInputValue,
        disabled,
        'readOnly': readonly,
        'aria-invalid': !isEndInputValid,
        'aria-describedby': endValidationMessage ? `${dom.getStatusId(scope)}-end` : undefined,
        'placeholder': 'MM/dd/yyyy',
        'aria-label': 'End date',
        onChange(event) {
          const target = event.target as HTMLInputElement
          send({ type: 'END_INPUT_CHANGE', value: target.value })
        },
        // onFocus() {
        //   if (!disabled && !readonly) {
        //     send({ type: 'END_INPUT_FOCUS' })
        //   }
        // },
        onKeyDown(event) {
          if (disabled || readonly)
            return

          switch (event.key) {
            case 'Enter':
              event.preventDefault()
              if (isEndInputValid && endDate) {
                send({ type: 'CLOSE' })
              }
              break
            case 'ArrowDown':
            case 'ArrowUp':
              event.preventDefault()
              send({ type: 'OPEN' })
              break
            case 'Escape':
              if (open) {
                event.preventDefault()
                send({ type: 'CLOSE' })
              }
              break
          }
        },
      })
    },

    getMonthPickerProps() {
      return normalize.element({
        ...parts.monthPicker.attrs,
        id: dom.getMonthPickerId(scope),
        hidden: view !== 'month',
      })
    },

    getYearPickerProps() {
      return normalize.element({
        ...parts.yearPicker.attrs,
        id: dom.getYearPickerId(scope),
        hidden: view !== 'year',
      })
    },
  }
}
