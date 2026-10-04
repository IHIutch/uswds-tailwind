import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('combobox').parts(
  'root',
  'label',
  'hiddenSelect',
  'input',
  'clearTrigger',
  'trigger',
  'list',
  'item',
  'status',
)

export const parts = anatomy.build()
