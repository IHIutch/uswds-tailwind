import { createAnatomy } from '@zag-js/anatomy'

// Rows and cells are consumer markup, not anatomy parts.
export const anatomy = createAnatomy('table').parts(
  'root',
  'table',
  'header',
  'sortButton',
  'srStatus',
)

export const parts = anatomy.build()
