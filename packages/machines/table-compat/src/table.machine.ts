import type { SortDirection, TableSchema } from './table.types'
import { createMachine } from '@zag-js/core'
import { getWindow } from '@zag-js/dom-query'
import * as dom from './table.dom'

function getCellValue(tr: HTMLTableRowElement, index: number) {
  const cell = tr.children[index] as HTMLElement | undefined
  if (!cell)
    return ''
  return cell.getAttribute('data-sort-value') || cell.textContent || ''
}

function compareFunction(index: number, isAscending: boolean, locale: string) {
  return (thisRow: HTMLTableRowElement, nextRow: HTMLTableRowElement) => {
    const value1 = getCellValue(isAscending ? thisRow : nextRow, index)
    const value2 = getCellValue(isAscending ? nextRow : thisRow, index)

    if (
      value1
      && value2
      && !Number.isNaN(Number(value1))
      && !Number.isNaN(Number(value2))
    ) {
      return Number(value1) - Number(value2)
    }
    return value1.toString().localeCompare(value2.toString(), locale, {
      numeric: true,
      ignorePunctuation: true,
    })
  }
}

/* -----------------------------------------------------------------------------
 * Machine
 * ----------------------------------------------------------------------------- */

export const machine = createMachine<TableSchema>({
  initialState() {
    return 'idle'
  },

  props({ props }) {
    return {
      defaultSortDirection: 'ascending' as const,
      ...props,
    }
  },

  context({ prop, bindable }) {
    return {
      // Initialize from defaultSortedColumnIndex prop; null if unset
      sortedColumnIndex: bindable<number | null>(() => ({
        defaultValue: prop('defaultSortedColumnIndex') ?? null,
      })),
      // Initialize direction only if a column is set
      sortDirection: bindable<SortDirection | null>(() => ({
        defaultValue:
          prop('defaultSortedColumnIndex') != null
            ? prop('defaultSortDirection')
            : null,
      })),
    }
  },

  computed: {
    isSorted: ({ context }) => context.get('sortedColumnIndex') != null,
    announcement: ({ context, prop }) => {
      const index = context.get('sortedColumnIndex')
      const direction = context.get('sortDirection')
      if (index == null || direction == null)
        return ''
      const captionText = prop('captionText') ?? ''
      const columnNames = prop('columnNames') ?? {}
      const headerLabel = columnNames[index] ?? ''
      return `The table named "${captionText}" is now sorted by ${headerLabel} in ${direction} order.`
    },
  },

  on: {
    SORT: {
      actions: ['sortColumn'],
    },
  },

  states: {
    idle: {

      // Init effect: if a default sorted column is set, trigger the initial sort
      effects: ['initSort'],
      on: {
        'SORT_BUTTON.FOCUS': {
          target: 'focused',
        },
      },
    },
    focused: {

      on: {
        'SORT_BUTTON.BLUR': {
          target: 'idle',
        },
      },
    },
  },

  implementations: {
    actions: {
      // → unsetSort (L95-98). Single action handles: direction computation, context
      // update, DOM row reordering, data-sort-active, and callback.
      sortColumn({ context, event, scope, prop }) {
        const columnIndex = event.columnIndex as number

        let newDirection: SortDirection
        if (event.direction) {
          // Explicit direction (from init effect or imperative API) — use directly
          newDirection = event.direction as SortDirection
        }
        else {
          const currentIndex = context.get('sortedColumnIndex')
          const currentDirection = context.get('sortDirection')
          if (currentIndex === columnIndex && currentDirection === 'ascending') {
            newDirection = 'descending'
          }
          else if (currentIndex === columnIndex && currentDirection === 'descending') {
            newDirection = 'ascending'
          }
          else {
            newDirection = 'ascending'
          }
        }

        // 2. Update context
        context.set('sortedColumnIndex', columnIndex)
        context.set('sortDirection', newDirection)

        // This is a physical DOM operation like .focus() — the framework
        // doesn't manage row order, so we manipulate the DOM directly.
        const tableEl = dom.getRootEl(scope)
        if (!tableEl)
          return
        const tbody = tableEl.querySelector('tbody')
        if (!tbody)
          return

        const isAscending = newDirection === 'ascending'
        const locale = getWindow(scope.getDoc()).navigator.language
        const allRows = Array.from(tbody.querySelectorAll('tr')) as HTMLTableRowElement[]

        allRows.sort(compareFunction(columnIndex, isAscending, locale))

        allRows.forEach((tr) => {
          Array.from(tr.children).forEach(td =>
            td.removeAttribute('data-sort-active'),
          )
          if (tr.children[columnIndex]) {
            tr.children[columnIndex].setAttribute('data-sort-active', 'true')
          }
          tbody.appendChild(tr)
        })

        // is handled via computed context, not DOM write)
        prop('onSortChange')?.({ columnIndex, direction: newDirection })
      },
    },

    effects: {
      // If a default sorted column is set, trigger initial sort to reorder DOM rows.
      // toggle logic — the consumer passes the DESIRED direction, avoiding the
      // aria-sort).
      initSort({ context, send }) {
        const index = context.get('sortedColumnIndex')
        if (index == null)
          return
        const direction = context.get('sortDirection')
        if (!direction)
          return
        send({ type: 'SORT', columnIndex: index, direction })
      },
    },
  },
})
