import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('table').parts(
  'root',
  'header',
  'sortButton',
  'cell',
  'announcementRegion',
)

export const parts = anatomy.build()
