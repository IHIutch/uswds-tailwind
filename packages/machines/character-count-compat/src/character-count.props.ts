import type { CharacterCountProps } from './character-count.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<CharacterCountProps>()([
  'inputDescriptionIds',
  'defaultValue',
  'getRootNode',
  'id',
  'ids',
  'errorText',
  'maxLength',
  'onValueChange',
  'statusLabel',
  'value',
])

export const splitProps = createSplitProps<Partial<CharacterCountProps>>(props)
