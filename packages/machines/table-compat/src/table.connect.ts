import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { TableApi, TableSchema } from './table.types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './table.anatomy'
import * as dom from './table.dom'

export function connect<T extends PropTypes>(
  service: Service<TableSchema>,
  normalize: NormalizeProps<T>,
): TableApi<T> {
  const { send, context, scope, computed } = service

  const sortColumn = context.get('sortColumn')
  const sortDirection = context.get('sortDirection')
  const announcement = computed('announcement')

  return {
    sortColumn,
    sortDirection,
    announcement,

    setSort(details) {
      send({ type: 'SORT.SET', ...details })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getTableProps() {
      return normalize.element(parts.table.attrs)
    },

    getHeaderProps({ columnIndex, headerName, headerId }) {
      const isSorted = sortColumn === columnIndex && sortDirection != null
      const sortedAscending = isSorted && sortDirection === 'asc'
      return normalize.element({
        ...parts.header.attrs,
        'id': dom.getHeaderId(scope, headerId ?? columnIndex),
        'data-sortable': dataAttr(true),
        'aria-sort': isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined,
        'aria-label': `${headerName}, sortable column, currently ${
          isSorted ? sortedAscending ? 'sorted ascending' : 'sorted descending' : 'unsorted'
        }`,
      })
    },

    getSortButtonProps({ columnIndex, headerName, headerId }) {
      const sortedAscending = sortColumn === columnIndex && sortDirection === 'asc'
      return normalize.button({
        ...parts.sortButton.attrs,
        id: dom.getSortButtonId(scope, headerId ?? columnIndex),
        type: 'button',
        tabIndex: 0,
        title: `Click to sort by ${headerName} in ${sortedAscending ? 'descending' : 'ascending'} order.`,
        onClick(event) {
          const root = dom.getRootEl(scope)
          if (!root?.contains(event.currentTarget))
            return
          event.preventDefault()
          send({
            type: 'SORT.TOGGLE',
            columnIndex,
          })
        },
      })
    },

    getCellProps({ columnIndex }) {
      return normalize.element({
        'data-sort-active': sortColumn === columnIndex && sortDirection != null ? 'true' : undefined,
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'aria-live': 'polite',
      })
    },
  }
}
