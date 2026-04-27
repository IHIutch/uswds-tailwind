import { createAnatomy } from '@zag-js/anatomy'

export const selectAnatomy = createAnatomy('select').parts(
  'root',
  'field',
  'icon',
)
export const parts = selectAnatomy.build()
