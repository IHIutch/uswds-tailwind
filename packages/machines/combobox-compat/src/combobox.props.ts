import type { ComboboxProps } from './combobox.types'
import { createProps } from '@zag-js/types'

export const props = createProps<ComboboxProps>()([
  'id',
  'getRootNode',
  'options',
  'value',
  'multiple',
  'disabled',
  'placeholder',
  'showClearButton',
  'showToggleButton',
  'disableFiltering',
  'onSelectionChange',
  'onInputChange',
])
