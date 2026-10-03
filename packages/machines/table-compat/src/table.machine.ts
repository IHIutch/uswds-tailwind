import type { SortDirection, TableSchema } from './table.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<TableSchema>({
  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    return {
      sortColumn: bindable<number | null>(() => ({
        defaultValue: prop('defaultSortColumn') ?? null,
        value: prop('sortColumn'),
        sync: true,
      })),
      sortDirection: bindable<SortDirection | null>(() => ({
        defaultValue: prop('defaultSortDirection') ?? null,
        value: prop('sortDirection'),
        sync: true,
      })),
    }
  },

  computed: {
    announcement({ context, prop }) {
      const columnIndex = context.get('sortColumn')
      const direction = context.get('sortDirection')
      if (columnIndex == null || direction == null)
        return ''

      const headerName = prop('columnNames')?.[columnIndex]
      if (!headerName)
        return ''
      const caption = prop('captionText') ?? ''
      const order = direction === 'asc' ? 'ascending' : 'descending'
      return `The table named "${caption}" is now sorted by ${headerName} in ${order} order.`
    },
  },

  on: {
    'SORT.TOGGLE': { actions: ['toggleSort'] },
    'SORT.SET': { actions: ['setSort'] },
  },

  states: {
    idle: {},
  },

  implementations: {
    actions: {
      toggleSort({ context, event, prop }) {
        const columnIndex = event.columnIndex
        const direction = context.get('sortColumn') === columnIndex && context.get('sortDirection') === 'asc' ? 'desc' : 'asc'
        context.set('sortColumn', columnIndex)
        context.set('sortDirection', direction)
        prop('onSortChange')?.({ columnIndex, direction })
      },
      setSort({ context, event, prop }) {
        const { columnIndex } = event
        const direction = columnIndex === null ? null : event.direction
        context.set('sortColumn', columnIndex)
        context.set('sortDirection', direction)
        prop('onSortChange')?.({ columnIndex, direction })
      },
    },
  },
})
