import type { DatepickerSchema, DateView, DayCell, YearCell } from './date-picker.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import * as dom from './date-picker.dom'

const YEAR_CHUNK = 12
const DEFAULT_MIN_DATE = '0000-01-01'
const DEFAULT_EXTERNAL_DATE_FORMAT = 'MM/DD/YYYY'
const INTERNAL_DATE_FORMAT = 'YYYY-MM-DD'

function padToTwo(values: Date[]): Date[] {
  const next = values.slice()
  while (next.length < 2) next.push(undefined as unknown as Date)
  return next
}

function boundsForIndex({
  value,
  baseMin,
  baseMax,
  index,
  isRange,
  activeIndex,
}: {
  value: Date[]
  baseMin: Date
  baseMax: Date | null
  index: number
  isRange: boolean
  activeIndex: number
}) {
  if (!isRange)
    return { min: baseMin, max: baseMax }

  const partner = value[1 - index]
  if (!partner)
    return { min: baseMin, max: baseMax }

  const own = value[index]

  const conflict = (index === 0 && own && own > partner) || (index === 1 && own && own < partner)

  if (conflict && activeIndex !== index)
    return { min: baseMin, max: baseMax }

  if (index === 0) {
    // Start: cannot exceed the end.
    const max = baseMax && baseMax < partner ? baseMax : partner
    return { min: baseMin, max }
  }

  // End: cannot precede the start.
  const min = baseMin > partner ? baseMin : partner
  return { min, max: baseMax }
}

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
  return lastDayOfMonth(setMonth(date, 11)) < minDate || (!!maxDate && startOfMonth(setMonth(date, 0)) > maxDate)
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

function parseDateString({
  dateString,
  dateFormat = INTERNAL_DATE_FORMAT,
  adjustDate = false,
}: {
  dateString: string | undefined | null
  dateFormat?: string
  adjustDate?: boolean
}) {
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

function computeWeeks(focusedValue: Date, selectedDates: Date[], minDate: Date, maxDate: Date | null, rangeDate: Date | null, locale: string) {
  const todaysDate = today()
  const focusedDate = addDays(focusedValue, 0)
  const focusedMonth = focusedValue.getMonth()

  const prevMonth = subMonths(focusedValue, 1)
  const nextMonth = addMonths(focusedValue, 1)

  const { monthLabels, dayOfWeekLabels } = getLocaleLabels(locale)

  // Range "anchor" is the first selected date (or focused value if none)
  const rangeAnchor = selectedDates[0] || focusedValue
  const {
    rangeStartDate,
    rangeEndDate,
    withinRangeStartDate,
    withinRangeEndDate,
  } = setRangeDates(rangeAnchor, rangeDate)

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
    const isSelected = selectedDates.some(d => isSameDay(dateToDisplay, d))
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
    const defaultValueStrings = prop('defaultValue')
    const defaultDates: Date[] = []
    if (defaultValueStrings) {
      for (const str of defaultValueStrings) {
        const parsed = parseDateString({ dateString: str })
        if (parsed)
          defaultDates.push(parsed)
      }
    }

    const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
    const maxDate = parseDateString({ dateString: prop('max') }) || null
    const initialFocused = keepDateBetweenMinAndMax(
      defaultDates[0] || today(),
      minDate,
      maxDate,
    )

    const isRange = prop('selectionMode') === 'range'
    const inputCount = isRange ? 2 : 1
    const initialInputValues: string[] = []
    for (let i = 0; i < inputCount; i++) {
      const d = defaultDates[i]
      initialInputValues.push(d ? formatDate(d, DEFAULT_EXTERNAL_DATE_FORMAT) : '')
    }

    return {
      value: bindable<Date[]>(() => ({
        defaultValue: isRange ? padToTwo(defaultDates) : defaultDates,
        value: prop('value'),
        onChange(value) {
          const present = value.filter(Boolean) as Date[]
          prop('onValueChange')?.({
            value: present,
            valueAsString: present.map(d => formatDate(d)),
          })
        },
      })),
      focusedValue: bindable<Date>(() => ({
        defaultValue: initialFocused,
        onChange(value) {
          prop('onFocusChange')?.({
            focusedValue: value,
            view: 'day',
          })
        },
      })),
      view: bindable<DateView>(() => ({
        defaultValue: 'day',
        onChange(value) {
          prop('onViewChange')?.({ view: value })
        },
      })),
      inputValues: bindable<string[]>(() => ({
        defaultValue: initialInputValues,
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
    minDate: ({ prop }) => parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!,

    maxDate: ({ prop }) => parseDateString({ dateString: prop('max') }) || null,

    effectiveMin: ({ context, prop }) => {
      const baseMin = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
      const baseMax = parseDateString({ dateString: prop('max') }) || null
      const isRange = prop('selectionMode') === 'range'
      const activeIndex = context.get('activeIndex')
      return boundsForIndex({
        value: context.get('value'),
        baseMin,
        baseMax,
        index: activeIndex,
        isRange,
        activeIndex,
      }).min
    },

    effectiveMax: ({ context, prop }) => {
      const baseMin = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
      const baseMax = parseDateString({ dateString: prop('max') }) || null
      const isRange = prop('selectionMode') === 'range'
      const activeIndex = context.get('activeIndex')
      return boundsForIndex({
        value: context.get('value'),
        baseMin,
        baseMax,
        index: activeIndex,
        isRange,
        activeIndex,
      }).max
    },

    isInteractive: ({ prop }) => !prop('disabled'),

    isInvalidByIndex: ({ context, prop }) => {
      const baseMin = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
      const baseMax = parseDateString({ dateString: prop('max') }) || null
      const isRange = prop('selectionMode') === 'range'
      const activeIndex = context.get('activeIndex')
      const inputValues = context.get('inputValues')
      const value = context.get('value')
      const inputCount = isRange ? 2 : 1
      const result: boolean[] = []
      for (let i = 0; i < inputCount; i++) {
        const bounds = boundsForIndex({
          value,
          baseMin,
          baseMax,
          index: i,
          isRange,
          activeIndex,
        })
        result.push(isDateInputInvalid(inputValues[i] ?? '', bounds.min, bounds.max))
      }
      return result
    },

    isInvalid: ({ context, prop }) => {
      const baseMin = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
      const baseMax = parseDateString({ dateString: prop('max') }) || null
      const isRange = prop('selectionMode') === 'range'
      const activeIndex = context.get('activeIndex')
      const bounds = boundsForIndex({
        value: context.get('value'),
        baseMin,
        baseMax,
        index: activeIndex,
        isRange,
        activeIndex,
      })
      return isDateInputInvalid(
        context.get('inputValues')[activeIndex] ?? '',
        bounds.min,
        bounds.max,
      )
    },

    valueAsString: ({ context }) =>
      (context.get('value').filter(Boolean) as Date[]).map(d => formatDate(d)),

    weeks: ({ context, prop, computed }) => {
      const isRange = prop('selectionMode') === 'range'
      const value = context.get('value')
      const activeIndex = context.get('activeIndex')
      const hovered = context.get('hoveredValue')

      let selectedDates: Date[] = []
      let rangeDate: Date | null = null

      if (isRange) {
        selectedDates = value.filter(Boolean) as Date[]

        const partner = value[1 - activeIndex] || null
        const own = value[activeIndex] || null

        if (partner && !own && hovered) {
          rangeDate = hovered
          selectedDates = [partner]
        }
        else if (partner && own) {
          rangeDate = partner
          selectedDates = [own, partner]
        }
      }
      else {
        selectedDates = value[0] ? [value[0]] : []
        rangeDate = parseDateString({ dateString: prop('rangeDate') }) || null
      }

      return computeWeeks(
        context.get('focusedValue'),
        selectedDates,
        computed('effectiveMin'),
        computed('effectiveMax'),
        rangeDate,
        prop('locale'),
      )
    },

    weekDays: ({ prop }) =>
      computeWeekDays(prop('locale')),

    months: ({ context, prop, computed }) =>
      computeMonths(
        context.get('focusedValue'),
        computed('effectiveMin'),
        computed('effectiveMax'),
        prop('locale'),
      ),

    years: ({ context, computed }) =>
      computeYears(
        context.get('focusedValue'),
        computed('effectiveMin'),
        computed('effectiveMax'),
      ),

    monthLabel: ({ context, prop }) => {
      const { monthLabels } = getLocaleLabels(prop('locale'))
      return monthLabels[context.get('focusedValue').getMonth()]!
    },

    yearLabel: ({ context }) => String(context.get('focusedValue').getFullYear()),

    yearChunkStart: ({ context }) => computeYearChunkStart(context.get('focusedValue')),

    isPrevMonthDisabled: ({ context, computed }) => isSameMonth(context.get('focusedValue'), computed('effectiveMin')),

    isNextMonthDisabled: ({ context, computed }) => isSameMonth(context.get('focusedValue'), computed('effectiveMax')),

    isPrevYearDisabled: ({ context, computed }) => isSameMonth(context.get('focusedValue'), computed('effectiveMin')),

    isNextYearDisabled: ({ context, computed }) => isSameMonth(context.get('focusedValue'), computed('effectiveMax')),

    isPrevYearChunkDisabled: ({ context, computed }) => {
      const focusedValue = context.get('focusedValue')
      const yearToChunk = computeYearChunkStart(focusedValue)
      return isDatesYearOutsideMinOrMax(
        setYear(focusedValue, yearToChunk - 1),
        computed('effectiveMin'),
        computed('effectiveMax'),
      )
    },

    isNextYearChunkDisabled: ({ context, computed }) => {
      const focusedValue = context.get('focusedValue')
      const yearToChunk = computeYearChunkStart(focusedValue)
      return isDatesYearOutsideMinOrMax(
        setYear(focusedValue, yearToChunk + YEAR_CHUNK),
        computed('effectiveMin'),
        computed('effectiveMax'),
      )
    },

    rangeDates: ({ context, prop }) => {
      const focusedValue = context.get('focusedValue')
      const selectedDate = context.get('value')[0] || null
      const rangeDate = parseDateString({ dateString: prop('rangeDate') }) || null
      return setRangeDates(selectedDate || focusedValue, rangeDate)
    },
  },

  on: {
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
    idle: {
      on: {
        'INPUT.FOCUS': {
          target: 'focused',
          actions: ['setActiveIndex'],
        },
        'TRIGGER.CLICK': {
          target: 'open',
          actions: ['setActiveIndex', 'setFocusedValueFromInput', 'setOpenStatusMessage', 'invokeOnOpen'],
        },
      },
    },

    focused: {
      on: {
        'INPUT.FOCUS': {
          actions: ['setActiveIndex'],
        },
        'INPUT.BLUR': {
          target: 'idle',
          actions: ['validateInput'],
        },
        'TRIGGER.CLICK': {
          target: 'open',
          actions: ['setActiveIndex', 'setFocusedValueFromInput', 'setOpenStatusMessage', 'invokeOnOpen'],
        },
        'INPUT.CHANGE': {
          actions: ['setInputValue', 'reconcileInputValues', 'updateCalendarIfVisible'],
        },
        'INPUT.ENTER': {
          actions: ['validateInput'],
        },
      },
    },

    open: {
      effects: ['focusCalendarDate'],
      on: {
        'TRIGGER.CLICK': [
          {
            guard: 'isSameTrigger',
            target: 'focused',
            actions: ['clearStatusMessage', 'invokeOnClose'],
          },
          {
            actions: ['setActiveIndex', 'setFocusedValueFromInput'],
          },
        ],
        'CELL.CLICK': {
          target: 'focused',
          actions: ['selectDate', 'clearStatusMessage', 'invokeOnClose', 'focusInput'],
        },
        'MONTH.SELECT': {
          actions: ['selectMonth', 'setViewToDay'],
        },
        'YEAR.SELECT': {
          actions: ['selectYear', 'setViewToDay'],
        },
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
        'VIEW.SET_MONTH': {
          actions: ['setViewToMonth', 'setMonthStatusMessage'],
        },
        'VIEW.SET_YEAR': {
          actions: ['setViewToYear', 'setYearStatusMessage'],
        },
        'VIEW.SET': {
          actions: ['setView'],
        },
        'GOTO.NEXT': {
          actions: ['goToNext'],
        },
        'GOTO.PREV': {
          actions: ['goToPrev'],
        },
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
        'TABLE.ESCAPE': {
          target: 'focused',
          actions: ['clearStatusMessage', 'invokeOnClose', 'focusInput'],
        },
        'FOCUS_OUTSIDE': {
          target: 'idle',
          actions: ['clearStatusMessage', 'invokeOnClose'],
        },
        'CELL.POINTER_MOVE': {
          actions: ['setHoveredValue'],
        },
        'CALENDAR.KEYDOWN': {
          actions: ['setLastKeydownCode'],
        },
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
      isSameTrigger: ({ context, event }) => {
        const eventIndex = typeof event.index === 'number' ? event.index : 0
        return context.get('activeIndex') === eventIndex
      },
    },

    effects: {
      focusCalendarDate({ context, scope }) {
        return raf(() => {
          const view = context.get('view')
          if (view === 'day') {
            const focusedValue = context.get('focusedValue')
            const dateString = formatDate(focusedValue)
            dom.focusCellTriggerEl(scope, dateString)
          }
          else if (view === 'month') {
            const monthPickerEl = dom.getMonthPickerEl(scope)
            if (monthPickerEl) {
              const focused = monthPickerEl.querySelector<HTMLElement>('[data-focused]')
              focused?.focus({ preventScroll: true })
            }
          }
          else if (view === 'year') {
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
      selectDate({ context, event, prop }) {
        const dateString = event.value as string
        const parsed = parseDateString({ dateString })
        if (!parsed)
          return

        const isRange = prop('selectionMode') === 'range'
        const activeIndex = context.get('activeIndex')
        const formatted = formatDate(parsed, DEFAULT_EXTERNAL_DATE_FORMAT)

        if (isRange) {
          const currentValue = padToTwo(context.get('value'))
          currentValue[activeIndex] = parsed
          context.set('value', currentValue)

          const currentInputs = context.get('inputValues').slice()
          while (currentInputs.length < 2) currentInputs.push('')
          currentInputs[activeIndex] = formatted
          context.set('inputValues', currentInputs)
        }
        else {
          context.set('value', [parsed])
          context.set('inputValues', [formatted])
        }
      },

      setValue({ context, event, prop }) {
        const values = event.values as Date[]
        const isRange = prop('selectionMode') === 'range'

        context.set('value', isRange ? padToTwo(values) : values)
        const inputCount = isRange ? 2 : 1
        const next: string[] = []
        for (let i = 0; i < inputCount; i++) {
          const d = values[i]
          next.push(d ? formatDate(d, DEFAULT_EXTERNAL_DATE_FORMAT) : '')
        }
        context.set('inputValues', next)
      },

      clearValue({ context, prop }) {
        const isRange = prop('selectionMode') === 'range'
        context.set('value', isRange ? padToTwo([]) : [])
        context.set('inputValues', isRange ? ['', ''] : [''])
      },

      setFocusedValue({ context, event }) {
        context.set('focusedValue', event.value as Date)
      },

      setFocusedValueFromInput({ context, prop }) {
        const activeIndex = context.get('activeIndex')
        const inputValue = context.get('inputValues')[activeIndex] ?? ''
        const inputDate = parseDateString({ dateString: inputValue, dateFormat: DEFAULT_EXTERNAL_DATE_FORMAT, adjustDate: true })

        const isRange = prop('selectionMode') === 'range'
        const partnerDate = isRange
          ? context.get('value')[1 - activeIndex] ?? undefined
          : undefined

        const defaultValueStrings = prop('defaultValue')
        const defaultDate = defaultValueStrings?.[activeIndex]
          ? parseDateString({ dateString: defaultValueStrings[activeIndex] })
          : undefined
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null

        const dateToDisplay = keepDateBetweenMinAndMax(
          inputDate || partnerDate || defaultDate || today(),
          minDate,
          maxDate,
        )
        context.set('focusedValue', dateToDisplay)
        context.set('view', 'day' as DateView)
      },

      setActiveIndex({ context, event }) {
        const index = typeof event.index === 'number' ? event.index : 0
        context.set('activeIndex', index)
      },

      setInputValue({ context, event }) {
        const index = typeof event.index === 'number' ? event.index : context.get('activeIndex')
        const next = context.get('inputValues').slice()
        while (next.length <= index) next.push('')
        next[index] = event.value as string
        context.set('inputValues', next)
      },

      reconcileInputValues({ context, event, prop }) {
        const index = typeof event.index === 'number' ? event.index : context.get('activeIndex')

        const inputValue = (typeof event.value === 'string' ? event.value : context.get('inputValues')[index]) ?? ''
        const inputDate = parseDateString({ dateString: inputValue, dateFormat: DEFAULT_EXTERNAL_DATE_FORMAT, adjustDate: true })
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null

        if (inputDate && !isDateInputInvalid(inputValue, minDate, maxDate)) {
          const newValue = formatDate(inputDate)
          const isRange = prop('selectionMode') === 'range'
          const currentValue = isRange ? padToTwo(context.get('value')) : context.get('value').slice()
          const existing = currentValue[index]
          const existingStr = existing ? formatDate(existing) : ''
          if (existingStr !== newValue) {
            currentValue[index] = inputDate
            context.set('value', currentValue)
          }
        }
      },

      updateCalendarIfVisible({ context, event, prop, state }) {
        if (!state.matches('open'))
          return
        const activeIndex = context.get('activeIndex')
        const eventIndex = typeof event.index === 'number' ? event.index : activeIndex

        const inputValue = (typeof event.value === 'string' ? event.value : context.get('inputValues')[eventIndex]) ?? ''
        const inputDate = parseDateString({ dateString: inputValue, dateFormat: DEFAULT_EXTERNAL_DATE_FORMAT, adjustDate: true })
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null

        if (inputDate) {
          const dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate)
          context.set('focusedValue', dateToDisplay)
        }
      },

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

      setView({ context, event }) {
        context.set('view', event.view as DateView)
      },

      selectMonth({ context, event, prop }) {
        const selectedMonth = event.value as number
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let date = setMonth(focusedValue, selectedMonth)
        date = keepDateBetweenMinAndMax(date, minDate, maxDate)
        context.set('focusedValue', date)
      },

      selectYear({ context, event, prop }) {
        const selectedYear = event.value as number
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let date = setYear(focusedValue, selectedYear)
        date = keepDateBetweenMinAndMax(date, minDate, maxDate)
        context.set('focusedValue', date)
      },

      focusPrevMonth({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = subMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusPrevMonthTriggerEl(scope))
      },

      focusNextMonth({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = addMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusNextMonthTriggerEl(scope))
      },

      focusPrevYear({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = subYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusPrevYearTriggerEl(scope))
      },

      focusNextYear({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = addYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusNextYearTriggerEl(scope))
      },

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

      goToNext({ context, prop }) {
        const view = context.get('view')
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate: Date
        if (view === 'month') {
          // No "next" in month view
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
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
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

      focusPrevWeek({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = subWeeks(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextWeek({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = addWeeks(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusPrevDay({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = subDays(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextDay({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = addDays(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusWeekStart({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = startOfWeek(focusedValue)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusWeekEnd({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = endOfWeek(focusedValue)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextMonthDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = addMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusPrevMonthDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = subMonths(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusNextYearDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = addYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

      focusPrevYearDate({ context, prop, scope }) {
        const focusedValue = context.get('focusedValue')
        const minDate = parseDateString({ dateString: prop('min') }) || parseDateString({ dateString: DEFAULT_MIN_DATE })!
        const maxDate = parseDateString({ dateString: prop('max') }) || null
        let newDate = subYears(focusedValue, 1)
        newDate = keepDateBetweenMinAndMax(newDate, minDate, maxDate)
        context.set('focusedValue', newDate)
        raf(() => dom.focusCellTriggerEl(scope, formatDate(newDate)))
      },

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

      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },

      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },

      focusInput({ context, scope }) {
        dom.focusInputEl(scope, context.get('activeIndex'))
      },

      setHoveredValue({ context, event }) {
        context.set('hoveredValue', event.value as Date)
      },

      setLastKeydownCode({ context, event }) {
        context.set('lastKeydownCode', event.keyCode as number)
      },
    },
  },
})

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
