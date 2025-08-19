import type { SortableTableSchema, SortDirection } from './table.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<SortableTableSchema>({
  props({ props }) {
    return {
      id: '',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable }) {
    return {
      sortedColumn: bindable(() => ({ defaultValue: -1 })),
      sortDirection: bindable(() => ({ defaultValue: 'none' as SortDirection })),
    }
  },

  states: {
    idle: {
      on: {
        SORT: {
          actions: ['sort'],
        },
      },
    },
  },

  implementations: {
    actions: {
      sort({ context, event }) {
        if (event.type !== 'SORT') return
        
        const currentColumn = context.get('sortedColumn')
        const currentDirection = context.get('sortDirection')
        const newColumn = event.columnIndex

        if (currentColumn === newColumn) {
          // Same column - toggle direction
          const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'
          context.set('sortDirection', newDirection)
        } else {
          // New column - start with ascending
          context.set('sortedColumn', newColumn)
          context.set('sortDirection', 'asc')
        }
      },
    },
  },
})
