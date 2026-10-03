import type { DropdownProps } from './dropdown.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<DropdownProps>()([
  'defaultOpen',
  'getRootNode',
  'id',
  'ids',
  'onItemSelect',
  'onOpenChange',
  'open',
])

export const splitProps = createSplitProps<Partial<DropdownProps>>(props)
