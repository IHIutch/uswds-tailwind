import type { Params } from '@zag-js/core'
import type { DatePickerSchema, SelectionMode } from './date-picker.types'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { raf } from '@zag-js/dom-query'
import * as dom from './date-picker.dom'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  formatDate,
  getLocaleStrings,
  isWithinInterval,
  parseDate,
  today,
} from './date-picker.utils'

export const machine = createMachine<DatePickerSchema>({
  props({ props }) {
    const { selectionMode = 'single', defaultStartValue, defaultEndValue } = props
    const localeStrings = getLocaleStrings()

    return {
      ...props,
      selectionMode,
      calendarDate: defaultStartValue ? parseDate(defaultStartValue) : today(),
      startValue: defaultStartValue,
      endValue: defaultEndValue,
      hoverDate: null,
      activeInput: null,
      isStartInputValid: true,
      isEndInputValid: true,
      startValidationMessage: '',
      endValidationMessage: '',
      focusedMonth: null,
      focusedYear: null,
      yearChunk: 12,
      ...localeStrings,
    }
  },

  initialState({ prop }) {
    const open = prop('open') ?? prop('defaultOpen')
    return open ? 'dateSelection' : 'closed'
  },

  context({ bindable, prop }) {
    const open = prop('open')

    return {
      open: bindable(() => ({ defaultValue: open })),
      selectionMode: bindable<SelectionMode>(() => ({ defaultValue: prop('selectionMode') ?? 'single' })),
      calendarDate: bindable(() => ({ defaultValue: today() })),
      startDate: bindable<Date | null>(() => ({ defaultValue: null })),
      endDate: bindable<Date | null>(() => ({ defaultValue: null })),
      hoverDate: bindable<Date | null>(() => ({ defaultValue: null })),
      activeInput: bindable<'start' | 'end' | null>(() => ({ defaultValue: null })),
      minDate: bindable<Date | null>(() => ({ defaultValue: null })),
      maxDate: bindable<Date | null>(() => ({ defaultValue: null })),
      // Range mode inputs
      startInputValue: bindable(() => ({ defaultValue: '' })),
      endInputValue: bindable(() => ({ defaultValue: '' })),
      isStartInputValid: bindable(() => ({ defaultValue: true })),
      isEndInputValid: bindable(() => ({ defaultValue: true })),
      startValidationMessage: bindable(() => ({ defaultValue: '' })),
      endValidationMessage: bindable(() => ({ defaultValue: '' })),
      // Single mode inputs (backward compatibility)
      isInputValid: bindable(() => ({ defaultValue: true })),
      validationMessage: bindable(() => ({ defaultValue: '' })),
      focusedMonth: bindable<number | null>(() => ({ defaultValue: null })),
      focusedYear: bindable<number | null>(() => ({ defaultValue: null })),
      monthLabels: bindable(() => ({ defaultValue: getLocaleStrings().monthLabels })),
      dayOfWeekLabels: bindable(() => ({ defaultValue: getLocaleStrings().dayOfWeekLabels })),
      dayOfWeekAbbreviations: bindable(() => ({ defaultValue: getLocaleStrings().dayOfWeekAbbreviations })),
      yearChunk: bindable(() => ({ defaultValue: 12 })),
    }
  },

  watch({ track, send, prop }) {
    track([() => prop('open')], () => {
      const controlled = prop('open')
      if (controlled === undefined)
        return
      send({ type: controlled ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
    })

    track([() => prop('startValue'), () => prop('endValue')], () => {
      const controlled = prop('startValue')
      const controlledEnd = prop('endValue')
      if (controlled === undefined || controlledEnd === undefined)
        return
      send({ type: 'CONTROLLED.VALUE_CHANGE', value: { start: controlled, end: controlledEnd } })
    })
  },

  states: {
    closed: {
      on: {
        'TOGGLE': {
          target: 'dateSelection',
          actions: ['updateCalendarDate'],
        },
        'OPEN': {
          target: 'dateSelection',
          actions: ['updateCalendarDate'],
        },
        'START_INPUT_CHANGE': {
          actions: ['updateStartInputValue', 'validateStartInput'],
        },
        'END_INPUT_CHANGE': {
          actions: ['updateEndInputValue', 'validateEndInput'],
        },
        'INPUT_FOCUS': {
          target: 'dateSelection',
          actions: ['updateCalendarDate'],
        },
        'START_INPUT_FOCUS': {
          target: 'dateSelection',
          actions: ['setActiveInput', 'updateCalendarDate', 'focusCalendarDate'],
        },
        'END_INPUT_FOCUS': {
          target: 'dateSelection',
          actions: ['setActiveInput', 'updateCalendarDate', 'focusCalendarDate'],
        },
        'CONTROLLED.OPEN': { target: 'dateSelection' },
        'CONTROLLED.VALUE_CHANGE': {
          actions: ['setControlledValue', 'invokeOnValueChange'],
        },
      },
    },

    dateSelection: {
      effects: ['trackInteractOutside', 'trackFocusVisible'],
      entry: ['focusCalendarDate', 'invokeOnOpenChange'],
      on: {
        'TOGGLE': { target: 'closed', actions: ['invokeOnOpenChange'] },
        'CLOSE': { target: 'closed', actions: ['invokeOnOpenChange'] },
        'ESCAPE': { target: 'closed', actions: ['invokeOnOpenChange'] },

        'SELECT_DATE': [
          {
            guard({ context }: Params<DatePickerSchema>) {
              return context.get('selectionMode') === 'single'
            },
            actions: ['selectDate', 'invokeOnValueChange', 'focusInput'],
            target: 'closed',
          },
          {
            guard({ context }: Params<DatePickerSchema>) {
              const selectionMode = context.get('selectionMode')
              const activeInput = context.get('activeInput')
              return selectionMode === 'range' && activeInput === 'start'
            },
            actions: ['selectDate', 'invokeOnValueChange', 'focusInput'],
            target: 'closed',
          },
          {
            guard({ context }: Params<DatePickerSchema>) {
              const selectionMode = context.get('selectionMode')
              const activeInput = context.get('activeInput')
              return selectionMode === 'range' && activeInput === 'end'
            },
            actions: ['selectDate', 'invokeOnValueChange', 'focusInput'],
            target: 'closed',
          },
          {
            guard({ context }: Params<DatePickerSchema>) {
              return context.get('selectionMode') === 'range'
            },
            actions: ['selectDate'],
          },
        ],

        'START_RANGE': {
          actions: ['selectRangeStart'],
        },
        'END_RANGE': {
          actions: ['selectRangeEnd', 'invokeOnValueChange', 'focusInput'],
          target: 'closed',
        },
        'CLEAR_RANGE': {
          actions: ['clearRange', 'invokeOnValueChange'],
        },
        'SHOW_MONTH_SELECTION': { target: 'monthSelection' },
        'SHOW_YEAR_SELECTION': { target: 'yearSelection' },
        'NAVIGATE_DATE': {
          actions: ['navigateDate'],
        },
        'NAVIGATE_PREVIOUS_MONTH': {
          actions: ['navigatePreviousMonth'],
        },
        'NAVIGATE_NEXT_MONTH': {
          actions: ['navigateNextMonth'],
        },
        'NAVIGATE_PREVIOUS_YEAR': {
          actions: ['navigatePreviousYear'],
        },
        'NAVIGATE_NEXT_YEAR': {
          actions: ['navigateNextYear'],
        },
        'START_INPUT_CHANGE': {
          actions: ['updateStartInputValue', 'validateStartInput'],
        },
        'END_INPUT_CHANGE': {
          actions: ['updateEndInputValue', 'validateEndInput'],
        },
        'START_INPUT_FOCUS': {
          actions: ['setActiveInput'],
        },
        'END_INPUT_FOCUS': {
          actions: ['setActiveInput'],
        },
        'HOVER_DATE': {
          actions: ['handleDateHover'],
        },
        'CONTROLLED.CLOSE': { target: 'closed' },
        'CONTROLLED.VALUE_CHANGE': {
          actions: ['setControlledValue', 'invokeOnValueChange'],
        },
      },
    },

    monthSelection: {
      effects: ['trackInteractOutside'],
      entry: ['focusCurrentMonth'],
      on: {
        'ESCAPE': { target: 'dateSelection' },
        'CLOSE': { target: 'closed', actions: ['invokeOnOpenChange'] },

        'SELECT_MONTH': {
          actions: ['selectMonth'],
          target: 'dateSelection',
        },

        'NAVIGATE_MONTH': {
          actions: ['navigateMonthSelection'],
        },

        'CONTROLLED.CLOSE': { target: 'closed' },
      },
    },

    yearSelection: {
      effects: ['trackInteractOutside'],
      entry: ['focusCurrentYear'],
      on: {
        'ESCAPE': { target: 'dateSelection' },
        'CLOSE': { target: 'closed', actions: ['invokeOnOpenChange'] },

        'SELECT_YEAR': {
          actions: ['selectYear'],
          target: 'dateSelection',
        },

        'NAVIGATE_YEAR': {
          actions: ['navigateYearSelection'],
        },

        'NAVIGATE_PREVIOUS_YEAR_CHUNK': {
          actions: ['navigatePreviousYearChunk'],
        },

        'NAVIGATE_NEXT_YEAR_CHUNK': {
          actions: ['navigateNextYearChunk'],
        },

        'CONTROLLED.CLOSE': { target: 'closed' },
      },
    },
  },

  implementations: {
    actions: {
      // Input handling
      // updateInputValue({ context, event }) {
      //   if (event.type !== 'INPUT_CHANGE')
      //     return
      //   context.set('externalInputValue', event.value)
      // },

      updateStartInputValue({ context, event }) {
        if (event.type !== 'START_INPUT_CHANGE')
          return
        context.set('startInputValue', event.value)
      },

      updateEndInputValue({ context, event }) {
        if (event.type !== 'END_INPUT_CHANGE')
          return
        context.set('endInputValue', event.value)
      },

      validateStartInput({ context }) {
        const startInputValue = context.get('startInputValue')
        const startDate = startInputValue ? parseDate(startInputValue, 'MM/dd/yyyy') : null
        const minDate = context.get('minDate')
        const maxDate = context.get('maxDate')
        const endDate = context.get('endDate')

        let isValid = true
        let validationMessage = ''

        if (startDate && minDate && maxDate) {
          if (!isWithinInterval(startDate, { start: minDate, end: maxDate })) {
            isValid = false
            validationMessage = 'Start date is outside allowed range'
          }
          else if (endDate && startDate > endDate) {
            isValid = false
            validationMessage = 'Start date must be before end date'
          }
        }
        else if (startInputValue) {
          isValid = false
          validationMessage = 'Please enter a valid start date'
        }

        context.set('startDate', startDate)
        context.set('isStartInputValid', isValid)
        context.set('startValidationMessage', validationMessage)
      },

      validateEndInput({ context }) {
        const endInputValue = context.get('endInputValue')
        const endDate = endInputValue ? parseDate(endInputValue, 'MM/dd/yyyy') : null
        const minDate = context.get('minDate')
        const maxDate = context.get('maxDate')
        const startDate = context.get('startDate')

        let isValid = true
        let validationMessage = ''

        if (endDate && minDate && maxDate) {
          if (!isWithinInterval(endDate, { start: minDate, end: maxDate })) {
            isValid = false
            validationMessage = 'End date is outside allowed range'
          }
          else if (startDate && endDate < startDate) {
            isValid = false
            validationMessage = 'End date must be after start date'
          }
        }
        else if (endInputValue) {
          isValid = false
          validationMessage = 'Please enter a valid end date'
        }

        context.set('endDate', endDate)
        context.set('isEndInputValid', isValid)
        context.set('endValidationMessage', validationMessage)
      },

      updateCalendarDate({ context }) {
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          // For range mode, focus the selected date based on active input
          if (activeInput === 'start' && startDate) {
            context.set('calendarDate', startDate)
          }
          else if (activeInput === 'end' && endDate) {
            context.set('calendarDate', endDate)
          }
          else if (startDate) {
            // Fallback to start date if available
            context.set('calendarDate', startDate)
          }
          else if (endDate) {
            // Fallback to end date if available
            context.set('calendarDate', endDate)
          }
        }
        else {
          // Single mode (backward compatibility)
          const isValid = context.get('isInputValid')
          if (isValid && startDate) {
            context.set('calendarDate', startDate)
          }
        }
      },

      setControlledValue({ context, event }) {
        if (event.type !== 'CONTROLLED.VALUE_CHANGE')
          return

        const selectionMode = context.get('selectionMode')
        const startDate = event.value.start
        const endDate = event.value.end

        if (selectionMode === 'range') {
          context.set('startDate', startDate ? parseDate(startDate, 'MM/dd/yyyy') : null)
          context.set('endDate', endDate ? parseDate(endDate, 'MM/dd/yyyy') : null)
          context.set('startInputValue', startDate ? formatDate(startDate, 'MM/dd/yyyy') : '')
          context.set('endInputValue', endDate ? formatDate(endDate, 'MM/dd/yyyy') : '')
          // For backward compatibility
          context.set('calendarDate', context.get('startDate') || context.get('endDate') || today())
        }
        else {
          const date = typeof event.value === 'string' ? parseDate(event.value) : null
          context.set('startDate', date)
          context.set('endDate', null)
          context.set('calendarDate', date || today())
        }
      },

      // Date selection
      selectDate({ context, event }) {
        if (event.type !== 'SELECT_DATE')
          return
        const { date } = event
        const selectionMode = context.get('selectionMode')

        if (selectionMode === 'range') {
          const activeInput = context.get('activeInput')
          const startDate = context.get('startDate')
          const endDate = context.get('endDate')

          if (activeInput === 'start') {
            // Setting start date
            context.set('startDate', date)
            context.set('startInputValue', formatDate(date, 'MM/dd/yyyy'))
            context.set('isStartInputValid', true)
            context.set('startValidationMessage', '')

            // If end date exists and is before new start date, clear it
            if (endDate && date > endDate) {
              context.set('endDate', null)
              context.set('endInputValue', '')
            }
          }
          else if (activeInput === 'end') {
            // Setting end date
            context.set('endDate', date)
            context.set('endInputValue', formatDate(date, 'MM/dd/yyyy'))
            context.set('isEndInputValid', true)
            context.set('endValidationMessage', '')

            // If start date exists and is after new end date, clear it
            if (startDate && date < startDate) {
              context.set('startDate', null)
              context.set('startInputValue', '')
            }
          }
          else {
            // No active input, default to start date behavior
            context.set('startDate', date)
            context.set('startInputValue', formatDate(date, 'MM/dd/yyyy'))
            context.set('isStartInputValid', true)
            context.set('startValidationMessage', '')
            context.set('activeInput', 'end')
          }
        }
        else {
          // Single date mode
          context.set('startDate', date)
          context.set('startInputValue', formatDate(date, 'MM/dd/yyyy'))
          context.set('endDate', null)
        }

        context.set('hoverDate', null)

        // Navigate calendar to the selected date's month if it's different
        const currentCalendarDate = context.get('calendarDate')
        if (date.getMonth() !== currentCalendarDate.getMonth() || date.getFullYear() !== currentCalendarDate.getFullYear()) {
          context.set('calendarDate', new Date(date.getFullYear(), date.getMonth(), 1))
        }
      },

      selectRangeStart({ context, event }) {
        if (event.type !== 'START_RANGE')
          return
        const { date } = event
        context.set('startDate', date)
        context.set('endDate', null)
        context.set('hoverDate', null)
        context.set('isInputValid', true)
        context.set('validationMessage', '')
      },

      selectRangeEnd({ context, event }) {
        if (event.type !== 'END_RANGE')
          return
        const { date } = event
        const startDate = context.get('startDate')

        if (startDate) {
          const actualStart = date < startDate ? date : startDate
          const actualEnd = date < startDate ? startDate : date

          context.set('startDate', actualStart)
          context.set('endDate', actualEnd)
          context.set('hoverDate', null)

          context.set('isInputValid', true)
          context.set('validationMessage', '')
        }
      },

      clearRange({ context }) {
        const selectionMode = context.get('selectionMode')

        context.set('startDate', null)
        context.set('endDate', null)
        context.set('hoverDate', null)

        if (selectionMode === 'range') {
          context.set('startInputValue', '')
          context.set('endInputValue', '')
          context.set('isStartInputValid', true)
          context.set('isEndInputValid', true)
          context.set('startValidationMessage', '')
          context.set('endValidationMessage', '')
        }

        // For backward compatibility
        context.set('validationMessage', '')
      },

      clearStartDate({ context }) {
        context.set('startDate', null)
        context.set('startInputValue', '')
        context.set('isStartInputValid', true)
        context.set('startValidationMessage', '')
        context.set('hoverDate', null)
      },

      clearEndDate({ context }) {
        context.set('endDate', null)
        context.set('endInputValue', '')
        context.set('isEndInputValid', true)
        context.set('endValidationMessage', '')
        context.set('hoverDate', null)
      },

      setActiveInput({ context, event }) {
        if (event.type === 'START_INPUT_FOCUS') {
          context.set('activeInput', 'start')
        }
        else if (event.type === 'END_INPUT_FOCUS') {
          context.set('activeInput', 'end')
        }
      },

      // focusStartInput({ scope }) {
      //   raf(() => {
      //     // Try range picker first, fall back to single picker
      //     const startInput = (dom.getStartInputEl(scope) || dom.getInputEl(scope)) as HTMLElement | null
      //     startInput?.focus()
      //   })
      // },

      // focusEndInput({ scope }) {
      //   raf(() => {
      //     const endInput = dom.getEndInputEl(scope) as HTMLElement | null
      //     endInput?.focus()
      //   })
      // },

      selectMonth({ context, event }) {
        if (event.type !== 'SELECT_MONTH')
          return
        const calendarDate = context.get('calendarDate')
        const newDate = new Date(calendarDate)
        newDate.setMonth(event.month)
        context.set('calendarDate', newDate)
      },

      selectYear({ context, event }) {
        if (event.type !== 'SELECT_YEAR')
          return
        const calendarDate = context.get('calendarDate')
        const newDate = new Date(calendarDate)
        newDate.setFullYear(event.year)
        context.set('calendarDate', newDate)
      },

      // Navigation
      navigateDate({ context, event, scope }) {
        if (event.type !== 'NAVIGATE_DATE')
          return

        const { direction, unit = 'day', amount = 1 } = event
        let newDate = context.get('calendarDate')

        switch (unit) {
          case 'day':
            newDate = addDays(newDate, direction === 'next' ? amount : -amount)
            break
          case 'week':
            newDate = addWeeks(newDate, direction === 'next' ? amount : -amount)
            break
          case 'month':
            newDate = addMonths(newDate, direction === 'next' ? amount : -amount)
            break
          case 'year':
            newDate = addYears(newDate, direction === 'next' ? amount : -amount)
            break
        }

        // Keep within min/max bounds and range constraints
        const minDate = context.get('minDate')
        const maxDate = context.get('maxDate')
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        // Apply range-based constraints for keyboard navigation
        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // When navigating end date selection, don't allow going before start date
            if (newDate < startDate) {
              newDate = startDate
            }
          }
          else if (activeInput === 'start' && endDate) {
            // When navigating start date selection, don't allow going after end date
            if (newDate > endDate) {
              newDate = endDate
            }
          }
        }

        // Apply global min/max bounds
        if (minDate && newDate < minDate)
          newDate = minDate
        if (maxDate && newDate > maxDate)
          newDate = maxDate

        context.set('calendarDate', newDate)

        // Focus the new date for keyboard navigation
        raf(() => {
          const focusedEl = dom.getFocusedDateButtonEl(scope, newDate) as HTMLElement | null
          focusedEl?.focus()
        })
      },

      navigatePreviousMonth({ context }) {
        const calendarDate = context.get('calendarDate')
        let newDate = addMonths(calendarDate, -1)

        // Apply range constraints for month navigation
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // Don't navigate before start date's month
            const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
            if (newDate < startMonth) {
              newDate = startMonth
            }
          }
          else if (activeInput === 'start' && endDate) {
            // Don't navigate after end date's month
            const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
            if (newDate > endMonth) {
              newDate = endMonth
            }
          }
        }

        context.set('calendarDate', newDate)

        // Update focus management for end date selection after month navigation
        if (selectionMode === 'range' && activeInput === 'end' && startDate) {
          // Check if start date is in the newly navigated month
          if (startDate.getMonth() === newDate.getMonth() && startDate.getFullYear() === newDate.getFullYear()) {
            // Get the default focused date (typically the 1st of the month)
            const defaultFocusDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1)

            // If start date is greater than the default focus date, focus on start date
            if (startDate > defaultFocusDate) {
              context.set('calendarDate', startDate)
            }
          }
        }
      },

      navigateNextMonth({ context }) {
        const calendarDate = context.get('calendarDate')
        let newDate = addMonths(calendarDate, 1)

        // Apply range constraints for month navigation
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // Don't navigate before start date's month
            const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
            if (newDate < startMonth) {
              newDate = startMonth
            }
          }
          else if (activeInput === 'start' && endDate) {
            // Don't navigate after end date's month
            const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
            if (newDate > endMonth) {
              newDate = endMonth
            }
          }
        }

        context.set('calendarDate', newDate)

        // Update focus management for end date selection after month navigation
        if (selectionMode === 'range' && activeInput === 'end' && startDate) {
          // Check if start date is in the newly navigated month
          if (startDate.getMonth() === newDate.getMonth() && startDate.getFullYear() === newDate.getFullYear()) {
            // Get the default focused date (typically the 1st of the month)
            const defaultFocusDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1)

            // If start date is greater than the default focus date, focus on start date
            if (startDate > defaultFocusDate) {
              context.set('calendarDate', startDate)
            }
          }
        }
      },

      navigatePreviousYear({ context }) {
        const calendarDate = context.get('calendarDate')
        let newDate = addYears(calendarDate, -1)

        // Apply range constraints for year navigation
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // Don't navigate before start date's year
            if (newDate.getFullYear() < startDate.getFullYear()) {
              newDate = new Date(startDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            }
          }
          else if (activeInput === 'start' && endDate) {
            // Don't navigate after end date's year
            if (newDate.getFullYear() > endDate.getFullYear()) {
              newDate = new Date(endDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            }
          }
        }

        context.set('calendarDate', newDate)
      },

      navigateNextYear({ context }) {
        const calendarDate = context.get('calendarDate')
        let newDate = addYears(calendarDate, 1)

        // Apply range constraints for year navigation
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // Don't navigate before start date's year
            if (newDate.getFullYear() < startDate.getFullYear()) {
              newDate = new Date(startDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            }
          }
          else if (activeInput === 'start' && endDate) {
            // Don't navigate after end date's year
            if (newDate.getFullYear() > endDate.getFullYear()) {
              newDate = new Date(endDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            }
          }
        }

        context.set('calendarDate', newDate)

        // Update focus management for end date selection after year navigation
        if (selectionMode === 'range' && activeInput === 'end' && startDate) {
          // Check if start date is in the newly navigated month and year
          if (startDate.getMonth() === newDate.getMonth() && startDate.getFullYear() === newDate.getFullYear()) {
            // Get the default focused date (typically the 1st of the month)
            const defaultFocusDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1)

            // If start date is greater than the default focus date, focus on start date
            if (startDate > defaultFocusDate) {
              context.set('calendarDate', startDate)
            }
          }
        }
      },

      // Month selection navigation
      navigateMonthSelection({ context, event, scope }) {
        if (event.type !== 'NAVIGATE_MONTH')
          return

        const { direction, amount = 1 } = event
        const calendarDate = context.get('calendarDate')
        let newMonth = context.get('focusedMonth') ?? calendarDate.getMonth()

        if (direction === 'next') {
          newMonth = Math.min(11, newMonth + amount)
        }
        else {
          newMonth = Math.max(0, newMonth - amount)
        }

        // Apply range constraints for month selection navigation
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')
        const currentYear = calendarDate.getFullYear()

        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // Don't navigate to months before start date (same year only)
            if (currentYear === startDate.getFullYear() && newMonth < startDate.getMonth()) {
              newMonth = startDate.getMonth()
            }
          }
          else if (activeInput === 'start' && endDate) {
            // Don't navigate to months after end date (same year only)
            if (currentYear === endDate.getFullYear() && newMonth > endDate.getMonth()) {
              newMonth = endDate.getMonth()
            }
          }
        }

        context.set('focusedMonth', newMonth)

        // Focus the new month for keyboard navigation
        raf(() => {
          const focusedEl = dom.getFocusedMonthButtonEl(scope, newMonth) as HTMLElement | null
          focusedEl?.focus()
        })
      },

      // Year selection navigation
      navigateYearSelection({ context, event, scope }) {
        if (event.type !== 'NAVIGATE_YEAR')
          return

        const { direction, amount = 1 } = event
        const calendarDate = context.get('calendarDate')
        let newYear = context.get('focusedYear') ?? calendarDate.getFullYear()

        if (direction === 'next') {
          newYear = newYear + amount
        }
        else {
          newYear = Math.max(0, newYear - amount)
        }

        // Apply range constraints for year selection navigation
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          if (activeInput === 'end' && startDate) {
            // Don't navigate to years before start date
            if (newYear < startDate.getFullYear()) {
              newYear = startDate.getFullYear()
            }
          }
          else if (activeInput === 'start' && endDate) {
            // Don't navigate to years after end date
            if (newYear > endDate.getFullYear()) {
              newYear = endDate.getFullYear()
            }
          }
        }

        context.set('focusedYear', newYear)

        // Focus the new year for keyboard navigation
        raf(() => {
          const focusedEl = dom.getFocusedYearButtonEl(scope, newYear) as HTMLElement | null
          focusedEl?.focus()
        })
      },

      navigatePreviousYearChunk({ context }) {
        const calendarDate = context.get('calendarDate')
        const yearChunk = context.get('yearChunk')
        const currentYear = context.get('focusedYear') ?? calendarDate.getFullYear()
        context.set('focusedYear', Math.max(0, currentYear - yearChunk))
      },

      navigateNextYearChunk({ context }) {
        const calendarDate = context.get('calendarDate')
        const yearChunk = context.get('yearChunk')
        const currentYear = context.get('focusedYear') ?? calendarDate.getFullYear()
        context.set('focusedYear', currentYear + yearChunk)
      },

      // Focus management
      focusCalendarDate({ context, scope }) {
        const calendarDate = context.get('calendarDate')
        raf(() => {
          const focusedEl = dom.getFocusedDateButtonEl(scope, calendarDate) as HTMLElement | null
          focusedEl?.focus()
        })
      },

      focusCurrentMonth({ context, scope }) {
        const calendarDate = context.get('calendarDate')
        const currentMonth = calendarDate.getMonth()
        context.set('focusedMonth', currentMonth)
        raf(() => {
          const focusedEl = dom.getFocusedMonthButtonEl(scope, currentMonth) as HTMLElement | null
          focusedEl?.focus()
        })
      },

      focusCurrentYear({ context, scope }) {
        const calendarDate = context.get('calendarDate')
        const currentYear = calendarDate.getFullYear()
        context.set('focusedYear', currentYear)
        raf(() => {
          const focusedEl = dom.getFocusedYearButtonEl(scope, currentYear) as HTMLElement | null
          focusedEl?.focus()
        })
      },

      // Range handling
      handleDateHover({ context, event }) {
        if (event.type !== 'HOVER_DATE')
          return

        const selectionMode = context.get('selectionMode')
        if (selectionMode === 'range') {
          const startDate = context.get('startDate')
          const endDate = context.get('endDate')
          const currentHoverDate = context.get('hoverDate')

          // Show hover effect when we have one date but not the other
          if ((startDate && !endDate) || (!startDate && endDate)) {
            // Only update if the hover date has actually changed
            if (!currentHoverDate || currentHoverDate.getTime() !== event.date.getTime()) {
              context.set('hoverDate', event.date)
            }
          }
          else if (currentHoverDate) {
            // Clear hover date if we shouldn't be showing hover effect
            context.set('hoverDate', null)
          }
        }
      },

      // Focus management
      focusInput({ context, scope }) {
        const selectionMode = context.get('selectionMode')
        const activeInput = context.get('activeInput')

        raf(() => {
          if (selectionMode === 'range') {
            if (activeInput === 'start') {
              const startInputEl = dom.getStartInputEl(scope)
              startInputEl?.focus()
            }
            else if (activeInput === 'end') {
              const endInputEl = dom.getEndInputEl(scope)
              endInputEl?.focus()
            }
          }
          else {
            // Single mode - focus the main input
            const inputEl = dom.getInputEl(scope)
            inputEl?.focus()
          }
        })
      },

      // Callbacks
      invokeOnValueChange({ context, prop }) {
        const selectionMode = context.get('selectionMode')
        const startDate = context.get('startDate')
        const endDate = context.get('endDate')

        if (selectionMode === 'range') {
          const value = startDate || endDate
          prop('onValueChange')?.({ value: value ? formatDate(value, 'yyyy-MM-dd') : '', valueAsDate: value })
        }
        else {
          const value = startDate ? formatDate(startDate, 'yyyy-MM-dd') : ''
          prop('onValueChange')?.({ value, valueAsDate: startDate })
        }
      },

      invokeOnOpenChange({ state, prop }) {
        const open = !state.matches('closed')
        prop('onOpenChange')?.({ open })
      },
    },

    effects: {
      trackInteractOutside({ scope, prop, send }) {
        const getCalendarEl = () => dom.getCalendarEl(scope)
        const restoreFocus = true

        return trackDismissableElement(getCalendarEl, {
          defer: true,
          exclude: [dom.getTriggerEl(scope)],
          onInteractOutside: prop('onInteractOutside'),
          onFocusOutside: prop('onFocusOutside'),
          onEscapeKeyDown: prop('onEscapeKeyDown'),
          onPointerDownOutside: prop('onPointerDownOutside'),
          onDismiss() {
            send({ type: 'CLOSE', src: 'interact-outside', restoreFocus })
          },
        })
      },

      trackFocusVisible() {
        // Track focus visible state for keyboard navigation
        // Implementation would depend on focus-visible polyfill or native support
        return () => { }
      },
    },
  },
})
