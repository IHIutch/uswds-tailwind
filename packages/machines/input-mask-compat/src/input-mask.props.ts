import type { InputMaskProps } from './input-mask.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<InputMaskProps>()([
  'id',
  'getRootNode',
  'pattern',
  'placeholder',
  'charset',
  'maxlength',
])

export const splitProps = createSplitProps<Partial<InputMaskProps>>(props)
