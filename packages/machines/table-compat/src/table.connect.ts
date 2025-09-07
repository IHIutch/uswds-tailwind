import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { SortableTableSchema, SortDirection } from './table.types'
import { visuallyHiddenStyle } from '@zag-js/dom-query'
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
    srStatus: context.get('srStatus'),

    sortByColumn(columnIndex: number) {
      send({ type: 'SORT', columnIndex })
    },

    getColumnSortDirection(columnIndex: number): SortDirection {
      return sortedColumn === columnIndex ? sortDirection : undefined
    },

    isColumnSorted(columnIndex: number): boolean {
      return sortedColumn === columnIndex && sortDirection !== undefined
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'aria-live': 'polite',
        'style': visuallyHiddenStyle,
      })
    },

    getHeaderCellProps(columnIndex: number) {
      const isCurrentlySorted = sortedColumn === columnIndex
      const currentDirection = isCurrentlySorted ? sortDirection : 'none'
      const ariaSortValue = currentDirection === 'none' ? undefined : currentDirection === 'asc' ? 'ascending' : 'descending'

      return normalize.element({
        ...parts.headerCell.attrs,
        'data-sort': currentDirection === 'none' ? undefined : currentDirection,
        'aria-sort': ariaSortValue || undefined,
        'aria-label': ariaSortValue ? `Sort by this column in ${ariaSortValue} order` : 'Sort by this column',
      })
    },

    getSortButtonProps(columnIndex: number) {
      const isCurrentlySorted = sortedColumn === columnIndex
      const currentDirection = isCurrentlySorted ? sortDirection : undefined
      const nextDirection = currentDirection === 'desc' ? 'ascending' : 'descending'
      const titleText = `Click to sort by this column in ${nextDirection} order`

      return normalize.button({
        ...parts.sortButton.attrs,
        'type': 'button',
        'data-sort': currentDirection,
        'title': titleText,
        onClick() {
          send({ type: 'SORT', columnIndex })
        },
      })
    },

    getBodyCellProps(columnIndex: number) {
      const isCurrentlySorted = sortedColumn === columnIndex
      return normalize.element({
        ...parts.bodyCell.attrs,
        'data-sort-active': isCurrentlySorted,
      })
    },
  }
}
