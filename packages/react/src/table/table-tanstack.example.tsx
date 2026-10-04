import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import * as React from 'react'
import { Table } from './table'

interface Person {
  name: string
  age: number
}

const data: Person[] = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 40 },
  { name: 'Bob', age: 20 },
]
const columnLabels: Record<string, string> = { name: 'Name', age: 'Age' }
const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: () => <span>{columnLabels.name}</span> },
  { accessorKey: 'age', header: () => <span>{columnLabels.age}</span> },
]

// TanStack v8 owns the sorting state and row model. This adapter translates
// stable column IDs to the rendered indexes expected by the USWDS table.
export function TanStackTableExample() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Match the USWDS table's single-column ascending/descending cycle.
    enableMultiSort: false,
    enableSortingRemoval: false,
    sortDescFirst: false,
  })
  const visibleColumns = table.getVisibleLeafColumns()
  const columnNames = Object.fromEntries(visibleColumns.map((column, index) => [index, columnLabels[column.id]!]))
  const activeSort = sorting[0]
  const sortedColumnIndex = visibleColumns.findIndex(column => column.id === activeSort?.id)
  const sortDescriptor = activeSort && sortedColumnIndex >= 0
    ? { column: sortedColumnIndex, direction: activeSort.desc ? 'descending' as const : 'ascending' as const }
    : null

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button type="button" onClick={() => table.setSorting([])}>Clear sorting</button>
        <button type="button" onClick={() => table.setColumnOrder(visibleColumns.map(column => column.id).reverse())}>Reverse columns</button>
        <button type="button" onClick={() => table.getColumn('age')!.toggleVisibility()}>Toggle age column</button>
      </div>
      <Table.Root
        captionText="People"
        columnNames={columnNames}
        sortDescriptor={sortDescriptor}
        onSortChange={({ sortDescriptor }) => {
          table.setSorting(sortDescriptor
            ? [{ id: visibleColumns[sortDescriptor.column]!.id, desc: sortDescriptor.direction === 'descending' }]
            : [])
        }}
      >
        <Table.Caption>People</Table.Caption>
        <Table.Header>
          {table.getHeaderGroups().map(group => (
            <Table.Row key={group.id}>
              {group.headers.map(header => (
                <Table.ColumnHeader key={header.id} columnIndex={visibleColumns.indexOf(header.column)} sortable={header.column.getCanSort()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map(row => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell, columnIndex) => (
                <Table.Cell key={cell.id} columnIndex={columnIndex}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
