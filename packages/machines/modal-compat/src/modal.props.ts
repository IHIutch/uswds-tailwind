import type { ModalProps } from './modal.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ModalProps>()([
  'aria-label',
  'closeOnEscape',
  'closeOnInteractOutside',
  'dir',
  'finalFocusEl',
  'getRootNode',
  'id',
  'ids',
  'initialFocusEl',
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
])

export const splitProps = createSplitProps<Partial<ModalProps>>(props)
