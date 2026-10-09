import type { DateValue, EndpointIndex } from './date-picker.types'

// Date math follows USWDS, including year zero and month-preserving arithmetic.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L129-L584
export const DEFAULT_EXTERNAL_DATE_FORMAT = 'MM/DD/YYYY'
export const INTERNAL_DATE_FORMAT = 'YYYY-MM-DD'
export const YEAR_CHUNK = 12
const VALIDATION_MESSAGE = 'Please enter a valid date'
export function getNavigationAvailability(focusedValue: DateValue, rovingYear: number, min: DateValue, max: DateValue | undefined) {
  const yearChunkStart = Math.max(0, rovingYear - (rovingYear % YEAR_CHUNK))
  return {
    yearChunkStart,
    canGoPrev: !isSameMonth(focusedValue, min),
    canGoNext: !isSameMonth(focusedValue, max),
    canChunkPrev: !isDatesYearOutsideMinOrMax(setYear(focusedValue, yearChunkStart - 1), min, max),
    canChunkNext: !isDatesYearOutsideMinOrMax(setYear(focusedValue, yearChunkStart + YEAR_CHUNK), min, max),
  }
}

function keepDateWithinMonth(dateToCheck: DateValue, month: number): DateValue {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0)
  }
  return dateToCheck
}

// setFullYear keeps years 0-99 from turning into 1900-1999.
export function setDate(year: number, month: number, date: number): DateValue {
  const newDate = new Date(0)
  newDate.setFullYear(year, month, date)
  // Without this, dates keep a leftover time of day.
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

export function today(): DateValue {
  const newDate = new Date()
  return normalizeDate(newDate)
}

function startOfMonth(date: DateValue): DateValue {
  return setDate(date.getFullYear(), date.getMonth(), 1)
}

function lastDayOfMonth(date: DateValue): DateValue {
  return setDate(date.getFullYear(), date.getMonth() + 1, 0)
}

export function addDays(_date: DateValue, numDays: number): DateValue {
  const newDate = new Date(_date.getTime())
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}

export function startOfWeek(_date: DateValue): DateValue {
  return addDays(_date, -_date.getDay())
}

export function endOfWeek(_date: DateValue): DateValue {
  return addDays(_date, 6 - _date.getDay())
}

/** Preserve the intended month when the day overflows, e.g. January 31 to February 28. */
export function addMonths(_date: DateValue, numMonths: number): DateValue {
  const newDate = new Date(_date.getTime())
  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12
  newDate.setMonth(newDate.getMonth() + numMonths)
  keepDateWithinMonth(newDate, dateMonth)
  return newDate
}

export function addYears(_date: DateValue, numYears: number): DateValue {
  return addMonths(_date, numYears * 12)
}

export function setMonth(_date: DateValue, month: number): DateValue {
  const newDate = new Date(_date.getTime())
  newDate.setMonth(month)
  keepDateWithinMonth(newDate, month)
  return newDate
}

export function setYear(_date: DateValue, year: number): DateValue {
  const newDate = new Date(_date.getTime())
  const month = newDate.getMonth()
  newDate.setFullYear(year)
  keepDateWithinMonth(newDate, month)
  return newDate
}

function min(dateA: DateValue, dateB: DateValue): DateValue {
  return new Date(dateB.getTime() < dateA.getTime() ? dateB : dateA)
}

function max(dateA: DateValue, dateB: DateValue): DateValue {
  return new Date(dateB.getTime() > dateA.getTime() ? dateB : dateA)
}

export function isSameYear(dateA: DateValue | undefined, dateB: DateValue | undefined): boolean {
  return !!(dateA && dateB && dateA.getFullYear() === dateB.getFullYear())
}

export function isSameMonth(dateA: DateValue | undefined, dateB: DateValue | undefined): boolean {
  return isSameYear(dateA, dateB) && dateA!.getMonth() === dateB!.getMonth()
}

export function isSameDay(dateA: DateValue | undefined, dateB: DateValue | undefined): boolean {
  return isSameMonth(dateA, dateB) && dateA!.getDate() === dateB!.getDate()
}

export function keepDateBetweenMinAndMax(
  date: DateValue,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): DateValue {
  let newDate = date
  if (date.getTime() < minDate.getTime()) {
    newDate = minDate
  }
  else if (maxDate && date.getTime() > maxDate.getTime()) {
    newDate = maxDate
  }
  return new Date(newDate.getTime())
}

export function isDateWithinMinAndMax(
  date: DateValue,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): boolean {
  return date.getTime() >= minDate.getTime() && (!maxDate || date.getTime() <= maxDate.getTime())
}

export function isDatesMonthOutsideMinOrMax(
  date: DateValue,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): boolean {
  return (
    lastDayOfMonth(date).getTime() < minDate.getTime()
    || (!!maxDate && startOfMonth(date).getTime() > maxDate.getTime())
  )
}

export function isDatesYearOutsideMinOrMax(
  date: DateValue,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): boolean {
  return (
    lastDayOfMonth(setMonth(date, 11)).getTime() < minDate.getTime()
    || (!!maxDate && startOfMonth(setMonth(date, 0)).getTime() > maxDate.getTime())
  )
}

/** Preview bounds exclude both endpoints. */
export function setRangeDates(date: DateValue, rangeDate: DateValue) {
  const rangeStartDate = min(date, rangeDate)
  const rangeEndDate = max(date, rangeDate)
  return {
    rangeStartDate,
    rangeEndDate,
    withinRangeStartDate: addDays(rangeStartDate, 1),
    withinRangeEndDate: addDays(rangeEndDate, -1),
  }
}

/** Adjusted parsing clamps month/day and expands short years; validation uses the raw text. */
export function parseDateString(
  dateString: string | undefined | null,
  dateFormat: string = INTERNAL_DATE_FORMAT,
  adjustDate = false,
): DateValue | undefined {
  if (!dateString)
    return undefined

  const external = dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT
  const parts = dateString.split(external ? '/' : '-')
  const [monthText = '', dayText = '', yearText = ''] = external ? parts : [parts[1], parts[2], parts[0]]
  let month = Number.parseInt(monthText, 10)
  let day = Number.parseInt(dayText, 10)
  let year = Number.parseInt(yearText, 10)
  if (Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year))
    return undefined

  if (adjustDate) {
    const parsedYear = year
    year = Math.max(0, year)
    if (yearText.length < 3) {
      const currentYear = today().getFullYear()
      const yearStub = currentYear - (currentYear % 10 ** yearText.length)
      year = yearStub + parsedYear
    }
    month = Math.max(1, Math.min(12, month))
    day = Math.max(1, Math.min(setDate(year, month, 0).getDate(), day))
  }

  return month && day ? setDate(year, month - 1, day) : undefined
}

/** Format as ISO YYYY-MM-DD by default, or MM/DD/YYYY for visible inputs. */
export function formatDate(date: DateValue, dateFormat: string = INTERNAL_DATE_FORMAT): string {
  const padZeros = (value: number, length: number): string => `0000${value}`.slice(-length)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
    return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join('/')
  }

  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join('-')
}

/** Preserve endpoint positions, including sparse-array holes, in ISO payloads. */
export function serializeDates(value: readonly (DateValue | undefined)[]): string[] {
  return Array.from(value, date => date ? formatDate(date) : '')
}

export function isDateInputInvalid(
  dateString: string,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): boolean {
  if (!dateString)
    return false

  const [month = '', day = '', year = ''] = dateString.split('/')
  const date = parseDateString(dateString, DEFAULT_EXTERNAL_DATE_FORMAT)
  return !date
    || date.getMonth() !== Number.parseInt(month, 10) - 1
    || date.getDate() !== Number.parseInt(day, 10)
    || date.getFullYear() !== Number.parseInt(year, 10)
    || year.length !== 4
    || !isDateWithinMinAndMax(date, minDate, maxDate)
}

/** Return null to preserve validity; never overwrite another validator's message. */
export function validateDateInput(
  dateString: string,
  minDate: DateValue,
  maxDate: DateValue | undefined,
  currentValidationMessage: string,
): string | null {
  const isInvalid = isDateInputInvalid(dateString, minDate, maxDate)

  if (isInvalid && !currentValidationMessage) {
    return VALIDATION_MESSAGE
  }

  if (!isInvalid && currentValidationMessage === VALIDATION_MESSAGE) {
    return ''
  }

  return null
}

// Validate the raw input before accepting its adjusted parse.
export function parseInputValue(
  externalValue: string,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): DateValue | undefined {
  if (isDateInputInvalid(externalValue, minDate, maxDate))
    return undefined
  return parseDateString(externalValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
}

/** Ignore time of day when comparing selections. */
export function normalizeDate(date: DateValue): DateValue {
  return setDate(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getVisibleDays(focusedValue: DateValue): DateValue[] {
  const focusedMonth = focusedValue.getMonth()
  let cursor = startOfWeek(startOfMonth(focusedValue))
  const days: DateValue[] = []
  while (days.length < 28 || cursor.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return days
}

// Day zero of January 1900 is Sunday, so weekday labels start with Sunday.
const MONTH_DATE_SEED = Array.from({ length: 12 }, (_, i) => new Date(0, i))
const DAY_OF_WEEK_DATE_SEED = Array.from({ length: 7 }, (_, i) => new Date(0, 0, i))

export function getMonthLabels(locale: string): string[] {
  return MONTH_DATE_SEED.map(d => d.toLocaleString(locale, { month: 'long' }))
}

export function getWeekdayLabels(locale: string): string[] {
  return DAY_OF_WEEK_DATE_SEED.map(d => d.toLocaleString(locale, { weekday: 'long' }))
}

export function getWeekdayNarrow(locale: string): string[] {
  return DAY_OF_WEEK_DATE_SEED.map(d => d.toLocaleString(locale, { weekday: 'narrow' }))
}

export interface EffectiveDateBounds {
  min: DateValue
  max: DateValue | undefined
}

export function getEffectiveDateBounds(
  isRange: boolean,
  activeIndex: number,
  value: (DateValue | undefined)[],
  propMin: DateValue,
  propMax: DateValue | undefined,
): EffectiveDateBounds {
  if (!isRange)
    return { min: propMin, max: propMax }
  const peer = value[1 - activeIndex]
  return {
    min: activeIndex === 1 && peer ? max(peer, propMin) : propMin,
    max: activeIndex === 0 && peer ? propMax === undefined ? peer : min(peer, propMax) : propMax,
  }
}

/** Preserve endpoint slots, including end-only [undefined, end]. */
export function setRangeEndpoint(
  value: (DateValue | undefined)[],
  index: EndpointIndex,
  nextValue: DateValue | undefined,
): (DateValue | undefined)[] {
  const next: (DateValue | undefined)[] = [value[0], value[1]]
  next[index] = nextValue
  while (next.length > 0 && next[next.length - 1] === undefined) next.pop()
  return next
}

export function isEndpointIndex(value: unknown): value is EndpointIndex {
  return value === 0 || value === 1
}
