import type { VariantProps } from 'cva'
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
}

function TableRoot({ variant = 'bordered', compact = false, stacked = false, className, ...props }: TableRootProps) {
  return (
    <TableContext.Provider value={{ variant, compact, stacked }}>
      <div className="@container">
        <table
          {...props}
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

export type TableColumnHeaderProps = React.ComponentPropsWithoutRef<'th'>

function TableColumnHeader({ scope = 'col', className, ...props }: TableColumnHeaderProps) {
  const { variant, compact } = useTableContext()
  return (
    <th
      scope={scope}
      {...props}
      className={cx(tableColumnHeaderVariants({ variant, compact }), className)}
    />
  )
}

// Cell

export type TableCellProps = React.ComponentPropsWithoutRef<'td'>

function TableCell({ className, ...props }: TableCellProps) {
  const { variant, compact, stacked } = useTableContext()
  return (
    <td
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

// SrStatus

type TableSrStatusProps = React.ComponentPropsWithoutRef<'div'>

function TableSrStatus({ className, ...props }: TableSrStatusProps) {
  return (
    <div
      aria-live="polite"
      {...props}
      className={cx('sr-only', className)}
    />
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
}
