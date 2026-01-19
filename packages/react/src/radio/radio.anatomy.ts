import { createAnatomy } from '@zag-js/anatomy'

export const fieldAnatomy = createAnatomy('field').parts(
  'root',
  'input',
  'label',
  'control',
)
export const parts = fieldAnatomy.build()
