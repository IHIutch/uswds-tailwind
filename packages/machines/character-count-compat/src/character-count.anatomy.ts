import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('characterCount').parts(
  'root',
  'label',
  'control',
  'input',
  'description',
  'status',
  'srStatus',
)

export const parts = anatomy.build()
