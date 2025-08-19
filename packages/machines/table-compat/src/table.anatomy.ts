import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('sortable-table').parts(
  'root',
  'table',
  'caption', 
  'thead',
  'tbody',
  'tfoot',
  'headerCell',
  'sortButton',
  'announcement',
)

export const parts = anatomy.build()