import type { CharacterCountProps } from './character-count.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<CharacterCountProps>()([
  'id',
  'getRootNode',
  'maxLength',
  'statusSrDebounce',
  'getStatusText',
])

export const splitProps = createSplitProps<Partial<CharacterCountProps>>(props)
