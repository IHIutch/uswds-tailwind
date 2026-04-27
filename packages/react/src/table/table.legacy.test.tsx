import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Table } from './table'

// Behavioral parity tests mirroring e2e/table/table.test.ts.
// Row reordering itself is consumer-driven (via onSortChange) — the machine
// exposes sort state and announcements; the consumer wires actual data sorting.
// These tests cover the attributes/affordances the machine provides.

function renderTable() {
  const columnNames = { 0: 'Alphabetical', 1: 'Numeric', 2: 'Unsortable' }
  return render(
    <Table.Root captionText="Sortable example" columnNames={columnNames}>
      <Table.Caption>Sortable example</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader columnIndex={0} sortable>Alphabetical</Table.ColumnHeader>
          <Table.ColumnHeader columnIndex={1} sortable>Numeric</Table.ColumnHeader>
          <Table.ColumnHeader>Unsortable</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell columnIndex={0}>Z</Table.Cell>
          <Table.Cell columnIndex={1}>2</Table.Cell>
          <Table.Cell>Row 1</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell columnIndex={0}>A</Table.Cell>
          <Table.Cell columnIndex={1}>4</Table.Cell>
          <Table.Cell>Row 2</Table.Cell>
        </Table.Row>
      </Table.Body>
      {/* Table.Root already renders an AnnouncementRegion internally */}
    </Table.Root>,
  )
}

it('sortable column header has data-sortable and aria-label', async () => {
  const screen = await renderTable()
  const sortButton = screen.getByRole('button', { name: /Alphabetical/ })
  const header = sortButton.element().closest('th')!

  expect(header.hasAttribute('data-sortable')).toBe(true)
  expect(header.getAttribute('aria-label')).toMatch(/sortable column/)
})

it('non-sortable column header has no sort button', async () => {
  const screen = await renderTable()
  // "Unsortable" column shows text but no button
  await expect.element(screen.getByText('Unsortable')).toBeInTheDocument()
  // Only two sort buttons (for the two sortable columns)
  const buttons = screen.getByRole('button').elements()
  expect(buttons.length).toBe(2)
})

it('clicking sort button toggles aria-sort on header', async () => {
  const screen = await renderTable()
  const sortButton = screen.getByRole('button', { name: /Alphabetical/ })
  const header = sortButton.element().closest('th')!

  expect(header.hasAttribute('aria-sort')).toBe(false)

  await userEvent.click(sortButton)
  expect(header.getAttribute('aria-sort')).toBe('ascending')

  await userEvent.click(sortButton)
  expect(header.getAttribute('aria-sort')).toBe('descending')
})

it('sort button title describes the NEXT sort direction', async () => {
  const screen = await renderTable()
  const sortButton = screen.getByRole('button', { name: /Alphabetical/ })

  // Before any sort: next click will sort ascending.
  expect(sortButton.element().getAttribute('title')).toMatch(/ascending/)

  await userEvent.click(sortButton)
  // Now sorted ascending; next click will sort descending.
  expect(sortButton.element().getAttribute('title')).toMatch(/descending/)
})

it('cells in the sorted column get data-sort-active', async () => {
  const screen = await renderTable()
  const sortButton = screen.getByRole('button', { name: /Alphabetical/ })

  await userEvent.click(sortButton)

  // SUGGESTION (review): `[data-scope="table"][data-part="cell"]` pins to
  // our Zag anatomy; a native `screen.getByRole('cell')` (or a `tbody td`
  // DOM query) would survive an anatomy rename with the same signal.
  // Find cells in column 0 (Alphabetical)
  const cells = document.querySelectorAll('[data-scope="table"][data-part="cell"]')
  const column0Cells = Array.from(cells).filter(
    c => c.previousElementSibling === null,
  )
  column0Cells.forEach((cell) => {
    expect(cell.hasAttribute('data-sort-active')).toBe(true)
  })
})

it('announcement region exists with role=status and aria-live=polite', async () => {
  const screen = await renderTable()
  const region = screen.getByRole('status')
  await expect.element(region).toHaveAttribute('aria-live', 'polite')
})

it('announcement region fills with text after sorting', async () => {
  const screen = await renderTable()
  const sortButton = screen.getByRole('button', { name: /Alphabetical/ })

  await userEvent.click(sortButton)

  const region = screen.getByRole('status')
  // After sort, announcement is non-empty
  await expect.element(region).not.toBeEmptyDOMElement()
})

it('sort direction cycles ascending → descending → ascending on repeated clicks', async () => {
  const screen = await renderTable()
  const sortButton = screen.getByRole('button', { name: /Alphabetical/ })
  const header = sortButton.element().closest('th')!

  await userEvent.click(sortButton)
  expect(header.getAttribute('aria-sort')).toBe('ascending')

  await userEvent.click(sortButton)
  expect(header.getAttribute('aria-sort')).toBe('descending')

  await userEvent.click(sortButton)
  expect(header.getAttribute('aria-sort')).toBe('ascending')
})
