import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('input-mask').parts(
  'root',
  'input',
  'mask',
)

export const parts = anatomy.build()
