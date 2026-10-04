import type { Machine, Service } from '@zag-js/core'
import type {
  CommonProperties,
  PropTypes,
} from '@zag-js/types'

export type SortDirection = 'ascending' | 'descending'

export interface HeaderProps {
  /** Index in the header row, including row headers. */
  columnIndex: number
  /** Match the text rendered in the header. */
  headerName: string
  /** Distinguishes headers sharing a column index in a multirow head. */
  headerId?: string
}

export interface CellProps {
  columnIndex: number
}

export interface SortDescriptor {
  column: number
  direction: SortDirection
}

export interface SortChangeDetails {
  sortDescriptor: SortDescriptor | null
}

export type ElementIds = Partial<{
  root: string
  header: (headerId: string | number) => string
  sortTrigger: (headerId: string | number) => string
  srStatus: string
}>

export interface TableProps extends CommonProperties {
  ids?: ElementIds | undefined
  onSortChange?: ((details: SortChangeDetails) => void) | undefined
  /** Controlled sort state. Use null for an unsorted table. */
  sortDescriptor?: SortDescriptor | null | undefined
  defaultSortDescriptor?: SortDescriptor | null | undefined
  captionText?: string | undefined
  columnNames?: Record<number, string> | undefined
}

export interface TableSchema {
  props: TableProps
  state: 'idle'
  context: {
    sortDescriptor: SortDescriptor | null
  }
  computed: {
    announcement: string
  }
  guard: never
  effect: never
  action: 'setSortDescriptor'
  event: {
    type: 'SORT'
    columnIndex: number | null
    direction?: SortDirection | undefined
  }
}

export type TableService = Service<TableSchema>
export type TableMachine = Machine<TableSchema>

export interface TableApi<T extends PropTypes = PropTypes> {
  sortDescriptor: SortDescriptor | null
  /** Render this text in the element returned by getSrStatusProps. */
  announcement: string

  setSortDescriptor: (sortDescriptor: SortDescriptor | null) => void

  getRootProps: () => T['element']
  getTableProps: () => T['element']
  getHeaderProps: (props: HeaderProps) => T['element']
  getSortTriggerProps: (props: HeaderProps) => T['button']
  getSrStatusProps: () => T['element']
  getCellProps: (props: CellProps) => T['element']
}
