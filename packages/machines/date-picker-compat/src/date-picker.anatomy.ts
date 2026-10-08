import { createAnatomy } from '@zag-js/anatomy'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L927-L947
export const anatomy = createAnatomy('date-picker').parts(
  'root',
  'control',
  'input',
  'hiddenInput',
  'trigger',
  'content',
  'status',
  'view',
  'viewControl',
  'prevTrigger',
  'nextTrigger',
  'viewTrigger',
  'table',
  'tableHead',
  'tableHeader',
  'tableBody',
  'tableRow',
  'tableCell',
  'tableCellTrigger',
)

export const parts = anatomy.build()

export const rangeAnatomy = createAnatomy('date-range-picker').parts('root')
export const rangeParts = rangeAnatomy.build()
