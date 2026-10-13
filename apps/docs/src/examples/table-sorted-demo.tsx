import type { ColumnDef } from '@tanstack/react-table'
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Table } from '@uswds-tailwind/react'

interface Agency {
  name: string
  employees: number
  lastUpdated: string
}

const agencies: Agency[] = [
  { name: 'National Park Service', employees: 20248, lastUpdated: '2025-06-12' },
  { name: 'Census Bureau', employees: 10632, lastUpdated: '2025-03-28' },
  { name: 'National Archives', employees: 2915, lastUpdated: '2025-08-04' },
  { name: 'Smithsonian Institution', employees: 6547, lastUpdated: '2025-01-17' },
]

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { text: sortFn_text, basic: sortFn_basic },
})

const columns: ColumnDef<typeof features, Agency>[] = [
  { accessorKey: 'name', header: 'Agency', sortFn: 'text' },
  { accessorKey: 'employees', header: 'Employees', sortFn: 'basic' },
  { accessorKey: 'lastUpdated', header: 'Last updated', sortFn: 'basic' },
]

export default function TableSortedDemo() {
  const dataTable = useTable({ features, columns, data: agencies })
  const sorting = dataTable.state.sorting[0]
  const sortColumn = sorting
    ? ({ name: 0, employees: 1, lastUpdated: 2 } as Record<string, number>)[sorting.id] ?? null
    : null

  return (
    <Table.Root
      captionText="Federal agency employees"
      columnNames={{ 0: 'Agency', 1: 'Employees', 2: 'Last updated' }}
      sortDescriptor={sorting && sortColumn !== null
        ? { column: sortColumn, direction: sorting.desc ? 'descending' : 'ascending' }
        : null}
      onSortChange={({ sortDescriptor }) => {
        dataTable.setSorting(sortDescriptor === null
          ? []
          : [{ id: sortDescriptor.column === 0 ? 'name' : sortDescriptor.column === 1 ? 'employees' : 'lastUpdated', desc: sortDescriptor.direction === 'descending' }])
      }}
    >
      <Table.Caption>Federal agency employees</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader columnIndex={0} sortable>Agency</Table.ColumnHeader>
          <Table.ColumnHeader columnIndex={1} sortable>Employees</Table.ColumnHeader>
          <Table.ColumnHeader columnIndex={2} sortable>Last updated</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {dataTable.getRowModel().rows.map(row => (
          <Table.Row key={row.id}>
            <Table.ColumnHeader scope="row">{row.original.name}</Table.ColumnHeader>
            <Table.Cell columnIndex={1}>{row.original.employees.toLocaleString()}</Table.Cell>
            <Table.Cell columnIndex={2}>{dateFormatter.format(new Date(`${row.original.lastUpdated}T00:00:00Z`))}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
