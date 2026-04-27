import type { CollapseProps } from './collapse.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<CollapseProps>()([
  'dir',
  'getRootNode',
  'id',
  'ids',
  'open',
  'defaultOpen',
  'onOpenChange',
])

export const splitProps = createSplitProps<Partial<CollapseProps>>(props)
