import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { CellProps, HeaderProps, SortDirection, TableApi, TableSchema } from './table.types'
import { parts } from './table.anatomy'
import * as dom from './table.dom'

export function connect<T extends PropTypes>(
  service: Service<TableSchema>,
  normalize: NormalizeProps<T>,
): TableApi<T> {
  const { state, context, send, prop, scope, computed } = service

  const sortedColumnIndex = context.get('sortedColumnIndex')
  const sortDirection = context.get('sortDirection')
  const isSorted = computed('isSorted')
  const announcement = computed('announcement')
  const columnNames = prop('columnNames') ?? {}

  const focused = state.matches('focused')

  return {
    focused,
    isSorted,
    sortedColumnIndex,
    sortDirection,
    announcement,

    // If direction is omitted, the machine action toggles.
    sort(columnIndex: number, direction?: SortDirection) {
      send({ type: 'SORT', columnIndex, direction })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getHeaderProps(props: HeaderProps) {
      const { index } = props
      const isThisSorted = sortedColumnIndex === index
      const name = columnNames[index] ?? ''

      const isSortedAscending = isThisSorted && sortDirection === 'ascending'

      const ariaLabel = `${name}, sortable column, currently ${
        isThisSorted
          ? `${isSortedAscending ? 'sorted ascending' : 'sorted descending'}`
          : 'unsorted'
      }`

      return normalize.element({
        ...parts.header.attrs,
        'id': dom.getHeaderId(scope, index),
        'data-sortable': true,
        'aria-sort': isThisSorted ? sortDirection ?? undefined : undefined,
        'aria-label': ariaLabel,
      })
    },

    getSortButtonProps(props: HeaderProps) {
      const { index } = props
      const isThisSorted = sortedColumnIndex === index
      const name = columnNames[index] ?? ''

      // If currently ascending → next is descending; otherwise → ascending
      const nextDirection: SortDirection
        = isThisSorted && sortDirection === 'ascending' ? 'descending' : 'ascending'
      const title = `Click to sort by ${name} in ${nextDirection} order.`

      return normalize.button({
        ...parts.sortButton.attrs,
        id: dom.getSortButtonId(scope, index),
        type: 'button',
        tabIndex: 0,
        title,
        onClick() {
          send({ type: 'SORT', columnIndex: index })
        },
        onFocus() {
          send({ type: 'SORT_BUTTON.FOCUS', columnIndex: index })
        },
        onBlur() {
          send({ type: 'SORT_BUTTON.BLUR', columnIndex: index })
        },
      })
    },

    getCellProps(props: CellProps) {
      return normalize.element({
        ...parts.cell.attrs,
        'data-sort-active':
          sortedColumnIndex === props.columnIndex ? true : undefined,
      })
    },

    getAnnouncementRegionProps() {
      return normalize.element({
        ...parts.announcementRegion.attrs,
        'id': dom.getAnnouncementRegionId(scope),
        'aria-live': 'polite' as const,
        'role': 'status',
      })
    },
  }
}
