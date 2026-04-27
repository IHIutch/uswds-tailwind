import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('character-count').parts(
  'root',
  'formGroup',
  'label',
  'input',
  'status',
  'srStatus',
)

export const parts = anatomy.build()
