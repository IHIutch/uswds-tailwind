import type { TableRootProps } from './table'
import { expect, it, vi } from 'vitest'
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
  const sortTrigger = screen.getByRole('button', { name: /Alphabetical/ })
  const header = sortTrigger.element().closest('th')!

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
  const sortTrigger = screen.getByRole('button', { name: /Alphabetical/ })
  const header = sortTrigger.element().closest('th')!

  expect(header.hasAttribute('aria-sort')).toBe(false)

  await userEvent.click(sortTrigger)
  expect(header.getAttribute('aria-sort')).toBe('ascending')

  await userEvent.click(sortTrigger)
  expect(header.getAttribute('aria-sort')).toBe('descending')
})

it('sort button title describes the NEXT sort direction', async () => {
  const screen = await renderTable()
  const sortTrigger = screen.getByRole('button', { name: /Alphabetical/ })

  // Before any sort: next click will sort ascending.
  expect(sortTrigger.element().getAttribute('title')).toMatch(/ascending/)

  await userEvent.click(sortTrigger)
  // Now sorted ascending; next click will sort descending.
  expect(sortTrigger.element().getAttribute('title')).toMatch(/descending/)
})

it('cells in the sorted column get data-sort-active', async () => {
  const screen = await renderTable()
  const sortTrigger = screen.getByRole('button', { name: /Alphabetical/ })

  await userEvent.click(sortTrigger)

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
  const root = region.element().closest('[data-scope="table"][data-part="root"]')
  expect(root?.querySelector('table[data-part="table"]')).not.toBeNull()
})

it('keeps the announcement region unchanged when unrelated content rerenders', async () => {
  const view = (caption: string) => (
    <Table.Root captionText="Sortable example">
      <Table.Caption>{caption}</Table.Caption>
    </Table.Root>
  )
  const screen = await render(view('Before'))
  const region = screen.container.querySelector('[data-part="sr-status"]') as HTMLElement
  const mutations: MutationRecord[] = []
  const observer = new MutationObserver(records => mutations.push(...records))
  observer.observe(region, { attributes: true, childList: true, characterData: true, subtree: true })

  try {
    await screen.rerender(view('After'))

    await expect.element(screen.getByText('After')).toBeVisible()
    expect(screen.container.querySelector('[data-part="sr-status"]')).toBe(region)
    expect(region.textContent).toBe('')
    expect([...mutations, ...observer.takeRecords()]).toEqual([])
  }
  finally {
    observer.disconnect()
  }
})

it('announcement region fills with text after sorting', async () => {
  const screen = await renderTable()
  const sortTrigger = screen.getByRole('button', { name: /Alphabetical/ })

  await userEvent.click(sortTrigger)

  const region = screen.getByRole('status')
  // After sort, announcement is non-empty
  await expect.element(region).not.toBeEmptyDOMElement()
})

it('sort direction cycles ascending → descending → ascending on repeated clicks', async () => {
  const screen = await renderTable()
  const sortTrigger = screen.getByRole('button', { name: /Alphabetical/ })
  const header = sortTrigger.element().closest('th')!

  await userEvent.click(sortTrigger)
  expect(header.getAttribute('aria-sort')).toBe('ascending')

  await userEvent.click(sortTrigger)
  expect(header.getAttribute('aria-sort')).toBe('descending')

  await userEvent.click(sortTrigger)
  expect(header.getAttribute('aria-sort')).toBe('ascending')
})

it('reports a controlled sort request without reordering rows', async () => {
  const onSortChange = vi.fn()
  const screen = await render(
    <Table.Root captionText="People" columnNames={{ 0: 'Name' }} sortDescriptor={{ column: 0, direction: 'ascending' }} onSortChange={onSortChange}>
      <Table.Caption>People</Table.Caption>
      <Table.Header><Table.Row><Table.ColumnHeader columnIndex={0} sortable>Name</Table.ColumnHeader></Table.Row></Table.Header>
      <Table.Body>
        <Table.Row><Table.Cell columnIndex={0}>Zoe</Table.Cell></Table.Row>
        <Table.Row><Table.Cell columnIndex={0}>Alice</Table.Cell></Table.Row>
      </Table.Body>
    </Table.Root>,
  )

  await userEvent.click(screen.getByRole('button', { name: 'Name' }))
  expect(onSortChange).toHaveBeenCalledWith({ sortDescriptor: { column: 0, direction: 'descending' } })
  expect(screen.getByRole('status').element().textContent).toBe('The table named "People" is now sorted by Name in ascending order.')
  expect(Array.from(screen.container.querySelectorAll('tbody td'), cell => cell.textContent)).toEqual(['Zoe', 'Alice'])
})

// Controlled sort props are additions to this library.
it('renders controlled sort changes and lets null override the default sort', async () => {
  const onSortChange = vi.fn()
  const view = (sortDescriptor: TableRootProps['sortDescriptor']) => (
    <Table.Root captionText="People" columnNames={{ 0: 'Name' }} defaultSortDescriptor={{ column: 0, direction: 'descending' }} sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
      <Table.Header><Table.Row><Table.ColumnHeader columnIndex={0} sortable>Name</Table.ColumnHeader></Table.Row></Table.Header>
      <Table.Body><Table.Row><Table.Cell columnIndex={0}>Alice</Table.Cell></Table.Row></Table.Body>
    </Table.Root>
  )
  const screen = await render(view(null))
  const button = screen.getByRole('button', { name: 'Name' })
  const header = button.element().closest('th')!
  const cell = screen.getByRole('cell')
  const status = screen.getByRole('status')

  expect(header.hasAttribute('aria-sort')).toBe(false)
  await expect.element(status).toBeEmptyDOMElement()
  await userEvent.click(button)
  expect(onSortChange).toHaveBeenLastCalledWith({ sortDescriptor: { column: 0, direction: 'ascending' } })
  expect(header.hasAttribute('aria-sort')).toBe(false)

  await screen.rerender(view({ column: 0, direction: 'ascending' }))
  await expect.element(cell).toHaveAttribute('data-sort-active', 'true')
  expect(header.getAttribute('aria-sort')).toBe('ascending')
  await expect.element(status).toHaveTextContent('The table named "People" is now sorted by Name in ascending order.')

  await userEvent.click(button)
  expect(onSortChange).toHaveBeenLastCalledWith({ sortDescriptor: { column: 0, direction: 'descending' } })
  await screen.rerender(view({ column: 0, direction: 'descending' }))
  expect(header.getAttribute('aria-sort')).toBe('descending')
  await expect.element(status).toHaveTextContent('The table named "People" is now sorted by Name in descending order.')

  await screen.rerender(view(null))
  expect(header.hasAttribute('aria-sort')).toBe(false)
  await expect.element(cell).not.toHaveAttribute('data-sort-active')
  await expect.element(status).toBeEmptyDOMElement()
})
