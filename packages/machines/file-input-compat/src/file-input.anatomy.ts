import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('file-input').parts(
  'root',
  'label',
  'dropzone',
  'input',
  'instructions',
  'srStatus',
  'errorMessage',
  'previewHeading',
  'itemGroup',
  'item',
  'itemPreview',
  'itemName',
  'itemDeleteTrigger',
)

export const parts = anatomy.build()
