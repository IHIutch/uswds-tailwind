import type { ComboboxProps } from './combobox.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ComboboxProps>()([
  'ariaDisabled',
  'aria-label',
  'aria-labelledby',
  'customFilter',
  'defaultValue',
  'dir',
  'disableFiltering',
  'disabled',
  'getRootNode',
  'id',
  'ids',
  'name',
  'onValueChange',
  'options',
  'placeholder',
  'required',
])

export const splitProps = createSplitProps<Partial<ComboboxProps>>(props)
