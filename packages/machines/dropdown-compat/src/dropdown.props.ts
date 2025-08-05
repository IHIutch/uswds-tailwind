import type { DropdownProps } from './dropdown.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<DropdownProps>()([
  'id',
  'ids',
  'dir',
  'getRootNode',
  'open',
  'defaultOpen',
  'onOpenChange',
])

export const splitProps = createSplitProps<Partial<DropdownProps>>(props)
