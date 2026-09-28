import { Table } from '@uswds-tailwind/react'

const documents = [
  { title: 'Declaration of Independence', description: 'Statement declaring independence from the British Empire.', year: '1776' },
  { title: 'Bill of Rights', description: 'The first ten amendments of the U.S. Constitution.', year: '1791' },
  { title: 'Declaration of Sentiments', description: 'A declaration of the rights of American women.', year: '1848' },
  { title: 'Emancipation Proclamation', description: 'An executive order granting freedom to enslaved people in designated states.', year: '1863' },
]

export default function TableStickyHeaderDemo() {
  return (
    <Table.ScrollArea className="h-64 overflow-y-auto">
      <Table.Root>
        <Table.Caption>Historic documents with a sticky header</Table.Caption>
        <Table.Header sticky>
          <Table.Row>
            <Table.ColumnHeader>Document title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Year</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[...documents, ...documents].map((document, index) => (
            <Table.Row key={index}>
              <Table.ColumnHeader scope="row" className="font-normal">{document.title}</Table.ColumnHeader>
              <Table.Cell>{document.description}</Table.Cell>
              <Table.Cell>{document.year}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
