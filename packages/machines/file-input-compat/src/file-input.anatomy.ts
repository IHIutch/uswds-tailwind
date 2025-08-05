import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('file-input').parts(
  'root',
  'dropzone',
  'input',
  'errorMessage',
)

export const parts = anatomy.build()
