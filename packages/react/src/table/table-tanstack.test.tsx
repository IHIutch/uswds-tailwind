import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { TanStackTableExample } from './table-tanstack.example'

// Consumer integration tests, not USWDS parity tests. All actions use rendered controls.
it('lets TanStack sort the rows and clears sorting through the consumer control', async () => {
  const screen = await render(<TanStackTableExample />)
  const names = () => Array.from(screen.container.querySelectorAll('tbody tr'), row => row.firstElementChild?.textContent)
  const ageButton = screen.getByRole('button', { name: 'Age', exact: true })

  await userEvent.click(ageButton)
  expect(names()).toEqual(['Bob', 'Charlie', 'Alice'])
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Age in ascending order.')
  await userEvent.click(ageButton)
  expect(names()).toEqual(['Alice', 'Charlie', 'Bob'])
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Age in descending order.')

  await userEvent.click(screen.getByRole('button', { name: 'Clear sorting' }))
  expect(names()).toEqual(['Charlie', 'Alice', 'Bob'])
  await expect.element(screen.getByRole('status')).toBeEmptyDOMElement()
  await expect.element(screen.getByRole('columnheader', { name: /Age/ })).not.toHaveAttribute('aria-sort')
})

it('keeps sorting associated with its column ID when columns are reordered or hidden', async () => {
  const screen = await render(<TanStackTableExample />)
  await userEvent.click(screen.getByRole('button', { name: 'Name', exact: true }))
  await userEvent.click(screen.getByRole('button', { name: 'Reverse columns' }))

  expect(Array.from(screen.container.querySelectorAll('tbody tr'), row => row.lastElementChild?.textContent)).toEqual(['Alice', 'Bob', 'Charlie'])
  await expect.element(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
  await expect.element(screen.getByRole('columnheader', { name: /Age/ })).not.toHaveAttribute('aria-sort')

  await userEvent.click(screen.getByRole('button', { name: 'Toggle age column' }))
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Name in ascending order.')
  await userEvent.click(screen.getByRole('button', { name: 'Name', exact: true }))
  expect(Array.from(screen.container.querySelectorAll('tbody td'), cell => cell.textContent)).toEqual(['Charlie', 'Bob', 'Alice'])
  await expect.element(screen.getByRole('status')).toHaveTextContent('The table named "People" is now sorted by Name in descending order.')
})
