import type { ComboboxProps, OptionProps } from './combobox.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ComboboxProps>()([
  'id',
  'ids',
  'getRootNode',
  'options',
  'disabled',
  'defaultValue',
  'value',
  'defaultInputValue',
  'inputValue',
  'placeholder',
  'required',
  'ariaLabel',
  'ariaLabelledby',
  'filter',
  'filterExtras',
  'disableFiltering',
  'customFilter',
  'onValueChange',
  'onInputValueChange',
  'onOpenChange',
])

export const splitProps = createSplitProps<Partial<ComboboxProps>>(props)

export const optionProps = createProps<OptionProps>()(['option', 'index'])
export const splitOptionProps = createSplitProps<OptionProps>(optionProps)
