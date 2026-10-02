import type { InputMaskProps } from './input-mask.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<InputMaskProps>()([
  'charset',
  'defaultValue',
  'getRootNode',
  'id',
  'ids',
  'mask',
  'onValueChange',
  'value',
])

export const splitProps = createSplitProps<Partial<InputMaskProps>>(props)
