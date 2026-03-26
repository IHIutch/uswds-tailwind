import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('input-mask').parts(
  'root',
  'label',
  'description',
  'input',
  'placeholder',
)

export const parts = anatomy.build()
