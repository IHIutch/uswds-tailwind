import type { Machine, Service } from '@zag-js/core'
import type {
  CommonProperties,
  PropTypes,
} from '@zag-js/types'

export type SortDirection = 'asc' | 'desc'

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

export type SetSortDetails
  = | { columnIndex: number, direction: SortDirection }
    | { columnIndex: null, direction?: undefined }

export interface SortChangeDetails {
  columnIndex: number | null
  direction: SortDirection | null
}

export type ElementIds = Partial<{
  root: string
  header: (headerId: string | number) => string
  sortButton: (headerId: string | number) => string
  srStatus: string
}>

export interface TableProps extends CommonProperties {
  ids?: ElementIds | undefined
  onSortChange?: ((details: SortChangeDetails) => void) | undefined
  /** Supply both sort props for controlled state; clicks then request changes via onSortChange. */
  sortColumn?: number | null | undefined
  sortDirection?: SortDirection | null | undefined
  defaultSortColumn?: number | undefined
  defaultSortDirection?: SortDirection | undefined
  captionText?: string | undefined
  columnNames?: Record<number, string> | undefined
}

export interface TableSchema {
  props: TableProps
  state: 'idle'
  context: {
    sortColumn: number | null
    sortDirection: SortDirection | null
  }
  computed: {
    announcement: string
  }
  guard: never
  effect: never
  action: 'toggleSort' | 'setSort'
  event:
    | {
      type: 'SORT.TOGGLE'
      columnIndex: number
    }
    | ({ type: 'SORT.SET' } & SetSortDetails)
}

export type TableService = Service<TableSchema>
export type TableMachine = Machine<TableSchema>

export interface TableApi<T extends PropTypes = PropTypes> {
  sortColumn: number | null
  sortDirection: SortDirection | null
  /** Render this text in the element returned by getSrStatusProps. */
  announcement: string

  setSort: (details: SetSortDetails) => void

  getRootProps: () => T['element']
  getTableProps: () => T['element']
  getHeaderProps: (props: HeaderProps) => T['element']
  getSortButtonProps: (props: HeaderProps) => T['button']
  getSrStatusProps: () => T['element']
  getCellProps: (props: CellProps) => T['element']
}
