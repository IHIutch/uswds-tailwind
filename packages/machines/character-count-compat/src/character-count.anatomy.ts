import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('characterCount').parts(
  'root',
  'formGroup',
  'input',
  'hint',
  'visualStatus',
  'srStatus',
)

export const parts = anatomy.build()
