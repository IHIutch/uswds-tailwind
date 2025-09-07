import type { FileInputProps } from './file-input.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<FileInputProps>()([
  'id',
  'getRootNode',
  'accept',
  'minSize',
  'maxSize',
  'disabled',
  'srStatusText',
])

export const splitProps = createSplitProps<Partial<FileInputProps>>(props)
