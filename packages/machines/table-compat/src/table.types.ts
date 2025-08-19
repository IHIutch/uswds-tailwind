import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  table: string
  caption: string
  thead: string
  tbody: string
  tfoot: string
}>

export type SortDirection = 'asc' | 'desc' | 'none'

export type SortType = 'text' | 'number' | 'date'

export interface ColumnConfig {
  /** The index of the column (0-based) */
  index: number
  /** The type of data in the column for sorting */
  type?: SortType
  /** Whether this column is sortable */
  sortable?: boolean
  /** Custom sort function for this column */
  sortFn?: (a: string, b: string) => number
  /** Attribute name to read sort values from (defaults to text content) */
  sortAttribute?: string
}

export interface SortableTableProps extends CommonProperties {
  // No required props for the simplified version
}

export interface SortableTableSchema {
  props: SortableTableProps
  context: {
    /** Currently sorted column index (-1 if none) */
    sortedColumn: number
    /** Current sort direction */
    sortDirection: SortDirection
  }
  state: 'idle'
  action: 'sort'
  event: {
    type: 'SORT'
    columnIndex: number
  }
}

export type SortableTableService = Service<SortableTableSchema>
export type SortableTableMachine = Machine<SortableTableSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface SortableTableApi<T extends PropTypes = PropTypes> {
  /**
   * The currently sorted column index (-1 if none)
   */
  sortedColumn: number

  /**
   * The current sort direction
   */
  sortDirection: SortDirection

  /**
   * Sort the table by a specific column
   */
  sortByColumn: (columnIndex: number) => void

  /**
   * Get the sort direction for a specific column
   */
  getColumnSortDirection: (columnIndex: number) => SortDirection

  /**
   * Check if a column is currently sorted
   */
  isColumnSorted: (columnIndex: number) => boolean

  getRootProps: () => T['element']
  getHeaderCellProps: (columnIndex: number) => T['element']
  getSortButtonProps: (columnIndex: number) => T['button']
  getBodyCellProps: (columnIndex: number) => T['element']
}
