import type { VariantProps } from 'cva'
import * as table from '@uswds-tailwind/table-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cva, cx } from '../cva.config'

const tableColumnHeaderVariants = cva({
  base: 'text-left border-b',
  variants: {
    variant: {
      bordered: 'bg-gray-10 border-r border-black',
      striped: 'bg-gray-10 border-r border-black',
      borderless: 'bg-white border-black',
    },
    compact: {
      true: 'px-3 py-1',
      false: 'px-4 py-2',
    },
  },
  defaultVariants: {
    variant: 'bordered',
    compact: false,
  },
})

const tableBodyCellVariants = cva({
  base: 'text-left',
  variants: {
    variant: {
      bordered: 'bg-white border not-first:border-l-0 border-black border-t-0',
      striped: 'odd:bg-gray-5 even:bg-white border not-first:border-l-0 border-black border-t-0',
      borderless: 'bg-white border-y border-black border-t-0',
    },
    compact: {
      true: 'px-3 py-1',
      false: 'px-4 py-2',
    },
    stacked: {
      true: '@max-tablet:block @max-tablet:border-0 @max-tablet:before:content-[attr(data-label)] @max-tablet:before:font-bold @max-tablet:before:block',
    },
  },
  defaultVariants: {
    variant: 'bordered',
    compact: false,
  },
})

type TableVariant = NonNullable<VariantProps<typeof tableColumnHeaderVariants>['variant']>

interface TableContextProps {
  api: table.Api
  variant: TableVariant
  compact: boolean
  stacked: boolean
}

const TableContext = React.createContext<TableContextProps | null>(null)

function useTableContext() {
  const context = React.useContext(TableContext)
  if (!context) {
    throw new Error('Table components must be used within a Table.Root')
  }
  return context
}

// Root

export type TableRootProps = React.ComponentPropsWithoutRef<'table'> & {
  variant?: TableVariant
  compact?: boolean
  stacked?: boolean
  captionText?: table.Props['captionText']
  columnNames?: table.Props['columnNames']
  defaultSortedColumnIndex?: table.Props['defaultSortedColumnIndex']
  defaultSortDirection?: table.Props['defaultSortDirection']
  onSortChange?: table.Props['onSortChange']
}

function TableRoot({
  variant = 'bordered',
  compact = false,
  stacked = false,
  captionText,
  columnNames,
  defaultSortedColumnIndex,
  defaultSortDirection,
  onSortChange,
  className,
  ...props
}: TableRootProps) {
  const service = useMachine(table.machine, {
    id: React.useId(),
    captionText,
    columnNames,
    defaultSortedColumnIndex,
    defaultSortDirection,
    onSortChange,
  })
  const api = table.connect(service, normalizeProps)
  const rootProps = mergeProps(api.getRootProps(), props)

  return (
    <TableContext.Provider value={{ api, variant, compact, stacked }}>
      <div className="@container">
        <table
          {...rootProps}
          className={cx('border-spacing-0 border-t border-l', className)}
        />
        <TableSrStatus />
      </div>
    </TableContext.Provider>
  )
}

// Caption

export type TableCaptionProps = React.ComponentPropsWithoutRef<'caption'>

function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      {...props}
      className={cx('mb-3 text-left font-bold', className)}
    />
  )
}

// Header

export type TableHeaderProps = React.ComponentPropsWithoutRef<'thead'> & {
  sticky?: boolean
}

function TableHeader({ sticky, className, ...props }: TableHeaderProps) {
  const { stacked } = useTableContext()
  return (
    <thead
      {...props}
      className={cx(
        sticky && 'sticky top-0',
        stacked && '@max-tablet:hidden',
        className,
      )}
    />
  )
}

// Body

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>

function TableBody({ className, ...props }: TableBodyProps) {
  const { stacked } = useTableContext()
  return (
    <tbody
      {...props}
      className={cx(
        stacked && '[&>tr]:@max-tablet:block [&>tr]:@max-tablet:border-b [&>tr]:@max-tablet:border-black [&>tr]:@max-tablet:py-2',
        className,
      )}
    />
  )
}

// Footer

export type TableFooterProps = React.ComponentPropsWithoutRef<'tfoot'>

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      {...props}
      className={cx(className)}
    />
  )
}

// Row

export type TableRowProps = React.ComponentPropsWithoutRef<'tr'>

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      {...props}
      className={cx(className)}
    />
  )
}

// ColumnHeader

export type TableColumnHeaderProps = React.ComponentPropsWithoutRef<'th'> & {
  columnIndex?: number
  sortable?: boolean
}

function TableColumnHeader({ scope = 'col', columnIndex, sortable, className, children, ...props }: TableColumnHeaderProps) {
  const { api, variant, compact } = useTableContext()
  const headerProps = sortable && columnIndex !== undefined ? api.getHeaderProps({ index: columnIndex }) : {}
  return (
    <th
      scope={scope}
      {...headerProps}
      {...props}
      className={cx(tableColumnHeaderVariants({ variant, compact }), className)}
    >
      {sortable && columnIndex !== undefined
        ? <TableSortButton columnIndex={columnIndex}>{children}</TableSortButton>
        : children}
    </th>
  )
}

// SortButton (internal)

type TableSortButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  columnIndex: number
}

function TableSortButton({ columnIndex, className, ...props }: TableSortButtonProps) {
  const { api } = useTableContext()
  const mergedProps = mergeProps(api.getSortButtonProps({ index: columnIndex }), props)
  return (
    <button
      {...mergedProps}
      className={cx('inline-flex items-center gap-1 cursor-pointer', className)}
    />
  )
}

// Cell

export type TableCellProps = React.ComponentPropsWithoutRef<'td'> & {
  columnIndex?: number
}

function TableCell({ columnIndex, className, ...props }: TableCellProps) {
  const { api, variant, compact, stacked } = useTableContext()
  const cellProps = columnIndex !== undefined ? api.getCellProps({ columnIndex }) : {}
  return (
    <td
      {...cellProps}
      {...props}
      className={cx(tableBodyCellVariants({ variant, compact, stacked }), className)}
    />
  )
}

// ScrollArea

export type TableScrollAreaProps = React.ComponentPropsWithoutRef<'div'>

function TableScrollArea({ className, ...props }: TableScrollAreaProps) {
  return (
    <div
      tabIndex={0}
      {...props}
      className={cx('overflow-y-hidden max-w-full focus:outline-4 focus:outline-blue-40v focus:outline-offset-0', className)}
    />
  )
}

// SrStatus (SR-only live region for sort announcements)

type TableSrStatusProps = React.ComponentPropsWithoutRef<'div'>

function TableSrStatus({ className, ...props }: TableSrStatusProps) {
  const { api } = useTableContext()
  const mergedProps = mergeProps(api.getSrStatusProps(), props)
  return (
    <div
      {...mergedProps}
      className={cx(className)}
    >
      {api.announcement}
    </div>
  )
}

// Display names

TableRoot.displayName = 'Table.Root'
TableCaption.displayName = 'Table.Caption'
TableHeader.displayName = 'Table.Header'
TableBody.displayName = 'Table.Body'
TableFooter.displayName = 'Table.Footer'
TableRow.displayName = 'Table.Row'
TableColumnHeader.displayName = 'Table.ColumnHeader'
TableCell.displayName = 'Table.Cell'
TableScrollArea.displayName = 'Table.ScrollArea'
TableSrStatus.displayName = 'Table.SrStatus'

export const Table = {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  ColumnHeader: TableColumnHeader,
  Cell: TableCell,
  ScrollArea: TableScrollArea,
  SrStatus: TableSrStatus,
}
