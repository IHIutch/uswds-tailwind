import { createAnatomy } from '@zag-js/anatomy'

export const searchAnatomy = createAnatomy('search').parts(
  'root',
  'label',
  'input',
  'button',
)
export const parts = searchAnatomy.build()
