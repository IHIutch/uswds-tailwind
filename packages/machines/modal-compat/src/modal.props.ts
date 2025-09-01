import type { ModalProps } from './modal.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ModalProps>()([
  'aria-label',
  'dir',
  'finalFocusEl',
  'getRootNode',
  'id',
  'ids',
  'modal',
  'onEscapeKeyDown',
  'onFocusOutside',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'defaultOpen',
  'open',
  'persistentElements',
  'preventScroll',
  'restoreFocus',
  'role',
  'trapFocus',
  'forceAction',
])

export const splitProps = createSplitProps<Partial<ModalProps>>(props)
