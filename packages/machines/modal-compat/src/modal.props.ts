import type { ModalProps } from './modal.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<ModalProps>()([
  'forceAction',
  'ids',
  'open',
  'id',
  'getRootNode',
])

export const splitProps = createSplitProps<Partial<ModalProps>>(props)
