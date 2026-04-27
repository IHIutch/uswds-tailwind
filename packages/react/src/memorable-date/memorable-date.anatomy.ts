import { createAnatomy } from '@zag-js/anatomy'

export const memorableDateAnatomy = createAnatomy('memorable-date').parts(
  'root',
  'legend',
  'control',
)
export const parts = memorableDateAnatomy.build()
