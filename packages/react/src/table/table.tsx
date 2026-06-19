import type { VariantProps } from '../tv.config'
import * as table from '@uswds-tailwind/table-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cn, tv } from '../tv.config'

const tableVariants = tv({
  slots: {
    columnHeader: 'text-left border-b',
    bodyCell: 'text-left',
  },
  variants: {
    variant: {
      bordered: {
        columnHeader: 'bg-gray-10 border-r border-black',
        bodyCell: 'bg-white border not-first:border-l-0 border-black border-t-0',
      },
      striped: {
        columnHeader: 'bg-gray-10 border-r border-black',
        bodyCell: 'odd:bg-gray-5 even:bg-white border not-first:border-l-0 border-black border-t-0',
      },
      borderless: {
        columnHeader: 'bg-white border-black',
        bodyCell: 'bg-white border-y border-black border-t-0',
      },
    },
    compact: {
      true: { columnHeader: 'px-3 py-1', bodyCell: 'px-3 py-1' },
      false: { columnHeader: 'px-4 py-2', bodyCell: 'px-4 py-2' },
    },
    stacked: {
      true: { bodyCell: '@max-tablet:block @max-tablet:border-0 @max-tablet:before:content-[attr(data-label)] @max-tablet:before:font-bold @max-tablet:before:block' },
    },
  },
  defaultVariants: {
    variant: 'bordered',
    compact: false,
  },
})

type TableVariant = NonNullable<VariantProps<typeof tableVariants>['variant']>

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

const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  ({
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
  }, forwardedRef) => {
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
            className={cn('border-spacing-0 border-t border-l', className)}
            ref={forwardedRef}
          />
          <TableSrStatus />
        </div>
      </TableContext.Provider>
    )
  },
)

// Caption

export type TableCaptionProps = React.ComponentPropsWithoutRef<'caption'>

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <caption
        {...props}
        className={cn('mb-3 text-left font-bold', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Header

export type TableHeaderProps = React.ComponentPropsWithoutRef<'thead'> & {
  sticky?: boolean
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ sticky, className, ...props }, forwardedRef) => {
    const { stacked } = useTableContext()
    return (
      <thead
        {...props}
        className={cn(
          sticky && 'sticky top-0',
          stacked && '@max-tablet:hidden',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Body

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, forwardedRef) => {
    const { stacked } = useTableContext()
    return (
      <tbody
        {...props}
        className={cn(
          stacked && '[&>tr]:@max-tablet:block [&>tr]:@max-tablet:border-b [&>tr]:@max-tablet:border-black [&>tr]:@max-tablet:py-2',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Footer

export type TableFooterProps = React.ComponentPropsWithoutRef<'tfoot'>

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <tfoot
        {...props}
        className={cn(className)}
        ref={forwardedRef}
      />
    )
  },
)

// Row

export type TableRowProps = React.ComponentPropsWithoutRef<'tr'>

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <tr
        {...props}
        className={cn(className)}
        ref={forwardedRef}
      />
    )
  },
)

// ColumnHeader

export type TableColumnHeaderProps = React.ComponentPropsWithoutRef<'th'> & {
  columnIndex?: number
  sortable?: boolean
}

const TableColumnHeader = React.forwardRef<HTMLTableCellElement, TableColumnHeaderProps>(
  ({ scope = 'col', columnIndex, sortable, className, children, ...props }, forwardedRef) => {
    const { api, variant, compact } = useTableContext()
    const { columnHeader } = tableVariants({ variant, compact })
    const headerProps = sortable && columnIndex !== undefined ? api.getHeaderProps({ index: columnIndex }) : {}
    return (
      <th
        scope={scope}
        {...headerProps}
        {...props}
        className={columnHeader({ className })}
        ref={forwardedRef}
      >
        {sortable && columnIndex !== undefined
          ? <TableSortButton columnIndex={columnIndex}>{children}</TableSortButton>
          : children}
      </th>
    )
  },
)

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
      className={cn('inline-flex items-center gap-1 cursor-pointer', className)}
    />
  )
}

// Cell

export type TableCellProps = React.ComponentPropsWithoutRef<'td'> & {
  columnIndex?: number
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ columnIndex, className, ...props }, forwardedRef) => {
    const { api, variant, compact, stacked } = useTableContext()
    const { bodyCell } = tableVariants({ variant, compact, stacked })
    const cellProps = columnIndex !== undefined ? api.getCellProps({ columnIndex }) : {}
    return (
      <td
        {...cellProps}
        {...props}
        className={bodyCell({ className })}
        ref={forwardedRef}
      />
    )
  },
)

// ScrollArea

export type TableScrollAreaProps = React.ComponentPropsWithoutRef<'div'>

const TableScrollArea = React.forwardRef<HTMLDivElement, TableScrollAreaProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        tabIndex={0}
        {...props}
        className={cn('overflow-y-hidden max-w-full focus:outline-4 focus:outline-blue-40v focus:outline-offset-0', className)}
        ref={forwardedRef}
      />
    )
  },
)

// SrStatus (SR-only live region for sort announcements)

type TableSrStatusProps = React.ComponentPropsWithoutRef<'div'>

function TableSrStatus({ className, ...props }: TableSrStatusProps) {
  const { api } = useTableContext()
  const mergedProps = mergeProps(api.getSrStatusProps(), props)
  return (
    <div
      {...mergedProps}
      className={cn(className)}
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
