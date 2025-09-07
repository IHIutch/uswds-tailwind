import type { SortableTableSchema, SortDirection } from './table.types'
import { createMachine } from '@zag-js/core'

export const machine = createMachine<SortableTableSchema>({
  props({ props }) {
    return {
      id: 'table',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable }) {
    return {
      sortedColumn: bindable(() => ({ defaultValue: -1 })),
      sortDirection: bindable<SortDirection>(() => ({ defaultValue: undefined })),
      srStatus: bindable(() => ({ defaultValue: '' })),
    }
  },

  watch({ track, context, action }) {
    track([() => context.get('sortedColumn'), () => context.get('sortDirection')], () => {
      action(['updateSrStatus'])
    })
  },

  states: {
    idle: {
      on: {
        SORT: {
          actions: ['sort', 'updateSrStatus'],
        },
      },
    },
  },

  implementations: {
    actions: {
      sort({ context, event }) {
        if (event.type !== 'SORT')
          return

        const currentColumn = context.get('sortedColumn')
        const currentDirection = context.get('sortDirection')
        const newColumn = event.columnIndex

        if (currentColumn === newColumn) {
          // Same column - toggle direction
          const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'
          context.set('sortDirection', newDirection)
        }
        else {
          // New column - start with ascending
          context.set('sortedColumn', newColumn)
          context.set('sortDirection', 'asc')
        }
      },
      updateSrStatus({ context }) {
        const sortedColumn = context.get('sortedColumn')
        const sortDirection = context.get('sortDirection')

        if (sortedColumn !== -1 && sortDirection) {
          const directionText = sortDirection === 'asc' ? 'ascending' : 'descending'
          context.set('srStatus', `Table sorted by column ${sortedColumn + 1} in ${directionText} order`)
        }
        else {
          context.set('srStatus', '')
        }
      },
    },
  },
})
