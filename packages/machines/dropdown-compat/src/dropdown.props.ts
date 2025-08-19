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
  'onInteractOutside',
  'onFocusOutside',
  'positioning',
  'onEscapeKeyDown',
  'onPointerDownOutside',
])

export const splitProps = createSplitProps<Partial<DropdownProps>>(props)
