import type { FileInputProps, ItemProps } from './file-input.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<FileInputProps>()([
  'accept',
  'disabled',
  'errorMessage',
  'getRootNode',
  'id',
  'ids',
  'multiple',
  'name',
  'onFileChange',
  'required',
])

export const splitProps = createSplitProps<Partial<FileInputProps>>(props)

export const itemProps = createProps<ItemProps>()(['file'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)
