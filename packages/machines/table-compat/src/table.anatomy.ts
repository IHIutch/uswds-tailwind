import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('table').parts(
  'root',
  'headerCell',
  'bodyCell',
  'sortButton',
  'srStatus',
)

export const parts = anatomy.build()
