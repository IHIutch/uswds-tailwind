import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('datepicker').parts(
  'root',
  'input',
  'trigger',
  'calendar',
  'dayPicker',
  'monthPicker',
  'yearPicker',
  'grid',
  'header',
  'headerRow',
  'headerCell',
  'body',
  'row',
  'cell',
  'cellTrigger',
  'prevYearTrigger',
  'prevMonthTrigger',
  'monthSelection',
  'yearSelection',
  'nextMonthTrigger',
  'nextYearTrigger',
  'prevYearChunkTrigger',
  'nextYearChunkTrigger',
  'status',
)

export const parts = anatomy.build()
