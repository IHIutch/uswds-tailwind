import type { CellProps, HeaderProps, TableProps } from './table.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<TableProps>()([
  'defaultSortDescriptor',
  'getRootNode',
  'id',
  'ids',
  'captionText',
  'columnNames',
  'onSortChange',
  'sortDescriptor',
])

export const splitProps = createSplitProps<Partial<TableProps>>(props)

export const headerProps = createProps<HeaderProps>()(['columnIndex', 'headerName', 'headerId'])
export const splitHeaderProps = createSplitProps<HeaderProps>(headerProps)

export const cellProps = createProps<CellProps>()(['columnIndex'])
export const splitCellProps = createSplitProps<CellProps>(cellProps)
