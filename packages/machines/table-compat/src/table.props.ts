import type { SortableTableProps } from './table.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<SortableTableProps>()([
  'id',
  'getRootNode',
])

export const splitProps = createSplitProps<Partial<SortableTableProps>>(props)
