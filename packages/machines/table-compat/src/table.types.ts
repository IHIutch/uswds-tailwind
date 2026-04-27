import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Sort direction
 * ----------------------------------------------------------------------------- */

export type SortDirection = 'ascending' | 'descending'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface SortChangeDetails {
  columnIndex: number
  direction: SortDirection
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  header: (index: number) => string
  sortButton: (index: number) => string
  srStatus: string
}>

/* -----------------------------------------------------------------------------
 * Machine props
 * ----------------------------------------------------------------------------- */

export interface TableProps extends CommonProperties {
  ids?: ElementIds | undefined
  captionText?: string | undefined
  columnNames?: Record<number, string> | undefined
  defaultSortedColumnIndex?: number | undefined
  defaultSortDirection?: SortDirection | undefined
  onSortChange?: ((details: SortChangeDetails) => void) | undefined
}

type PropsWithDefault = 'defaultSortDirection'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface TableSchema {
  props: RequiredBy<TableProps, PropsWithDefault>
  state: 'idle' | 'focused'
  context: {
    sortedColumnIndex: number | null
    sortDirection: SortDirection | null
  }
  computed: {
    isSorted: boolean
    announcement: string
  }
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type TableService = Service<TableSchema>
export type TableMachine = Machine<TableSchema>

/* -----------------------------------------------------------------------------
 * Header props for connect
 * ----------------------------------------------------------------------------- */

export interface HeaderProps {
  index: number
}

/* -----------------------------------------------------------------------------
 * Cell props for connect
 * ----------------------------------------------------------------------------- */

export interface CellProps {
  columnIndex: number
}

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface TableApi<T extends PropTypes = PropTypes> {
  focused: boolean
  isSorted: boolean
  sortedColumnIndex: number | null
  sortDirection: SortDirection | null
  announcement: string

  sort: (columnIndex: number, direction?: SortDirection) => void

  getRootProps: () => T['element']
  getHeaderProps: (props: HeaderProps) => T['element']
  getSortButtonProps: (props: HeaderProps) => T['button']
  getCellProps: (props: CellProps) => T['element']
  getSrStatusProps: () => T['element']
}
