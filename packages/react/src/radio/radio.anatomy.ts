import { createAnatomy } from '@zag-js/anatomy'

export const radioAnatomy = createAnatomy('radio').parts(
  'root',
  'input',
  'label',
  'control',
)
export const parts = radioAnatomy.build()
