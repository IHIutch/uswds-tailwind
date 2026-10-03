import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('modal').parts(
  'root',
  'trigger',
  'backdrop',
  'positioner',
  'content',
  'title',
  'description',
  'closeTrigger',
)

export const parts = anatomy.build()
