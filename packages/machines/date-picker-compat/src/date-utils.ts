// Date math follows USWDS, including year zero and month-preserving arithmetic.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L129-L584
export const DEFAULT_EXTERNAL_DATE_FORMAT = 'MM/DD/YYYY'
export const INTERNAL_DATE_FORMAT = 'YYYY-MM-DD'
export type DateFormat = typeof DEFAULT_EXTERNAL_DATE_FORMAT | typeof INTERNAL_DATE_FORMAT

export interface Interval {
  start: Date
  end?: Date
}

function keepDateWithinMonth(dateToCheck: Date, month: number) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0)
  }
  return dateToCheck
}

// setFullYear keeps years 0-99 from turning into 1900-1999.
export function createDate(year: number, month: number, date: number) {
  const newDate = new Date(0)
  newDate.setFullYear(year, month, date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

export function startOfDay(date: Date) {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfToday() {
  return startOfDay(new Date())
}

export function startOfWeek(_date: Date) {
  return addDays(_date, -_date.getDay())
}

// USWDS uses midnight on the last day of the week.
export function endOfWeek(_date: Date) {
  return addDays(_date, 6 - _date.getDay())
}

export function startOfMonth(date: Date) {
  return createDate(date.getFullYear(), date.getMonth(), 1)
}

export function lastDayOfMonth(date: Date) {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0)
}

export function startOfYear(date: Date) {
  return createDate(date.getFullYear(), 0, 1)
}

export function lastDayOfYear(date: Date) {
  return createDate(date.getFullYear(), 11, 31)
}

export function addDays(_date: Date, numDays: number) {
  const newDate = new Date(_date.getTime())
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}

/** Preserve the intended month when the day overflows, e.g. January 31 to February 28. */
export function addMonths(_date: Date, numMonths: number) {
  const newDate = new Date(_date.getTime())
  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12
  newDate.setMonth(newDate.getMonth() + numMonths)
  keepDateWithinMonth(newDate, dateMonth)
  return newDate
}

export function addYears(_date: Date, numYears: number) {
  return addMonths(_date, numYears * 12)
}

export function setMonth(_date: Date, month: number) {
  const newDate = new Date(_date.getTime())
  newDate.setMonth(month)
  keepDateWithinMonth(newDate, month)
  return newDate
}

// Clamp February 29 to February 28 when the target year is not a leap year.
export function setYear(_date: Date, year: number) {
  const newDate = new Date(_date.getTime())
  const month = newDate.getMonth()
  newDate.setFullYear(year)
  keepDateWithinMonth(newDate, month)
  return newDate
}

export function isBefore(dateA: Date, dateB: Date) {
  return dateA.getTime() < dateB.getTime()
}

export function isAfter(dateA: Date, dateB: Date) {
  return dateA.getTime() > dateB.getTime()
}

export function min(dateA: Date, dateB: Date) {
  return new Date(isBefore(dateB, dateA) ? dateB : dateA)
}

export function max(dateA: Date, dateB: Date) {
  return new Date(isAfter(dateB, dateA) ? dateB : dateA)
}

// Missing dates compare as unequal, including two undefined values.
export function isSameYear(dateA: Date | undefined, dateB: Date | undefined) {
  return !!(dateA && dateB && dateA.getFullYear() === dateB.getFullYear())
}

export function isSameMonth(dateA: Date | undefined, dateB: Date | undefined) {
  return isSameYear(dateA, dateB) && dateA!.getMonth() === dateB!.getMonth()
}

export function isSameDay(dateA: Date | undefined, dateB: Date | undefined) {
  return isSameMonth(dateA, dateB) && dateA!.getDate() === dateB!.getDate()
}

export function clamp(date: Date, { start, end }: Interval) {
  let result = date
  if (isBefore(date, start))
    result = start
  else if (end && isAfter(date, end))
    result = end
  return new Date(result.getTime())
}

export function isWithinInterval(date: Date, { start, end }: Interval) {
  return !isBefore(date, start) && (!end || !isAfter(date, end))
}

export function areIntervalsOverlapping(a: Interval, b: Interval) {
  return (!a.end || !isBefore(a.end, b.start)) && (!b.end || !isAfter(a.start, b.end))
}

export function isMonthInInterval(date: Date, interval: Interval) {
  return areIntervalsOverlapping({ start: startOfMonth(date), end: lastDayOfMonth(date) }, interval)
}

export function isYearInInterval(date: Date, interval: Interval) {
  return areIntervalsOverlapping({ start: startOfYear(date), end: lastDayOfYear(date) }, interval)
}

/** With adjustDate, clamp the month and day and expand one- or two-digit years. Validation uses the raw text. */
export function parseDateString(
  dateString: string | undefined | null,
  dateFormat: DateFormat = INTERNAL_DATE_FORMAT,
  adjustDate = false,
) {
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
      const currentYear = startOfToday().getFullYear()
      const yearStub = currentYear - (currentYear % 10 ** yearText.length)
      year = yearStub + parsedYear
    }
    month = Math.max(1, Math.min(12, month))
    day = Math.max(1, Math.min(createDate(year, month, 0).getDate(), day))
  }

  return month && day ? createDate(year, month - 1, day) : undefined
}

/** Format as ISO YYYY-MM-DD by default, or MM/DD/YYYY for visible inputs. */
export function formatDate(date: Date, dateFormat: DateFormat = INTERNAL_DATE_FORMAT) {
  const padZeros = (value: number, length: number) => `0000${value}`.slice(-length)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
    return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join('/')
  }

  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join('-')
}

const MONTH_DATE_SEED = Array.from({ length: 12 }, (_, i) => new Date(0, i))
const DAY_OF_WEEK_DATE_SEED = Array.from({ length: 7 }, (_, i) => new Date(0, 0, i))

export function getMonthLabels(locale: string) {
  return MONTH_DATE_SEED.map(d => d.toLocaleString(locale, { month: 'long' }))
}

export function getWeekDays(locale: string) {
  return DAY_OF_WEEK_DATE_SEED.map(date => ({
    long: date.toLocaleString(locale, { weekday: 'long' }),
    narrow: date.toLocaleString(locale, { weekday: 'narrow' }),
  }))
}
