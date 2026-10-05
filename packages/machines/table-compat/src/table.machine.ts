import type { SortDescriptor, TableSchema } from './table.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<TableSchema>({
  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    return {
      sortDescriptor: bindable<SortDescriptor | null>(() => ({
        defaultValue: prop('defaultSortDescriptor') ?? null,
        value: prop('sortDescriptor'),
        onChange(sortDescriptor) {
          prop('onSortChange')?.({ sortDescriptor })
        },
      })),
    }
  },

  computed: {
    announcement({ context, prop }) {
      const sortDescriptor = context.get('sortDescriptor')
      if (!sortDescriptor)
        return ''

      const headerName = prop('columnNames')?.[sortDescriptor.column]
      if (!headerName)
        return ''
      const caption = prop('captionText') ?? ''
      return `The table named "${caption}" is now sorted by ${headerName} in ${sortDescriptor.direction} order.`
    },
  },

  on: {
    SORT: { actions: ['setSortDescriptor'] },
  },

  states: {
    idle: {},
  },

  implementations: {
    actions: {
      setSortDescriptor({ context, event }) {
        const { columnIndex } = event
        const sortDescriptor = context.get('sortDescriptor')
        context.set('sortDescriptor', columnIndex === null
          ? null
          : {
              column: columnIndex,
              direction: event.direction ?? (sortDescriptor?.column === columnIndex && sortDescriptor.direction === 'ascending' ? 'descending' : 'ascending'),
            })
      },
    },
  },
})
