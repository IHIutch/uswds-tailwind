import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('tooltip').parts(
  'root',
  'trigger',
  'content',
)

export const parts = anatomy.build()
