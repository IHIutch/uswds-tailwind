import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('input-mask').parts(
  'root',
  'input',
  'placeholder',
)

export const parts = anatomy.build()
