import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('combobox').parts(
  'root',
  'label',
  'control',
  'input',
  'trigger',
  'clearTrigger',
  'listbox',
  'option',
  'status',
)

export const parts = anatomy.build()
