import { createAnatomy } from '@zag-js/anatomy'

// Shared parts follow Zag's date-picker anatomy. Views use data-view and
// navigation triggers use data-unit to distinguish USWDS month/year/12-year steps.
// The visible input carries the developer's id/name and submits MM/DD/YYYY.
// hiddenInput is the original, id/name-stripped ISO mirror; status is the live region.
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
