import type { ModalProps } from './modal.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ModalProps>()([
  'aria-label',
  'forceAction',
  'getRootNode',
  'id',
  'ids',
  'onOpenChange',
  'open',
])

export const splitProps = createSplitProps<Partial<ModalProps>>(props)
