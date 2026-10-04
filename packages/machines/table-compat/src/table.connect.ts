import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { TableApi, TableService } from './table.types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './table.anatomy'
import * as dom from './table.dom'

export function connect<T extends PropTypes>(
  service: TableService,
  normalize: NormalizeProps<T>,
): TableApi<T> {
  const { send, context, scope, computed } = service

  const sortDescriptor = context.get('sortDescriptor')
  const announcement = computed('announcement')

  return {
    sortDescriptor,
    announcement,

    setSortDescriptor(sortDescriptor) {
      send({ type: 'SORT', columnIndex: sortDescriptor?.column ?? null, direction: sortDescriptor?.direction })
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
      const direction = sortDescriptor?.column === columnIndex ? sortDescriptor.direction : undefined
      return normalize.element({
        ...parts.header.attrs,
        'id': dom.getHeaderId(scope, headerId ?? columnIndex),
        'data-sortable': dataAttr(true),
        'aria-sort': direction,
        'aria-label': `${headerName}, sortable column, currently ${direction ? `sorted ${direction}` : 'unsorted'}`,
      })
    },

    getSortTriggerProps({ columnIndex, headerName, headerId }) {
      const sortedAscending = sortDescriptor?.column === columnIndex && sortDescriptor.direction === 'ascending'
      return normalize.button({
        ...parts.sortTrigger.attrs,
        id: dom.getSortTriggerId(scope, headerId ?? columnIndex),
        type: 'button',
        title: `Click to sort by ${headerName} in ${sortedAscending ? 'descending' : 'ascending'} order.`,
        onClick(event) {
          const root = dom.getRootEl(scope)
          if (!root?.contains(event.currentTarget))
            return
          event.preventDefault()
          send({
            type: 'SORT',
            columnIndex,
          })
        },
      })
    },

    getCellProps({ columnIndex }) {
      return normalize.element({
        'data-sort-active': sortDescriptor?.column === columnIndex ? 'true' : undefined,
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
