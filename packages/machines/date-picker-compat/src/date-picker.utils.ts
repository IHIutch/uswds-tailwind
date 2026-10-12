import type { EndpointIndex } from './date-picker.types'
import {
  addDays,
  addMonths,
  addYears,
  DEFAULT_EXTERNAL_DATE_FORMAT,
  endOfWeek,
  formatDate,
  isSameMonth,
  isWithinInterval,
  isYearInInterval,
  max,
  min,
  parseDateString,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from './date-utils'

export const YEAR_CHUNK = 12
const VALIDATION_MESSAGE = 'Please enter a valid date'

export function getDayKeyTarget(type: string, date: Date, larger = false) {
  switch (type) {
    case 'TABLE.ARROW_UP': return addDays(date, -7)
    case 'TABLE.ARROW_DOWN': return addDays(date, 7)
    case 'TABLE.ARROW_LEFT': return addDays(date, -1)
    case 'TABLE.ARROW_RIGHT': return addDays(date, 1)
    case 'TABLE.HOME': return startOfWeek(date)
    case 'TABLE.END': return endOfWeek(date)
    case 'TABLE.PAGE_UP': return larger ? addYears(date, -1) : addMonths(date, -1)
    case 'TABLE.PAGE_DOWN': return larger ? addYears(date, 1) : addMonths(date, 1)
    default: return date
  }
}
export function getMonthYearKeyTarget(type: string, value: number, view: 'month' | 'year') {
  switch (type) {
    case 'TABLE.ARROW_UP': return value - 3
    case 'TABLE.ARROW_DOWN': return value + 3
    case 'TABLE.ARROW_LEFT': return value - 1
    case 'TABLE.ARROW_RIGHT': return value + 1
    case 'TABLE.HOME': return value - (value % 3)
    case 'TABLE.END': return value + 2 - (value % 3)
    case 'TABLE.PAGE_UP': return view === 'month' ? 0 : value - YEAR_CHUNK
    case 'TABLE.PAGE_DOWN': return view === 'month' ? 11 : value + YEAR_CHUNK
    default: return value
  }
}

export function getNavigationAvailability(focusedValue: Date, rovingYear: number, start: Date, end: Date | undefined) {
  const yearChunkStart = Math.max(0, rovingYear - (rovingYear % YEAR_CHUNK))
  return {
    yearChunkStart,
    canGoPrev: !isSameMonth(focusedValue, start),
    canGoNext: !isSameMonth(focusedValue, end),
    canChunkPrev: isYearInInterval(setYear(focusedValue, yearChunkStart - 1), { start, end }),
    canChunkNext: isYearInInterval(setYear(focusedValue, yearChunkStart + YEAR_CHUNK), { start, end }),
  }
}

// USWDS parsing and input validation.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L493-L560
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L796-L849
export function isDateInputInvalid(
  dateString: string,
  start: Date,
  end: Date | undefined,
) {
  if (!dateString)
    return false

  const [month = '', day = '', year = ''] = dateString.split('/')
  const date = parseDateString(dateString, DEFAULT_EXTERNAL_DATE_FORMAT)
  return !date
    || date.getMonth() !== Number.parseInt(month, 10) - 1
    || date.getDate() !== Number.parseInt(day, 10)
    || date.getFullYear() !== Number.parseInt(year, 10)
    || year.length !== 4
    || !isWithinInterval(date, { start, end })
}

/** Return null to leave native validity unchanged, including messages from other validators. */
export function validateDateInput(
  dateString: string,
  start: Date,
  end: Date | undefined,
  currentValidationMessage: string,
) {
  const isInvalid = isDateInputInvalid(dateString, start, end)

  if (isInvalid && !currentValidationMessage) {
    return VALIDATION_MESSAGE
  }

  if (!isInvalid && currentValidationMessage === VALIDATION_MESSAGE) {
    return ''
  }

  return null
}

export function parseInputValue(
  externalValue: string,
  start: Date,
  end: Date | undefined,
) {
  if (isDateInputInvalid(externalValue, start, end))
    return undefined
  return parseDateString(externalValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
}

export function getEffectiveDateBounds(
  isRange: boolean,
  activeIndex: number,
  value: (Date | undefined)[],
  propMin: Date,
  propMax: Date | undefined,
) {
  if (!isRange)
    return { start: propMin, end: propMax }
  const peer = value[1 - activeIndex]
  if (!peer)
    return { start: propMin, end: propMax }
  if (activeIndex === 1)
    return { start: max(peer, propMin), end: propMax }
  if (activeIndex === 0)
    return { start: propMin, end: propMax ? min(peer, propMax) : peer }
  return { start: propMin, end: propMax }
}

/** Preserve endpoint slots, including end-only [undefined, end]. */
export function setRangeEndpoint(
  value: (Date | undefined)[],
  index: EndpointIndex,
  nextValue: Date | undefined,
) {
  const next: (Date | undefined)[] = [value[0], value[1]]
  next[index] = nextValue
  while (next.length > 0 && next[next.length - 1] === undefined) next.pop()
  return next
}

/** Preview bounds exclude both endpoints. */
export function getRangeDates(date: Date, rangeDate: Date) {
  const rangeStartDate = min(date, rangeDate)
  const rangeEndDate = max(date, rangeDate)
  return {
    rangeStartDate,
    rangeEndDate,
    withinRangeStartDate: addDays(rangeStartDate, 1),
    withinRangeEndDate: addDays(rangeEndDate, -1),
  }
}

/** Preserve endpoint positions, including sparse-array holes, in ISO payloads. */
export function serializeDates(value: readonly (Date | undefined)[]) {
  return Array.from(value, date => date ? formatDate(date) : '')
}

/** Normalize dates while preserving endpoint positions, including sparse slots. */
export function normalizeDates(value: readonly (Date | undefined)[]) {
  return Array.from(value, date => date ? startOfDay(date) : undefined)
}

export function getVisibleDays(focusedValue: Date) {
  const focusedMonth = focusedValue.getMonth()
  let cursor = startOfWeek(startOfMonth(focusedValue))
  const days: Date[] = []
  while (days.length < 28 || cursor.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return days
}
