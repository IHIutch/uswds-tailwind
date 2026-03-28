import type { FileInputProps } from './file-input.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<FileInputProps>()([
  'id',
  'ids',
  'getRootNode',
  'accept',
  'multiple',
  'disabled',
  'srStatusText',
  'errorMessage',
])

export const splitProps = createSplitProps<Partial<FileInputProps>>(props)
