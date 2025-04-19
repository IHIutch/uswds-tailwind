import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('dialog').parts(
  'trigger',
  'backdrop',
  'positioner',
  'content',
  'closeTrigger',
)

export const parts = anatomy.build()
