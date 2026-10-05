import * as React from 'react'
import { Table } from './table'

interface Person {
  name: string
  age: number
}

type ColumnId = keyof Person
interface ConsumerSort {
  column: ColumnId
  descending: boolean
}

const data: Person[] = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 40 },
  { name: 'Bob', age: 20 },
]
const columnLabels: Record<ColumnId, string> = { name: 'Name', age: 'Age' }

// The consumer owns sorting and stable column IDs. Table receives the accepted
// state mapped to visible column indexes and reports user sort requests.
export function ControlledTableExample() {
  const [sorting, setSorting] = React.useState<ConsumerSort | null>(null)
  const [columnOrder, setColumnOrder] = React.useState<ColumnId[]>(['name', 'age'])
  const [showAge, setShowAge] = React.useState(true)
  const visibleColumns = columnOrder.filter(column => showAge || column !== 'age')
  const columnNames = Object.fromEntries(visibleColumns.map((column, index) => [index, columnLabels[column]]))
  const sortedColumnIndex = sorting ? visibleColumns.indexOf(sorting.column) : -1
  const sortDescriptor = sorting && sortedColumnIndex >= 0
    ? { column: sortedColumnIndex, direction: sorting.descending ? 'descending' as const : 'ascending' as const }
    : null
  const rows = sorting
    ? [...data].sort((a, b) => {
        const result = sorting.column === 'age' ? a.age - b.age : a.name.localeCompare(b.name)
        return sorting.descending ? -result : result
      })
    : data

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button type="button" onClick={() => setSorting(null)}>Clear sorting</button>
        <button type="button" onClick={() => setColumnOrder(order => [...order].reverse())}>Reverse columns</button>
        <button type="button" onClick={() => setShowAge(visible => !visible)}>Toggle age column</button>
      </div>
      <Table.Root
        captionText="People"
        columnNames={columnNames}
        sortDescriptor={sortDescriptor}
        onSortChange={({ sortDescriptor }) => {
          setSorting(sortDescriptor
            ? { column: visibleColumns[sortDescriptor.column]!, descending: sortDescriptor.direction === 'descending' }
            : null)
        }}
      >
        <Table.Caption>People</Table.Caption>
        <Table.Header>
          <Table.Row>
            {visibleColumns.map((column, columnIndex) => (
              <Table.ColumnHeader key={column} columnIndex={columnIndex} sortable>
                <span>{columnLabels[column]}</span>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(row => (
            <Table.Row key={row.name}>
              {visibleColumns.map((column, columnIndex) => (
                <Table.Cell key={column} columnIndex={columnIndex}>{row[column]}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
