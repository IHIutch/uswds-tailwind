import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('file-input').parts(
  'root',
  'dropzone',
  'input',
  'errorMessage',
  'instructions',
  'srStatus',
  'previewHeader',
  'previewList',
  'previewItem',
  'previewItemIcon',
  'previewItemContent',
)

export const parts = anatomy.build()
