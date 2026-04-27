import type { DatepickerSchema, DateView, DayCell, MonthCell, WeekDay, YearCell } from './date-picker.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import * as dom from './date-picker.dom'

const YEAR_CHUNK = 12
const DEFAULT_MIN_DATE = '0000-01-01'
const DEFAULT_EXTERNAL_DATE_FORMAT = 'MM/DD/YYYY'
const INTERNAL_DATE_FORMAT = 'YYYY-MM-DD'

function keepDateWithinMonth(dateToCheck: Date, month: number) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0)
  }
  return dateToCheck
}

function setDate(year: number, month: number, date: number) {
  const newDate = new Date(0)
  newDate.setFullYear(year, month, date)
  return newDate
}

function today() {
  const newDate = new Date()
  const day = newDate.getDate()
  const month = newDate.getMonth()
  const year = newDate.getFullYear()
  return setDate(year, month, day)
}

function startOfMonth(date: Date) {
  const newDate = new Date(0)
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1)
  return newDate
}

function lastDayOfMonth(date: Date) {
  const newDate = new Date(0)
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0)
  return newDate
}

function addDays(_date: Date, numDays: number) {
  const newDate = new Date(_date.getTime())
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}

const subDays = (_date: Date, numDays: number) => addDays(_date, -numDays)

const addWeeks = (_date: Date, numWeeks: number) => addDays(_date, numWeeks * 7)

const subWeeks = (_date: Date, numWeeks: number) => addWeeks(_date, -numWeeks)

function startOfWeek(_date: Date) {
  const dayOfWeek = _date.getDay()
  return subDays(_date, dayOfWeek)
}

function endOfWeek(_date: Date) {
  const dayOfWeek = _date.getDay()
  return addDays(_date, 6 - dayOfWeek)
}

function addMonths(_date: Date, numMonths: number) {
  const newDate = new Date(_date.getTime())
  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12
  newDate.setMonth(newDate.getMonth() + numMonths)
  keepDateWithinMonth(newDate, dateMonth)
  return newDate
}

const subMonths = (_date: Date, numMonths: number) => addMonths(_date, -numMonths)

const addYears = (_date: Date, numYears: number) => addMonths(_date, numYears * 12)

const subYears = (_date: Date, numYears: number) => addYears(_date, -numYears)

function setMonth(_date: Date, month: number) {
  const newDate = new Date(_date.getTime())
  newDate.setMonth(month)
  keepDateWithinMonth(newDate, month)
  return newDate
}

function setYear(_date: Date, year: number) {
  const newDate = new Date(_date.getTime())
  const month = newDate.getMonth()
  newDate.setFullYear(year)
  keepDateWithinMonth(newDate, month)
  return newDate
}

function dateMin(dateA: Date, dateB: Date) {
  let newDate = dateA
  if (dateB < dateA) {
    newDate = dateB
  }
  return new Date(newDate.getTime())
}

function dateMax(dateA: Date, dateB: Date) {
  let newDate = dateA
  if (dateB > dateA) {
    newDate = dateB
  }
  return new Date(newDate.getTime())
}

function isSameYear(dateA: Date | null | undefined, dateB: Date | null | undefined) {
  return !!dateA && !!dateB && dateA.getFullYear() === dateB.getFullYear()
}

function isSameMonth(dateA: Date | null | undefined, dateB: Date | null | undefined) {
  return isSameYear(dateA, dateB) && dateA!.getMonth() === dateB!.getMonth()
}

function isSameDay(dateA: Date | null | undefined, dateB: Date | null | undefined) {
  return isSameMonth(dateA, dateB) && dateA!.getDate() === dateB!.getDate()
}

function keepDateBetweenMinAndMax(date: Date, minDate: Date, maxDate: Date | null) {
  let newDate = date
  if (date < minDate) {
    newDate = minDate
  }
  else if (maxDate && date > maxDate) {
    newDate = maxDate
  }
  return new Date(newDate.getTime())
}

function isDateWithinMinAndMax(date: Date, minDate: Date, maxDate: Date | null) {
  return date >= minDate && (!maxDate || date <= maxDate)
}

function isDatesMonthOutsideMinOrMax(date: Date, minDate: Date, maxDate: Date | null) {
  return lastDayOfMonth(date) < minDate || (!!maxDate && startOfMonth(date) > maxDate)
}

function isDatesYearOutsideMinOrMax(date: Date, minDate: Date, maxDate: Date | null) {
  return lastDayOfMonth(setMonth(date, 11)) < minDate
    || (!!maxDate && startOfMonth(setMonth(date, 0)) > maxDate)
}

function setRangeDates(date: Date, rangeDate: Date | null) {
  const rangeConclusionDate = date
  const rangeStartDate = rangeDate ? dateMin(rangeConclusionDate, rangeDate) : null
  const rangeEndDate = rangeDate ? dateMax(rangeConclusionDate, rangeDate) : null

  const withinRangeStartDate = rangeDate && rangeStartDate ? addDays(rangeStartDate, 1) : null
  const withinRangeEndDate = rangeDate && rangeEndDate ? subDays(rangeEndDate, 1) : null

  return {
    rangeStartDate,
    rangeEndDate,
    withinRangeStartDate,
    withinRangeEndDate,
  }
}

function parseDateString(dateString: string | undefined | null, dateFormat: string = INTERNAL_DATE_FORMAT, adjustDate: boolean = false) {
  let date: Date | undefined
  let month: number | undefined
  let day: number | undefined
  let year: number | undefined
  let parsed: number

  if (dateString) {
    let monthStr: string | undefined
    let dayStr: string | undefined
    let yearStr: string | undefined

    if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
      ;[monthStr, dayStr, yearStr] = dateString.split('/')
    }
    else {
      ;[yearStr, monthStr, dayStr] = dateString.split('-')
    }

    if (yearStr) {
      parsed = Number.parseInt(yearStr, 10)
      if (!Number.isNaN(parsed)) {
        year = parsed
        if (adjustDate) {
          year = Math.max(0, year)
          if (yearStr.length < 3) {
            const currentYear = today().getFullYear()
            const currentYearStub
              = currentYear - (currentYear % 10 ** yearStr.length)
            year = currentYearStub + parsed
          }
        }
      }
    }

    if (monthStr) {
      parsed = Number.parseInt(monthStr, 10)
      if (!Number.isNaN(parsed)) {
        month = parsed
        if (adjustDate) {
          month = Math.max(1, month)
          month = Math.min(12, month)
        }
      }
    }

    if (month && dayStr && year != null) {
      parsed = Number.parseInt(dayStr, 10)
      if (!Number.isNaN(parsed)) {
        day = parsed
        if (adjustDate) {
          const lastDayOfTheMonth = setDate(year, month, 0).getDate()
          day = Math.max(1, day)
          day = Math.min(lastDayOfTheMonth, day)
        }
      }
    }

    if (month && day && year != null) {
      date = setDate(year, month - 1, day)
    }
  }

  return date
}

function formatDate(date: Date, dateFormat: string = INTERNAL_DATE_FORMAT) {
  const padZeros = (value: number, length: number) => `0000${value}`.slice(-length)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
    return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join('/')
  }

  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join('-')
}

function isDateInputInvalid(dateString: string, minDate: Date, maxDate: Date | null) {
  let isInvalid = false

  if (dateString) {
    isInvalid = true

    const dateStringParts = dateString.split('/')
    const [month, day, year] = dateStringParts.map((str) => {
      let value: number | undefined
      const parsed = Number.parseInt(str, 10)
      if (!Number.isNaN(parsed))
        value = parsed
      return value
    })

    if (month && day && year != null) {
      const checkDate = setDate(year, month - 1, day)

      if (
        checkDate.getMonth() === month - 1
        && checkDate.getDate() === day
        && checkDate.getFullYear() === year
        && dateStringParts[2]!.length === 4
        && isDateWithinMinAndMax(checkDate, minDate, maxDate)
      ) {
        isInvalid = false
      }
    }
  }

  return isInvalid
}

const MONTH_DATE_SEED = Array.from({ length: 12 }).map(
  (_, i) => new Date(0, i),
)
const DAY_OF_WEEK_DATE_SEED = Array.from({ length: 7 }).map(
  (_, i) => new Date(0, 0, i),
)

interface LocaleLabels {
  monthLabels: string[]
  dayOfWeekLabels: string[]
  dayOfWeekNarrow: string[]
}

const labelsByLocale = new Map<string, LocaleLabels>()

function getLocaleLabels(locale: string) {
  if (!labelsByLocale.has(locale)) {
    labelsByLocale.set(locale, {
      monthLabels: MONTH_DATE_SEED.map(date =>
        date.toLocaleString(locale, { month: 'long' }),
      ),
      dayOfWeekLabels: DAY_OF_WEEK_DATE_SEED.map(date =>
        date.toLocaleString(locale, { weekday: 'long' }),
      ),
      dayOfWeekNarrow: DAY_OF_WEEK_DATE_SEED.map(date =>
        date.toLocaleString(locale, { weekday: 'narrow' }),
      ),
    })
  }
  return labelsByLocale.get(locale)!
}

function computeWeekDays(locale: string) {
  const { dayOfWeekLabels, dayOfWeekNarrow } = getLocaleLabels(locale)
  return dayOfWeekLabels.map((long, i) => ({
    narrow: dayOfWeekNarrow[i]!,
    long,
  }))
}

function computeWeeks(focusedValue: Date, selectedDate: Date | null, minDate: Date, maxDate: Date | null, rangeDate: Date | null, locale: string) {
  const todaysDate = today()
  const focusedDate = addDays(focusedValue, 0)
  const focusedMonth = focusedValue.getMonth()

  const prevMonth = subMonths(focusedValue, 1)
  const nextMonth = addMonths(focusedValue, 1)

  const { monthLabels, dayOfWeekLabels } = getLocaleLabels(locale)

  const {
    rangeStartDate,
    rangeEndDate,
    withinRangeStartDate,
    withinRangeEndDate,
  } = setRangeDates(selectedDate || focusedValue, rangeDate)

  const firstOfMonth = startOfMonth(focusedValue)
  let dateToDisplay = startOfWeek(firstOfMonth)

  const days: DayCell[] = []

  while (
    days.length < 28
    || dateToDisplay.getMonth() === focusedMonth
    || days.length % 7 !== 0
  ) {
    const day = dateToDisplay.getDate()
    const month = dateToDisplay.getMonth()
    const year = dateToDisplay.getFullYear()
    const dayOfWeek = dateToDisplay.getDay()
    const formattedDate = formatDate(dateToDisplay)

    const isDisabled = !isDateWithinMinAndMax(dateToDisplay, minDate, maxDate)
    const isSelected = isSameDay(dateToDisplay, selectedDate)
    const isFocused = isSameDay(dateToDisplay, focusedDate)

    const isPreviousMonth = isSameMonth(dateToDisplay, prevMonth)
    const isCurrentMonth = isSameMonth(dateToDisplay, focusedDate)
    const isNextMonth = isSameMonth(dateToDisplay, nextMonth)
    const isToday = isSameDay(dateToDisplay, todaysDate)

    const isRangeDate = !!rangeDate && isSameDay(dateToDisplay, rangeDate)
    const isRangeStart = !!rangeDate && isSameDay(dateToDisplay, rangeStartDate)
    const isRangeEnd = !!rangeDate && isSameDay(dateToDisplay, rangeEndDate)
    const isWithinRange = !!rangeDate && !!withinRangeStartDate && !!withinRangeEndDate
      && isDateWithinMinAndMax(dateToDisplay, withinRangeStartDate, withinRangeEndDate)

    const monthStr = monthLabels[month]
    const dayStr = dayOfWeekLabels[dayOfWeek]
    const ariaLabel = `${day} ${monthStr} ${year} ${dayStr}`

    days.push({
      date: new Date(dateToDisplay.getTime()),
      dateString: formattedDate,
      day,
      isPreviousMonth,
      isCurrentMonth,
      isNextMonth,
      isToday,
      isSelected,
      isFocused,
      isDisabled,
      isRangeStart,
      isRangeEnd,
      isWithinRange,
      isRangeDate,
      ariaLabel,
    })

    dateToDisplay = addDays(dateToDisplay, 1)
  }

  // Convert flat array to grid of weeks (7 days per row)
  const weeks: DayCell[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return weeks
}

function computeMonths(focusedValue: Date, minDate: Date, maxDate: Date | null, locale: string) {
  const { monthLabels } = getLocaleLabels(locale)
  const selectedMonth = focusedValue.getMonth()

  return monthLabels.map((label, index) => {
    const monthToCheck = setMonth(focusedValue, index)
    const isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate)
    const isFocused = index === selectedMonth
    const isSelected = index === selectedMonth

    return {
      month: index,
      label,
      isFocused,
      isSelected,
      isDisabled,
    }
  })
}

function computeYears(focusedValue: Date, minDate: Date, maxDate: Date | null) {
  const selectedYear = focusedValue.getFullYear()
  let yearToChunk = selectedYear
  yearToChunk -= yearToChunk % YEAR_CHUNK
  yearToChunk = Math.max(0, yearToChunk)

  const years: YearCell[] = []
  let yearIndex = yearToChunk
  while (years.length < YEAR_CHUNK) {
    const isDisabled = isDatesYearOutsideMinOrMax(
      setYear(focusedValue, yearIndex),
      minDate,
      maxDate,
    )
    const isFocused = yearIndex === selectedYear
    const isSelected = yearIndex === selectedYear

    years.push({
      year: yearIndex,
      isFocused,
      isSelected,
      isDisabled,
    })
    yearIndex += 1
  }

  return years
}

function computeYearChunkStart(focusedValue: Date) {
  let yearToChunk = focusedValue.getFullYear()
  yearToChunk -= yearToChunk % YEAR_CHUNK
  return Math.max(0, yearToChunk)
}

/* =============================================================================
 * Machine
 * ============================================================================= */

export const machine = createMachine<DatepickerSchema>({
  props({ props }) {
    return {
      selectionMode: 'single',
      min: DEFAULT_MIN_DATE,
      locale: 'en',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ prop, bindable }) {
    // Parse defaultValue props to initialize selected dates
    const defaultValueStrings = prop('defaultValue')
    const defaultDates: Date[] = []
    if (defaultValueStrings) {
      for (const str of defaultValueStrings) {
        const parsed = parseDateString(str)
        if (parsed)
          defaultDates.push(parsed)
      }
    }

    // Initial focused value: first selected date, or today, clamped to min/max
    const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
    const maxDate = parseDateString(prop('max')) || null
    const initialFocused = keepDateBetweenMinAndMax(
      defaultDates[0] || today(),
      minDate,
      maxDate,
    )

    // Initialize input value from first selected date (MM/DD/YYYY) or empty
    const initialInputValue = defaultDates[0]
      ? formatDate(defaultDates[0], DEFAULT_EXTERNAL_DATE_FORMAT)
      : ''

    return {
      value: bindable<Date[]>(() => ({
        defaultValue: defaultDates,
        value: prop('value'),
        onChange(value) {
          prop('onValueChange')?.({
            value,
            valueAsString: value.map(d => formatDate(d)),
          })
        },
      })),
      focusedValue: bindable<Date>(() => ({
        defaultValue: initialFocused,
        onChange(value) {
          prop('onFocusChange')?.({
            focusedValue: value,
            view: 'day', // Updated by actions when view changes
          })
        },
      })),
      view: bindable<DateView>(() => ({
        defaultValue: 'day',
        onChange(value) {
          prop('onViewChange')?.({ view: value })
        },
      })),
      inputValue: bindable<string>(() => ({
        defaultValue: initialInputValue,
      })),
      hoveredValue: bindable<Date | null>(() => ({
        defaultValue: null,
      })),
      activeIndex: bindable<number>(() => ({
        defaultValue: 0,
      })),
      lastKeydownCode: bindable<number | null>(() => ({
        defaultValue: null,
      })),
      statusMessage: bindable<string>(() => ({
        defaultValue: '',
      })),
    }
  },

  computed: {
    minDate: ({ prop }) =>
      parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,

    maxDate: ({ prop }) =>
      parseDateString(prop('max')) || null,

    isInteractive: ({ prop }) => !prop('disabled'),

    isInvalid: ({ context, prop }) =>
      isDateInputInvalid(
        context.get('inputValue'),
        parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,
        parseDateString(prop('max')) || null,
      ),

    valueAsString: ({ context }) =>
      context.get('value').map(d => formatDate(d)),

    weeks: ({ context, prop }) =>
      computeWeeks(
        context.get('focusedValue'),
        context.get('value')[0] || null,
        parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,
        parseDateString(prop('max')) || null,
        parseDateString(prop('rangeDate')) || null,
        prop('locale'),
      ),

    weekDays: ({ prop }) =>
      computeWeekDays(prop('locale')),

    months: ({ context, prop }) =>
      computeMonths(
        context.get('focusedValue'),
        parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,
        parseDateString(prop('max')) || null,
        prop('locale'),
      ),

    years: ({ context, prop }) =>
      computeYears(
        context.get('focusedValue'),
        parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,
        parseDateString(prop('max')) || null,
      ),

    monthLabel: ({ context, prop }) => {
      const { monthLabels } = getLocaleLabels(prop('locale'))
      return monthLabels[context.get('focusedValue').getMonth()]!
    },

    yearLabel: ({ context }) =>
      String(context.get('focusedValue').getFullYear()),

    yearChunkStart: ({ context }) =>
      computeYearChunkStart(context.get('focusedValue')),

    // Nav button disabled states
    isPrevMonthDisabled: ({ context, prop }) =>
      isSameMonth(
        context.get('focusedValue'),
        parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,
      ),

    isNextMonthDisabled: ({ context, prop }) =>
      isSameMonth(
        context.get('focusedValue'),
        parseDateString(prop('max')) || null,
      ),

    isPrevYearDisabled: ({ context, prop }) =>
      isSameMonth(
        context.get('focusedValue'),
        parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!,
      ),

    isNextYearDisabled: ({ context, prop }) =>
      isSameMonth(
        context.get('focusedValue'),
        parseDateString(prop('max')) || null,
      ),

    isPrevYearChunkDisabled: ({ context, prop }) => {
      const focusedValue = context.get('focusedValue')
      const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
      const maxDate = parseDateString(prop('max')) || null
      const yearToChunk = computeYearChunkStart(focusedValue)
      return isDatesYearOutsideMinOrMax(
        setYear(focusedValue, yearToChunk - 1),
        minDate,
        maxDate,
      )
    },

    isNextYearChunkDisabled: ({ context, prop }) => {
      const focusedValue = context.get('focusedValue')
      const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
      const maxDate = parseDateString(prop('max')) || null
      const yearToChunk = computeYearChunkStart(focusedValue)
      return isDatesYearOutsideMinOrMax(
        setYear(focusedValue, yearToChunk + YEAR_CHUNK),
        minDate,
        maxDate,
      )
    },

    rangeDates: ({ context, prop }) => {
      const focusedValue = context.get('focusedValue')
      const selectedDate = context.get('value')[0] || null
      const rangeDate = parseDateString(prop('rangeDate')) || null
      return setRangeDates(selectedDate || focusedValue, rangeDate)
    },
  },

  // Global events (handled in any state)
  on: {
    // Imperative API events
    'VALUE.SET': {
      actions: ['setValue'],
    },
    'VALUE.CLEAR': {
      actions: ['clearValue'],
    },
    'FOCUSED_VALUE.SET': {
      actions: ['setFocusedValue'],
    },
  },

  states: {
    /* -----------------------------------------------------------------------
     * idle: No focus, calendar hidden
     * ----------------------------------------------------------------------- */
    idle: {
      on: {
        'INPUT.FOCUS': {
          target: 'focused',
        },
        // Trigger click from idle — toggle open
        'TRIGGER.CLICK': {
          target: 'open',
          actions: ['setFocusedValueFromInput', 'setOpenStatusMessage', 'invokeOnOpen'],
        },
      },
    },

    /* -----------------------------------------------------------------------
     * focused: Input has focus, calendar hidden
     * ----------------------------------------------------------------------- */
    focused: {
      on: {
        'INPUT.BLUR': {
          target: 'idle',
          actions: ['validateInput'],
        },
        // Trigger click from focused — toggle open
        'TRIGGER.CLICK': {
          target: 'open',
          actions: ['setFocusedValueFromInput', 'setOpenStatusMessage', 'invokeOnOpen'],
        },
        // Input events
        'INPUT.CHANGE': {
          actions: ['setInputValue', 'reconcileInputValues', 'updateCalendarIfVisible'],
        },
        'INPUT.ENTER': {
          actions: ['validateInput'],
        },
      },
    },

    /* -----------------------------------------------------------------------
     * open: Calendar visible and interactive
     * ----------------------------------------------------------------------- */
    open: {
      effects: ['focusCalendarDate'],
      on: {
        // Trigger click from open — toggle close
        'TRIGGER.CLICK': {
          target: 'focused',
          actions: ['clearStatusMessage', 'invokeOnClose'],
        },
        // Select a date — close calendar and focus input
        'CELL.CLICK': {
          target: 'focused',
          actions: ['selectDate', 'setInputFromSelection', 'clearStatusMessage', 'invokeOnClose', 'focusInput'],
        },
        // Select month from month picker → return to day view
        'MONTH.SELECT': {
          actions: ['selectMonth', 'setViewToDay'],
        },
        // Select year from year picker → return to day view
        'YEAR.SELECT': {
          actions: ['selectYear', 'setViewToDay'],
        },
        // Nav button clicks
        'GOTO.PREV_MONTH': {
          actions: ['focusPrevMonth'],
        },
        'GOTO.NEXT_MONTH': {
          actions: ['focusNextMonth'],
        },
        'GOTO.PREV_YEAR': {
          actions: ['focusPrevYear'],
        },
        'GOTO.NEXT_YEAR': {
          actions: ['focusNextYear'],
        },
        'GOTO.PREV_YEAR_CHUNK': {
          actions: ['focusPrevYearChunk'],
        },
        'GOTO.NEXT_YEAR_CHUNK': {
          actions: ['focusNextYearChunk'],
        },
        // View switching
        'VIEW.SET_MONTH': {
          actions: ['setViewToMonth', 'setMonthStatusMessage'],
        },
        'VIEW.SET_YEAR': {
          actions: ['setViewToYear', 'setYearStatusMessage'],
        },
        // Generic view set (from API)
        'VIEW.SET': {
          actions: ['setView'],
        },
        // Generic goto (from API)
        'GOTO.NEXT': {
          actions: ['goToNext'],
        },
        'GOTO.PREV': {
          actions: ['goToPrev'],
        },
        // Day keyboard navigation
        'TABLE.ARROW_UP': [
          { guard: 'isMonthView', actions: ['focusMonthUp'] },
          { guard: 'isYearView', actions: ['focusYearUp'] },
          { actions: ['focusPrevWeek'] },
        ],
        'TABLE.ARROW_DOWN': [
          { guard: 'isMonthView', actions: ['focusMonthDown'] },
          { guard: 'isYearView', actions: ['focusYearDown'] },
          { actions: ['focusNextWeek'] },
        ],
        'TABLE.ARROW_LEFT': [
          { guard: 'isMonthView', actions: ['focusMonthLeft'] },
          { guard: 'isYearView', actions: ['focusYearLeft'] },
          { actions: ['focusPrevDay'] },
        ],
        'TABLE.ARROW_RIGHT': [
          { guard: 'isMonthView', actions: ['focusMonthRight'] },
          { guard: 'isYearView', actions: ['focusYearRight'] },
          { actions: ['focusNextDay'] },
        ],
        'TABLE.HOME': [
          { guard: 'isMonthView', actions: ['focusMonthHome'] },
          { guard: 'isYearView', actions: ['focusYearHome'] },
          { actions: ['focusWeekStart'] },
        ],
        'TABLE.END': [
          { guard: 'isMonthView', actions: ['focusMonthEnd'] },
          { guard: 'isYearView', actions: ['focusYearEnd'] },
          { actions: ['focusWeekEnd'] },
        ],
        'TABLE.PAGE_DOWN': [
          { guard: 'isMonthView', actions: ['focusMonthPageDown'] },
          { guard: 'isYearView', actions: ['focusYearPageDown'] },
          { actions: ['focusNextMonthDate'] },
        ],
        'TABLE.PAGE_UP': [
          { guard: 'isMonthView', actions: ['focusMonthPageUp'] },
          { guard: 'isYearView', actions: ['focusYearPageUp'] },
          { actions: ['focusPrevMonthDate'] },
        ],
        'TABLE.SHIFT_PAGE_DOWN': {
          actions: ['focusNextYearDate'],
        },
        'TABLE.SHIFT_PAGE_UP': {
          actions: ['focusPrevYearDate'],
        },
        // Escape — close calendar and focus input
        'TABLE.ESCAPE': {
          target: 'focused',
          actions: ['clearStatusMessage', 'invokeOnClose', 'focusInput'],
        },
        // Focus outside — close calendar
        'FOCUS_OUTSIDE': {
          target: 'idle',
          actions: ['clearStatusMessage', 'invokeOnClose'],
        },
        // Mouseover on current month dates (range preview)
        'CELL.POINTER_MOVE': {
          actions: ['setHoveredValue'],
        },
        // Keydown/keyup guard
        'CALENDAR.KEYDOWN': {
          actions: ['setLastKeydownCode'],
        },
        // Input events while calendar is open
        'INPUT.CHANGE': {
          actions: ['setInputValue', 'reconcileInputValues', 'updateCalendarIfVisible'],
        },
        'INPUT.ENTER': {
          actions: ['validateInput'],
        },
      },
    },
  },

  implementations: {
    guards: {
      isMonthView: ({ context }) => context.get('view') === 'month',
      isYearView: ({ context }) => context.get('view') === 'year',
    },

    effects: {
      // Focus the calendar date after opening
      focusCalendarDate({ context, scope }) {
        return raf(() => {
          const view = context.get('view')
          if (view === 'day') {
            const focusedValue = context.get('focusedValue')
            const dateString = formatDate(focusedValue)
            dom.focusCellTriggerEl(scope, dateString)
          }
          else if (view === 'month') {
            // Focus the focused month button — find by data-focused attribute
            const monthPickerEl = dom.getMonthPickerEl(scope)
            if (monthPickerEl) {
              const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
              focused?.focus({ preventScroll: true })
            }
          }
          else if (view === 'year') {
            // Focus the focused year button
            const yearPickerEl = dom.getYearPickerEl(scope)
            if (yearPickerEl) {
              const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
              focused?.focus({ preventScroll: true })
            }
          }
        })
      },
    },

    actions: {
      // --- Value management ---

      // Set value from CELL.CLICK
      selectDate({ context, event }) {
        const dateString = event.value as string
        const parsed = parseDateString(dateString)
        if (parsed) {
          context.set('value', [parsed])
        }
      },

      // Set input value from selection
      setInputFromSelection({ context }) {
        const value = context.get('value')
        if (value.length > 0) {
          context.set('inputValue', formatDate(value[0]!, DEFAULT_EXTERNAL_DATE_FORMAT))
        }
      },

      // API setValue
      setValue({ context, event }) {
        const values = event.values as Date[]
        context.set('value', values)
        if (values.length > 0) {
          context.set('inputValue', formatDate(values[0]!, DEFAULT_EXTERNAL_DATE_FORMAT))
        }
      },

      // API clearValue
      clearValue({ context }) {
        context.set('value', [])
        context.set('inputValue', '')
      },

      // API setFocusedValue
      setFocusedValue({ context, event }) {
        context.set('focusedValue', event.value as Date)
      },

      // --- Focused value management ---

      // Set focused value from current input value (when opening calendar)
      setFocusedValueFromInput({ context, prop }) {
        const inputValue = context.get('inputValue')
        const inputDate = parseDateString(inputValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
        const defaultValueStrings = prop('defaultValue')
        const defaultDate = defaultValueStrings?.[0] ? parseDateString(defaultValueStrings[0]) : undefined
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null

        const dateToDisplay = keepDateBetweenMinAndMax(
          inputDate || defaultDate || today(),
          minDate,
          maxDate,
        )
        context.set('focusedValue', dateToDisplay)
        context.set('view', 'day' as DateView)
      },

      // --- Input management ---

      setInputValue({ context, event }) {
        context.set('inputValue', event.value as string)
      },

      reconcileInputValues({ context, prop }) {
        const inputValue = context.get('inputValue')
        const inputDate = parseDateString(inputValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null

        if (inputDate && !isDateInputInvalid(inputValue, minDate, maxDate)) {
          const newValue = formatDate(inputDate)
          const currentValue = context.get('value')
          const currentInternalStr = currentValue.length > 0 ? formatDate(currentValue[0]!) : ''
          if (currentInternalStr !== newValue) {
            context.set('value', [inputDate])
          }
        }
      },

      updateCalendarIfVisible({ context, prop, state }) {
        if (!state.matches('open'))
          return
        const inputValue = context.get('inputValue')
        const inputDate = parseDateString(inputValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null

        if (inputDate) {
          const dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate)
          context.set('focusedValue', dateToDisplay)
        }
      },

      // Validation in machine model stores isInvalid as a computed value.
      // The connect function reads computed("isInvalid") and applies
      // validation attributes. No DOM writes needed here.
      // This action is a no-op placeholder preserved for the event graph.
      validateInput(_params) {},

      // --- View management ---

      setViewToDay({ context, scope }) {
        context.set('view', 'day' as DateView)
        // Focus the focused date cell after switching back to day view
        raf(() => {
          const focusedValue = context.get('focusedValue')
          dom.focusCellTriggerEl(scope, formatDate(focusedValue))
        })
      },

      setViewToMonth({ context, scope }) {
        context.set('view', 'month' as DateView)
        // Focus the focused month button
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      setViewToYear({ context, scope }) {
        context.set('view', 'year' as DateView)
        // Focus the focused year button
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      // API setView
      setView({ context, event }) {
        context.set('view', event.view as DateView)
      },

      // --- Month/Year selection ---

      selectMonth({ context, event, prop }) {
        const selectedMonth = event.value as number
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let date = setMonth(focusedValue, selectedMonth)
        date = keepDateBetweenMinAndMax(date, minDate, maxDate)
        context.set('focusedValue', date)
      },

      selectYear({ context, event, prop }) {
        const selectedYear = event.value as number
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let date = setYear(focusedValue, selectedYear)
        date = keepDateBetweenMinAndMax(date, minDate, maxDate)
        context.set('focusedValue', date)
      },

      // --- Navigation ---

      focusPrevMonth({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = subMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusPrevMonthTriggerEl(scope))
      },

      focusNextMonth({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = addMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusNextMonthTriggerEl(scope))
      },

      focusPrevYear({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = subYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusPrevYearTriggerEl(scope))
      },

      focusNextYear({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = addYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusNextYearTriggerEl(scope))
      },

      // Year chunk navigation
      focusPrevYearChunk({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = subYears(focusedValue, YEAR_CHUNK)
        context.set('focusedValue', newDate)
        raf(() => dom.focusPrevYearChunkTriggerEl(scope))
      },

      focusNextYearChunk({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = addYears(focusedValue, YEAR_CHUNK)
        context.set('focusedValue', newDate)
        raf(() => dom.focusNextYearChunkTriggerEl(scope))
      },

      // API goToNext/goToPrev
      goToNext({ context, prop }) {
        const view = context.get('view')
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate: Date
        if (view === 'month') {
          // No next in month view — it's a static list
          return
        }
        else if (view === 'year') {
          newDate = addYears(focusedValue, YEAR_CHUNK)
        }
        else {
          newDate = addMonths(focusedValue, 1)
        }
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
      },

      goToPrev({ context, prop }) {
        const view = context.get('view')
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate: Date
        if (view === 'month') {
          return
        }
        else if (view === 'year') {
          newDate = subYears(focusedValue, YEAR_CHUNK)
        }
        else {
          newDate = subMonths(focusedValue, 1)
        }
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
      },

      // --- Day keyboard navigation ---

      focusPrevWeek({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = subWeeks(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextWeek({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = addWeeks(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusPrevDay({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = subDays(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextDay({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = addDays(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusWeekStart({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = startOfWeek(focusedValue)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusWeekEnd({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = endOfWeek(focusedValue)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextMonthDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = addMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusPrevMonthDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = subMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextYearDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = addYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusPrevYearDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString(prop('min')) || parseDateString(DEFAULT_MIN_DATE)!
        const maxDate = parseDateString(prop('max')) || null
        let newDate = subYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      // --- Month keyboard navigation ---

      focusMonthUp({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = setMonth(focusedValue, (focusedValue.getMonth() - 3 + 12) % 12)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthDown({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = setMonth(focusedValue, (focusedValue.getMonth() + 3) % 12)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthLeft({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = setMonth(focusedValue, (focusedValue.getMonth() - 1 + 12) % 12)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthRight({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = setMonth(focusedValue, (focusedValue.getMonth() + 1) % 12)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthHome({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const currentMonth = focusedValue.getMonth()
        // Home in month grid: go to start of row (row = 3 months)
        const rowStart = currentMonth - (currentMonth % 3)
        const newDate = setMonth(focusedValue, rowStart)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthEnd({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const currentMonth = focusedValue.getMonth()
        // End in month grid: go to end of row
        const rowEnd = currentMonth - (currentMonth % 3) + 2
        const newDate = setMonth(focusedValue, Math.min(11, rowEnd))
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthPageDown({ context, scope }) {
        // PageDown in month view: go to December
        const focusedValue = context.get('focusedValue')
        const newDate = setMonth(focusedValue, 11)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusMonthPageUp({ context, scope }) {
        // PageUp in month view: go to January
        const focusedValue = context.get('focusedValue')
        const newDate = setMonth(focusedValue, 0)
        context.set('focusedValue', newDate)
        raf(() => {
          const monthPickerEl = dom.getMonthPickerEl(scope)
          if (monthPickerEl) {
            const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      // --- Year keyboard navigation ---

      focusYearUp({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = subYears(focusedValue, 3)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearDown({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = addYears(focusedValue, 3)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearLeft({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = subYears(focusedValue, 1)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearRight({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const newDate = addYears(focusedValue, 1)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearHome({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const year = focusedValue.getFullYear()
        const yearChunkStart = computeYearChunkStart(focusedValue)
        // Home: start of row in year grid (row = 3 years)
        const yearInChunk = year - yearChunkStart
        const rowStart = yearChunkStart + (yearInChunk - (yearInChunk % 3))
        const newDate = setYear(focusedValue, rowStart)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearEnd({ context, scope }) {
        const focusedValue = context.get('focusedValue')
        const year = focusedValue.getFullYear()
        const yearChunkStart = computeYearChunkStart(focusedValue)
        const yearInChunk = year - yearChunkStart
        const rowEnd = yearChunkStart + (yearInChunk - (yearInChunk % 3)) + 2
        const newDate = setYear(focusedValue, Math.min(yearChunkStart + YEAR_CHUNK - 1, rowEnd))
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearPageDown({ context, scope }) {
        // PageDown in year view: go to last year in chunk
        const focusedValue = context.get('focusedValue')
        const yearChunkStart = computeYearChunkStart(focusedValue)
        const newDate = setYear(focusedValue, yearChunkStart + YEAR_CHUNK - 1)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      focusYearPageUp({ context, scope }) {
        // PageUp in year view: go to first year in chunk
        const focusedValue = context.get('focusedValue')
        const yearChunkStart = computeYearChunkStart(focusedValue)
        const newDate = setYear(focusedValue, yearChunkStart)
        context.set('focusedValue', newDate)
        raf(() => {
          const yearPickerEl = dom.getYearPickerEl(scope)
          if (yearPickerEl) {
            const focused = yearPickerEl.querySelector<HTMLElement>('[data-focused]')
            focused?.focus({ preventScroll: true })
          }
        })
      },

      // --- Status messages ---

      setOpenStatusMessage({ context }) {
        const focusedValue = context.get('focusedValue')
        const selectedDate = context.get('value')[0] || null

        const statuses: string[] = []
        if (selectedDate && isSameDay(selectedDate, focusedValue)) {
          statuses.push('Selected date')
        }
        statuses.push(
          'You can navigate by day using left and right arrows',
          'Weeks by using up and down arrows',
          'Months by using page up and page down keys',
          'Years by using shift plus page up and shift plus page down',
          'Home and end keys navigate to the beginning and end of a week',
        )
        context.set('statusMessage', statuses.join('. '))
      },

      setMonthStatusMessage({ context }) {
        context.set('statusMessage', 'Select a month.')
      },

      setYearStatusMessage({ context }) {
        const focusedValue = context.get('focusedValue')
        const yearChunkStart = computeYearChunkStart(focusedValue)
        context.set('statusMessage', `Showing years ${yearChunkStart} to ${yearChunkStart + YEAR_CHUNK - 1}. Select a year.`)
      },

      clearStatusMessage({ context }) {
        context.set('statusMessage', '')
      },

      // --- Callbacks ---

      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },

      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },

      // --- Focus management ---

      focusInput({ scope }) {
        dom.focusInputEl(scope)
      },

      // --- Range/hover ---

      setHoveredValue({ context, event }) {
        context.set('hoveredValue', event.value as Date)
      },

      // --- Keyup guard ---

      setLastKeydownCode({ context, event }) {
        context.set('lastKeydownCode', event.keyCode as number)
      },
    },
  },
})

/* =============================================================================
 * Exported utilities (used by connect and potentially by consumers)
 * ============================================================================= */

export {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  computeYearChunkStart,
  dateMax,
  dateMin,
  DEFAULT_EXTERNAL_DATE_FORMAT,
  DEFAULT_MIN_DATE,
  endOfWeek,
  formatDate,
  INTERNAL_DATE_FORMAT,
  isDateInputInvalid,
  isDatesMonthOutsideMinOrMax,
  isDatesYearOutsideMinOrMax,
  isDateWithinMinAndMax,
  isSameDay,
  isSameMonth,
  isSameYear,
  keepDateBetweenMinAndMax,
  lastDayOfMonth,
  parseDateString,
  setDate,
  setMonth,
  setRangeDates,
  setYear,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  today,
  YEAR_CHUNK,
}
