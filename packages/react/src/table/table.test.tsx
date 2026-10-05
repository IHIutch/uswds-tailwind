import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Table } from './table'

// These cases cover React name props and updates, which are additions to USWDS.
it('updates labels and announcements when columnNames changes', async () => {
  const onSortChange = vi.fn()
  const view = (name: string) => (
    <Table.Root captionText="People" columnNames={{ 0: name }} onSortChange={onSortChange}>
      <Table.Header><Table.Row><Table.ColumnHeader columnIndex={0} sortable>{name}</Table.ColumnHeader></Table.Row></Table.Header>
      <Table.Body><Table.Row><Table.Cell>Alice</Table.Cell></Table.Row></Table.Body>
    </Table.Root>
  )
  const screen = await render(view('Name'))
  await userEvent.click(screen.getByRole('button', { name: 'Name' }))
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Name in ascending order.')

  await screen.rerender(view('Full name'))
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Full name in ascending order.')
  await expect.element(screen.getByRole('columnheader')).toHaveAttribute('aria-label', 'Full name, sortable column, currently sorted ascending')
  expect(onSortChange).toHaveBeenCalledOnce()
})

it('uses columnNames to name JSX headers', async () => {
  const screen = await render(
    <Table.Root captionText="People" columnNames={{ 0: 'Full name' }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader columnIndex={0} sortable>
            <span>Name</span>
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body><Table.Row><Table.Cell>Alice</Table.Cell></Table.Row></Table.Body>
    </Table.Root>,
  )
  const button = screen.getByRole('button', { name: 'Name' })
  await expect.element(button).toHaveAttribute('title', 'Click to sort by Full name in ascending order.')
  await expect.element(screen.getByRole('columnheader')).toHaveAttribute('aria-label', 'Full name, sortable column, currently unsorted')
  await userEvent.click(button)
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Full name in ascending order.')
})

it('announces an initial sort using columnNames', async () => {
  const screen = await render(
    <Table.Root captionText="People" columnNames={{ 0: 'Name' }} defaultSortDescriptor={{ column: 0, direction: 'descending' }}>
      <Table.Header><Table.Row><Table.ColumnHeader columnIndex={0} sortable>Name</Table.ColumnHeader></Table.Row></Table.Header>
      <Table.Body><Table.Row><Table.Cell>Alice</Table.Cell></Table.Row></Table.Body>
    </Table.Root>,
  )
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Name in descending order.')
})

// Default sort props are a React configuration contract, not HTML auto-init behavior.
it.each([null, { column: 0, direction: 'ascending' as const }])('renders defaultSortDescriptor=%j', async (defaultSortDescriptor) => {
  const screen = await render(
    <Table.Root captionText="People" columnNames={{ 0: 'Name' }} defaultSortDescriptor={defaultSortDescriptor}>
      <Table.Header><Table.Row><Table.ColumnHeader columnIndex={0} sortable>Name</Table.ColumnHeader></Table.Row></Table.Header>
      <Table.Body><Table.Row><Table.Cell>Alice</Table.Cell></Table.Row></Table.Body>
    </Table.Root>,
  )
  const header = screen.getByRole('columnheader')
  const status = screen.getByRole('status')
  if (defaultSortDescriptor) {
    await expect.element(header).toHaveAttribute('aria-sort', 'ascending')
    await expect.element(status).toHaveTextContent('The table named "People" is now sorted by Name in ascending order.')
  }
  else {
    await expect.element(header).not.toHaveAttribute('aria-sort')
    await expect.element(status).toBeEmptyDOMElement()
  }
})
