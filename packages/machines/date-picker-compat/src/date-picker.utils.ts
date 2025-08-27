import type { DateFormat } from './date-picker.types'

// Helper functions for date manipulation
export function today(): Date {
  return new Date()
}

export function formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
  if (typeof date === 'string') {
    date = parseDate(date) || new Date()
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Support various common formats
  if (format === 'MM/dd/yyyy') {
    return `${month}/${day}/${year}`
  }
  else if (format === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`
  }

  return `${year}-${month}-${day}` // Default fallback
}

export function parseDate(dateString: string, dateFormat: DateFormat = 'YYYY-MM-DD') {
  if (!dateString)
    return null

  let year: number, month: number, day: number

  if (dateFormat === 'MM/dd/yyyy') {
    const parts = dateString.split('/')
    if (parts.length !== 3)
      return null

    month = Number(parts[0]) - 1 // Month is 0-indexed
    day = Number(parts[1])
    year = Number(parts[2])
  }
  else {
    // Default to YYYY-MM-DD or yyyy-MM-dd
    const parts = dateString.split('-')
    if (parts.length !== 3)
      return null

    year = Number(parts[0])
    month = Number(parts[1]) - 1 // Month is 0-indexed
    day = Number(parts[2])
  }

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day))
    return null
  if (month < 0 || month > 11)
    return null
  if (day < 1 || day > 31)
    return null

  const parsed = new Date(year, month, day)

  // Check if the date is valid (handles invalid dates like Feb 30)
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
    return null
  }

  return parsed
}

export function addDays(date: Date, days: number) {
  const result = new Date(date.getTime())
  result.setDate(result.getDate() + days)
  return result
}

export function addWeeks(date: Date, weeks: number) {
  return addDays(date, weeks * 7)
}

export function addMonths(date: Date, months: number) {
  const result = new Date(date.getTime())
  result.setMonth(result.getMonth() + months)
  return result
}

export function addYears(date: Date, years: number) {
  const result = new Date(date.getTime())
  result.setFullYear(result.getFullYear() + years)
  return result
}

export function isSameDay(dateLeft: Date, dateRight: Date) {
  if (!dateLeft || !dateRight)
    return false

  return (
    dateLeft.getFullYear() === dateRight.getFullYear()
    && dateLeft.getMonth() === dateRight.getMonth()
    && dateLeft.getDate() === dateRight.getDate()
  )
}

export function isBefore(date: Date, dateToCompare: Date) {
  if (!date || !dateToCompare)
    return false
  return date.getTime() < dateToCompare.getTime()
}

export function isAfter(date: Date, dateToCompare: Date) {
  if (!date || !dateToCompare)
    return false
  return date.getTime() > dateToCompare.getTime()
}

export function isWithinInterval(date: Date, interval: { start: Date, end: Date }) {
  if (!date || !interval.start || !interval.end)
    return false

  const dateTime = date.getTime()
  const startTime = interval.start.getTime()
  const endTime = interval.end.getTime()

  return dateTime >= startTime && dateTime <= endTime
}

export function getLocaleStrings() {
  const locale = document.documentElement.lang || 'en-US'
  const monthDate = new Date(2000, 0, 1)
  const dayDate = new Date(2000, 0, 2) // Sunday

  return {
    monthLabels: Array.from({ length: 12 }, (_, i) => {
      monthDate.setMonth(i)
      return monthDate.toLocaleString(locale, { month: 'long' })
    }),
    dayOfWeekLabels: Array.from({ length: 7 }, (_, i) => {
      dayDate.setDate(2 + i)
      return dayDate.toLocaleString(locale, { weekday: 'long' })
    }),
    dayOfWeekAbbreviations: Array.from({ length: 7 }, (_, i) => {
      dayDate.setDate(2 + i)
      return dayDate.toLocaleString(locale, { weekday: 'narrow' })
    }),
  }
}

export function isDateInRange(date: Date, startDate: Date | null, endDate: Date | null, hoverDate: Date | null = null) {
  if (!startDate)
    return false

  const actualEndDate = endDate || hoverDate
  if (!actualEndDate)
    return false

  const actualStart = startDate <= actualEndDate ? startDate : actualEndDate
  const actualEnd = startDate <= actualEndDate ? actualEndDate : startDate

  const dateTime = date.getTime()
  return dateTime > actualStart.getTime() && dateTime < actualEnd.getTime()
}
