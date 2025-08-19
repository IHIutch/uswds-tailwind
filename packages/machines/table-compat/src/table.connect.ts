import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { SortableTableSchema } from './table.types'
import { parts } from './table.anatomy'
import * as dom from './table.dom'

export function connect<T extends PropTypes>(
  service: Service<SortableTableSchema>,
  normalize: NormalizeProps<T>,
) {
  const { send, context, scope } = service
  const sortedColumn = context.get('sortedColumn')
  const sortDirection = context.get('sortDirection')

  return {
    sortedColumn,
    sortDirection,

    sortByColumn(columnIndex: number) {
      send({ type: 'SORT', columnIndex })
    },

    getColumnSortDirection(columnIndex: number) {
      return sortedColumn === columnIndex ? sortDirection : 'none'
    },

    isColumnSorted(columnIndex: number) {
      return sortedColumn === columnIndex && sortDirection !== 'none'
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getHeaderCellProps(columnIndex: number) {
      const isCurrentlySorted = sortedColumn === columnIndex
      const currentDirection = isCurrentlySorted ? sortDirection : 'none'

      return normalize.element({
        ...parts.headerCell.attrs,
        'data-sort': currentDirection === 'none' ? undefined : currentDirection,
        'aria-sort': currentDirection === 'none' ? undefined : currentDirection === 'asc' ? 'ascending' : 'descending',
      })
    },

    getSortButtonProps(columnIndex: number) {
      const isCurrentlySorted = sortedColumn === columnIndex
      const currentDirection = isCurrentlySorted ? sortDirection : 'none'

      return normalize.button({
        ...parts.sortButton.attrs,
        'type': 'button',
        'data-sort': currentDirection === 'none' ? undefined : currentDirection,
        onClick() {
          send({ type: 'SORT', columnIndex })
        },
      })
    },

    getBodyCellProps(columnIndex: number) {
      const isCurrentlySorted = sortedColumn === columnIndex

      return normalize.element({
        ...parts.tbody.attrs,
        'data-sort-active': isCurrentlySorted,
      })
    },
  }
}
