import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('file-input').parts(
  'root',
  'dropzone',
  'label',
  'input',
  'errorMessage',
  'instructions',
  'srStatus',
  'previewTitle',
  'previewList',
  'previewItem',
  'previewItemIcon',
  'previewItemThumb',
  'previewItemContent',
)

export const parts = anatomy.build()
