import preview from '../../.storybook/preview'
import { Table } from './table'

const meta = preview.meta({
  title: 'Components/Table',
  component: Table.Root,
  argTypes: {
    variant: {
      control: 'select',
      options: ['bordered', 'striped', 'borderless'],
      table: {
        defaultValue: { summary: 'bordered' },
      },
    },
    compact: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    stacked: {
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
})

const documents = [
  { title: 'Declaration of Independence', description: 'Statement adopted by the Continental Congress declaring independence from the British Empire.', year: '1776' },
  { title: 'Bill of Rights', description: 'The first ten amendments of the U.S. Constitution guaranteeing rights and freedoms.', year: '1791' },
  { title: 'Declaration of Sentiments', description: 'A document written during the Seneca Falls Convention outlining the rights that American women should be entitled to as citizens.', year: '1848' },
  { title: 'Emancipation Proclamation', description: 'An executive order granting freedom to slaves in designated southern states.', year: '1863' },
]

export const Default = meta.story({
  args: {
    variant: 'bordered',
    compact: false,
    stacked: false,
  },
  render: ({ variant, compact, stacked }) => (
    <Table.Root variant={variant} compact={compact} stacked={stacked}>
      <Table.Caption>Bordered table</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Document title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Year</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map(doc => (
          <Table.Row key={doc.title}>
            <Table.ColumnHeader scope="row" className="font-normal">{doc.title}</Table.ColumnHeader>
            <Table.Cell>{doc.description}</Table.Cell>
            <Table.Cell>{doc.year}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
})

export const Striped = meta.story({
  render: () => (
    <Table.Root variant="striped">
      <Table.Caption>Bordered table with horizontal stripes</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Document title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Year</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map(doc => (
          <Table.Row key={doc.title}>
            <Table.ColumnHeader scope="row" className="font-normal">{doc.title}</Table.ColumnHeader>
            <Table.Cell>{doc.description}</Table.Cell>
            <Table.Cell>{doc.year}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
})

export const Borderless = meta.story({
  render: () => (
    <Table.Root variant="borderless">
      <Table.Caption>Borderless table: A borderless table can be useful when you want the information to feel more a part of the text it accompanies and extends.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Document title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Year</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map(doc => (
          <Table.Row key={doc.title}>
            <Table.ColumnHeader scope="row" className="font-normal">{doc.title}</Table.ColumnHeader>
            <Table.Cell>{doc.description}</Table.Cell>
            <Table.Cell>{doc.year}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
})

export const Compact = meta.story({
  render: () => (
    <Table.Root compact>
      <Table.Caption>Compact bordered table</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Document title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Year</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map(doc => (
          <Table.Row key={doc.title}>
            <Table.ColumnHeader scope="row" className="font-normal">{doc.title}</Table.ColumnHeader>
            <Table.Cell>{doc.description}</Table.Cell>
            <Table.Cell>{doc.year}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
})

export const Scrollable = meta.story({
  render: () => (
    <Table.ScrollArea>
      <Table.Root>
        <Table.Caption>Bordered table</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Document title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Year</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {documents.map(doc => (
            <Table.Row key={doc.title}>
              <Table.ColumnHeader scope="row" className="font-normal">{doc.title}</Table.ColumnHeader>
              <Table.Cell className="whitespace-nowrap">{doc.description}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">{doc.year}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  ),
})

export const StickyHeader = meta.story({
  render: () => (
    <Table.ScrollArea className="h-96 overflow-y-auto">
      <Table.Root>
        <Table.Caption>Sticky header table</Table.Caption>
        <Table.Header sticky>
          <Table.Row>
            <Table.ColumnHeader>Document title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Year</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[...documents, ...documents, ...documents].map((doc, i) => (
            <Table.Row key={i}>
              <Table.ColumnHeader scope="row" className="font-normal">{doc.title}</Table.ColumnHeader>
              <Table.Cell>{doc.description}</Table.Cell>
              <Table.Cell>{doc.year}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  ),
})

export const StickyColumn = meta.story({
  render: () => (
    <Table.ScrollArea>
      <Table.Root>
        <Table.Caption>Bordered table</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader className="sticky left-0">Document title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Year</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {documents.map(doc => (
            <Table.Row key={doc.title}>
              <Table.ColumnHeader scope="row" className="font-normal sticky left-0">{doc.title}</Table.ColumnHeader>
              <Table.Cell className="whitespace-nowrap">{doc.description}</Table.Cell>
              <Table.Cell className="whitespace-nowrap">{doc.year}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  ),
})

export const Stacked = meta.story({
  render: () => (
    <Table.Root variant="borderless" stacked>
      <Table.Caption>This is a stacked table (when on a mobile-width screen)</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Document title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Year</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {documents.map(doc => (
          <Table.Row key={doc.title}>
            <Table.ColumnHeader scope="row" className="font-normal" data-label="Document title">{doc.title}</Table.ColumnHeader>
            <Table.Cell data-label="Description">{doc.description}</Table.Cell>
            <Table.Cell data-label="Year">{doc.year}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
})
