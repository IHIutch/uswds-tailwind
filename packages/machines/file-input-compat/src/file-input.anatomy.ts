import { createAnatomy } from '@zag-js/anatomy'

// itemGroup is the consumer-owned wrapper around the heading and preview items.
export const anatomy = createAnatomy('fileInput').parts(
  'root',
  'label',
  'dropzone',
  'box',
  'input',
  'instructions',
  'dragText',
  'choose',
  'itemGroup',
  'previewHeading',
  'item',
  'itemPreviewImage',
  'errorText',
  'srStatus',
)

export const parts = anatomy.build()
