import type { DateValue, EndpointIndex } from './date-picker.types'

// Date math follows USWDS, including adjusted input parsing, years below 100,
// month-preserving arithmetic, and 12-year navigation chunks.
// Validation helpers return values; the machine applies native input updates.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L129-L584

/** USWDS constants (`single-index.js`). */
export const DEFAULT_EXTERNAL_DATE_FORMAT = 'MM/DD/YYYY' // L101
export const INTERNAL_DATE_FORMAT = 'YYYY-MM-DD' // L102
export const YEAR_CHUNK = 12 // L98 (decade block = 12 years, NOT 10)
const VALIDATION_MESSAGE = 'Please enter a valid date' // L82

/** Shared availability for the active calendar endpoint's month and 12-year navigation. */
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

/* -----------------------------------------------------------------------------
 * Core (L138-171)
 * ----------------------------------------------------------------------------- */

/** `single-index.js:138` — nudge a rolled-over date back within `month` (over by only 1-3 days). */
function keepDateWithinMonth(dateToCheck: DateValue, month: number): DateValue {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0)
  }
  return dateToCheck
}

/** `single-index.js:154` — `new Date(0)`+`setFullYear` ⇒ genuine year-0..9999 (month zero-indexed). */
export function setDate(year: number, month: number, date: number): DateValue {
  const newDate = new Date(0)
  newDate.setFullYear(year, month, date)
  return newDate
}

/** `single-index.js:165` — today's Y/M/D via `setDate` (`new Date(0)`+`setFullYear`), so it carries epoch's local time-of-day, NOT midnight — inert since everything orders by Y/M/D (kept verbatim; `normalizeDate` handles consumer-supplied dates). */
export function today(): DateValue {
  const newDate = new Date()
  const day = newDate.getDate()
  const month = newDate.getMonth()
  const year = newDate.getFullYear()
  return setDate(year, month, day)
}

/* -----------------------------------------------------------------------------
 * Month/week boundaries (L179-195)
 * ----------------------------------------------------------------------------- */

/** `single-index.js:179` — first day of `date`'s month. */
function startOfMonth(date: DateValue): DateValue {
  const newDate = new Date(0)
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1)
  return newDate
}

/** `single-index.js:191` — last day of `date`'s month (`day 0` of the next month). */
function lastDayOfMonth(date: DateValue): DateValue {
  const newDate = new Date(0)
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0)
  return newDate
}

/* -----------------------------------------------------------------------------
 * Arithmetic (L204-335)
 * ----------------------------------------------------------------------------- */

/** `single-index.js:204`. */
export function addDays(_date: DateValue, numDays: number): DateValue {
  const newDate = new Date(_date.getTime())
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}

/** `single-index.js:217`. */
export function subDays(_date: DateValue, numDays: number): DateValue {
  return addDays(_date, -numDays)
}

/** `single-index.js:226`. */
export function addWeeks(_date: DateValue, numWeeks: number): DateValue {
  return addDays(_date, numWeeks * 7)
}

/** `single-index.js:235`. */
export function subWeeks(_date: DateValue, numWeeks: number): DateValue {
  return addWeeks(_date, -numWeeks)
}

/** `single-index.js:243` — Sunday-start of `_date`'s week. */
export function startOfWeek(_date: DateValue): DateValue {
  const dayOfWeek = _date.getDay()
  return subDays(_date, dayOfWeek)
}

/** `single-index.js:255` — Saturday-end of `_date`'s week. */
export function endOfWeek(_date: DateValue): DateValue {
  const dayOfWeek = _date.getDay()
  return addDays(_date, 6 - dayOfWeek)
}

/** `single-index.js:267` — add months, preserving the intended month via `keepDateWithinMonth` (Jan31+1→Feb28/29). */
export function addMonths(_date: DateValue, numMonths: number): DateValue {
  const newDate = new Date(_date.getTime())
  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12
  newDate.setMonth(newDate.getMonth() + numMonths)
  keepDateWithinMonth(newDate, dateMonth)
  return newDate
}

/** `single-index.js:284`. */
export function subMonths(_date: DateValue, numMonths: number): DateValue {
  return addMonths(_date, -numMonths)
}

/** `single-index.js:293`. */
export function addYears(_date: DateValue, numYears: number): DateValue {
  return addMonths(_date, numYears * 12)
}

/** `single-index.js:302`. */
export function subYears(_date: DateValue, numYears: number): DateValue {
  return addYears(_date, -numYears)
}

/** `single-index.js:311` — set month (zero-indexed), preserving via `keepDateWithinMonth`. */
export function setMonth(_date: DateValue, month: number): DateValue {
  const newDate = new Date(_date.getTime())
  newDate.setMonth(month)
  keepDateWithinMonth(newDate, month)
  return newDate
}

/** `single-index.js:327` — set year, preserving the month via `keepDateWithinMonth` (Feb29→non-leap→Feb28). */
export function setYear(_date: DateValue, year: number): DateValue {
  const newDate = new Date(_date.getTime())
  const month = newDate.getMonth()
  newDate.setFullYear(year)
  keepDateWithinMonth(newDate, month)
  return newDate
}

/* -----------------------------------------------------------------------------
 * Compare / clamp (L344-453)
 * ----------------------------------------------------------------------------- */

/** `single-index.js:344` — earliest of the two (fresh Date). */
function min(dateA: DateValue, dateB: DateValue): DateValue {
  let newDate = dateA
  if (dateB.getTime() < dateA.getTime()) {
    newDate = dateB
  }
  return new Date(newDate.getTime())
}

/** `single-index.js:361` — latest of the two (fresh Date). */
function max(dateA: DateValue, dateB: DateValue): DateValue {
  let newDate = dateA
  if (dateB.getTime() > dateA.getTime()) {
    newDate = dateB
  }
  return new Date(newDate.getTime())
}

/** `single-index.js:378` — same calendar year (falsy-safe: false if either date is missing). */
export function isSameYear(dateA: DateValue | undefined, dateB: DateValue | undefined): boolean {
  return !!(dateA && dateB && dateA.getFullYear() === dateB.getFullYear())
}

/** `single-index.js:388` — same year AND month. */
export function isSameMonth(dateA: DateValue | undefined, dateB: DateValue | undefined): boolean {
  return isSameYear(dateA, dateB) && dateA!.getMonth() === dateB!.getMonth()
}

/** `single-index.js:398` — same year, month AND day. */
export function isSameDay(dateA: DateValue | undefined, dateB: DateValue | undefined): boolean {
  return isSameMonth(dateA, dateB) && dateA!.getDate() === dateB!.getDate()
}

/** `single-index.js:409` — clamp `date` into `[minDate, maxDate]` (maxDate optional); fresh Date. */
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

/** `single-index.js:429` — `date >= min && (!max || date <= max)`. */
export function isDateWithinMinAndMax(
  date: DateValue,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): boolean {
  return date.getTime() >= minDate.getTime() && (!maxDate || date.getTime() <= maxDate.getTime())
}

/** `single-index.js:440` — is `date`'s whole month outside `[min,max]`. */
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

/** `single-index.js:451` — is `date`'s whole year outside `[min,max]`. */
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

/** `single-index.js:470` — range highlight bounds; within-* are STRICTLY interior (start+1..end−1, L475-476). */
export interface RangeDates {
  rangeStartDate: DateValue | undefined
  rangeEndDate: DateValue | undefined
  withinRangeStartDate: DateValue | undefined
  withinRangeEndDate: DateValue | undefined
}
export function setRangeDates(date: DateValue, rangeDate: DateValue | undefined): RangeDates {
  if (!rangeDate) {
    return {
      rangeStartDate: undefined,
      rangeEndDate: undefined,
      withinRangeStartDate: undefined,
      withinRangeEndDate: undefined,
    }
  }
  const rangeStartDate = min(date, rangeDate)
  const rangeEndDate = max(date, rangeDate)
  return {
    rangeStartDate,
    rangeEndDate,
    withinRangeStartDate: addDays(rangeStartDate, 1),
    withinRangeEndDate: subDays(rangeEndDate, 1),
  }
}

/* -----------------------------------------------------------------------------
 * Parse / format (L494-582)
 * ----------------------------------------------------------------------------- */

/**
 * `single-index.js:494` — parse `MM/DD/YYYY` (external) or `YYYY-MM-DD` (internal). `adjustDate` clamps month
 * (1-12) + day (1..lastDay) and expands a <3-digit year against the current-decade stub (L520-527). A date is
 * built ONLY if `month && day && year != null` (L555) → year 0 is valid; month/day 0 are falsy ⇒ no date.
 */
export function parseDateString(
  dateString: string | undefined | null,
  dateFormat: string = INTERNAL_DATE_FORMAT,
  adjustDate = false,
): DateValue | undefined {
  let date: DateValue | undefined
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
            const currentYearStub = currentYear - (currentYear % 10 ** yearStr.length)
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

/** `single-index.js:570` — serialize; external `MM/DD/YYYY`, internal `YYYY-MM-DD` (default). `padZeros` zero-pads. */
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

/* -----------------------------------------------------------------------------
 * Validation chain (L798-869) — ported PURE (see HEADLESS BOUNDARY above)
 * ----------------------------------------------------------------------------- */

/**
 * `single-index.js:798` — is the EXTERNAL `MM/DD/YYYY` value invalid? Empty ⇒ valid (L804). Otherwise valid ONLY
 * if a raw-split round-trip matches month/day/year (rejects overflow like `02/31`), the year part is EXACTLY 4
 * chars (L821), and the date sits within `[min,max]`. Reads the RAW string (NOT an adjusted parse). `minDate` is
 * always resolved (default `0000-01-01`); `maxDate` optional.
 */
export function isDateInputInvalid(
  dateString: string,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): boolean {
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
        && dateStringParts[2]?.length === 4
        && isDateWithinMinAndMax(checkDate, minDate, maxDate)
      ) {
        isInvalid = false
      }
    }
  }

  return isInvalid
}

/**
 * `single-index.js:838` — PURE port of the scoped constraint-validation decision. Returns the custom-validity
 * string connect should apply (connect calls `el.setCustomValidity`), or `null` for NO change:
 *   • set `VALIDATION_MESSAGE` only if invalid AND no existing message (L842).
 *   • clear (`""`) only if the current message IS `VALIDATION_MESSAGE` (L846) — never stomps a foreign validity.
 */
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

/**
 * `single-index.js:858` — PURE port: the internal ISO value that should mirror the EXTERNAL value. `""` when the
 * external is empty/invalid; else `formatDate` of the ADJUSTED parse (2-digit-year expansion + clamping via
 * `adjustDate=true`). Connect writes-if-changed + dispatches `change` (L866-868). QUIRK-ADJUSTED-VALIDATION: the
 * mirror uses the ADJUSTED `inputDate`, but the invalid-guard reads the RAW string via `isDateInputInvalid`.
 */
export function reconcileInputValues(
  externalValue: string,
  minDate: DateValue,
  maxDate: DateValue | undefined,
): string {
  const inputDate = parseDateString(externalValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
  let newValue = ''

  if (inputDate && !isDateInputInvalid(externalValue, minDate, maxDate)) {
    newValue = formatDate(inputDate)
  }

  return newValue
}

/* -----------------------------------------------------------------------------
 * Render support (L977-1116) — the day-grid loop + locale labels
 * ----------------------------------------------------------------------------- */

// The Zag port exposes raw `Date` value/min/max props USWDS never had. A consumer's
// `new Date(y,m,d)` is LOCAL midnight, but internal dates are `setDate`-built (epoch-offset time-of-day), so a raw
// getTime() clamp would mis-disable boundary cells. Normalize every incoming Date through `setDate` so ALL dates
// share one offset and comparisons stay Y/M/D-consistent.
export function normalizeDate(date: DateValue): DateValue {
  return setDate(date.getFullYear(), date.getMonth(), date.getDate())
}

// `single-index.js:1104-1116` — the visible day array: start at the Sunday of the focused month's first week, push
// until ≥28 cells AND past the focused month AND a whole-week boundary (28-42 cells / 4-6 whole weeks).
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

// Locale label seeds — `single-index.js:85-92`. `new Date(0, i)` = 1900-based (the 2-digit-year map), but only the
// locale month/weekday NAMES matter, which are year-independent. `DAY_OF_WEEK_DATE_SEED[0]` = Sun (`new Date(0,0,0)`
// = Dec 31 1899). Ported verbatim so the day-cell `aria-label` month/weekday text matches the original byte-for-byte.
const MONTH_DATE_SEED = Array.from({ length: 12 }, (_, i) => new Date(0, i))
const DAY_OF_WEEK_DATE_SEED = Array.from({ length: 7 }, (_, i) => new Date(0, 0, i))

/** `single-index.js:710` — long month names Jan..Dec for the given locale (BCP-47 / `document.documentElement.lang`). */
export function getMonthLabels(locale: string): string[] {
  return MONTH_DATE_SEED.map(d => d.toLocaleString(locale, { month: 'long' }))
}

/** `single-index.js:713` — long weekday names Sun..Sat (aria-labels). */
export function getWeekdayLabels(locale: string): string[] {
  return DAY_OF_WEEK_DATE_SEED.map(d => d.toLocaleString(locale, { weekday: 'long' }))
}

/** `single-index.js:718` — narrow weekday abbreviations Sun..Sat (the `<th>` text). */
export function getWeekdayNarrow(locale: string): string[] {
  return DAY_OF_WEEK_DATE_SEED.map(d => d.toLocaleString(locale, { weekday: 'narrow' }))
}

/* -----------------------------------------------------------------------------
 * Range cross-clamp — the intra-machine replacement for `range-index.js`'s dataset sync
 * ----------------------------------------------------------------------------- */

// Each endpoint is bounded by its peer and the global limits.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L65-L105
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

/** Keep source endpoint slots stable, including end-only `[undefined, end]`. */
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

/** Defend JavaScript callers as well as the narrow public TypeScript API. */
export function isEndpointIndex(value: unknown): value is EndpointIndex {
  return value === 0 || value === 1
}
