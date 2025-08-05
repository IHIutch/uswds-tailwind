import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('dropdown').parts(
  'root',
  'trigger',
  'content',
  'item',
)

export const parts = anatomy.build()
