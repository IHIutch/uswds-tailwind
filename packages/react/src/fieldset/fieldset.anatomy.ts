import { createAnatomy } from '@zag-js/anatomy'

export const fieldAnatomy = createAnatomy('field').parts(
  'root',
  'errorText',
  'description',
  'legend',
)
export const parts = fieldAnatomy.build()
