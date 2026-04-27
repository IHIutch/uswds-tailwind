import type { InputMaskProps } from './input-mask.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<InputMaskProps>()([
  'id',
  'ids',
  'getRootNode',
  'placeholder',
  'charset',
  'value',
  'defaultValue',
  'onValueChange',
])

export const splitProps = createSplitProps<Partial<InputMaskProps>>(props)
