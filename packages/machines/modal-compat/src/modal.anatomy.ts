import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('modal').parts(
  'trigger',
  'backdrop',
  'content',
  'title',
  'description',
  'closeTrigger',
)

export const parts = anatomy.build()
