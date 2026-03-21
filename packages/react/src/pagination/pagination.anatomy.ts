import { createAnatomy } from '@zag-js/anatomy'

export const paginationAnatomy = createAnatomy('pagination').parts(
  'root',
  'list',
  'item',
  'ellipsis',
  'prevTrigger',
  'nextTrigger',
)
export const parts = paginationAnatomy.build()
