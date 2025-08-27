import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('date-picker').parts(
  'root',
  'input',
  'trigger',
  'calendar',
  'status',
  'monthSelection',
  'yearSelection',
  'dateGrid',
  'dateButton',
  'monthButton',
  'yearButton',
  'navigationButton',
  'tableHeader',
  'tableBody',
  'dayOfWeekHeader',
  'monthPicker',
  'yearPicker',
)

export const parts = anatomy.build()
