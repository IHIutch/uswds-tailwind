import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('combobox').parts(
  'root',
  'label',
  'input',
  'list',
  'item',
  'select',
  'clearButton',
  'toggleButton',
)

export const parts = anatomy.build()
