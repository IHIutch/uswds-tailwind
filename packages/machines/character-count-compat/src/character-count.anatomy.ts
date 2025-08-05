import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('character-count').parts(
  'root',
  'label',
  'input',
  'status',
  'srStatus',
)

export const parts = anatomy.build()
