import type { ModalProps } from './modal.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ModalProps>()([
  'id',
  'ids',
  'getRootNode',
  'forceAction',
  'preventScroll',
  'trapFocus',
  'modal',
  'role',
  'initialFocusEl',
  'restoreFocus',
  'defaultOpen',
  'open',
  'onOpenChange',
])

export const splitProps = createSplitProps<Partial<ModalProps>>(props)
