import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Dropdown } from './dropdown'

function renderDropdown() {
  return render(
    <Dropdown.Root>
      <Dropdown.Trigger>Menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="one">
          <Dropdown.Link href="#">One</Dropdown.Link>
        </Dropdown.Item>
        <Dropdown.Item value="two">
          <Dropdown.Link href="#">Two</Dropdown.Link>
        </Dropdown.Item>
        <Dropdown.Item value="three">
          <Dropdown.Link href="#">Three</Dropdown.Link>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>,
  )
}

it('menu is not visible by default', async () => {
  const screen = await renderDropdown()

  await expect.element(screen.getByText('One')).not.toBeVisible()
})

it('clicking trigger opens menu', async () => {
  const screen = await renderDropdown()

  await screen.getByRole('button', { name: 'Menu' }).click()
  await expect.element(screen.getByText('One')).toBeVisible()
})

it('clicking trigger again closes menu', async () => {
  const screen = await renderDropdown()

  const trigger = screen.getByRole('button', { name: 'Menu' })

  await userEvent.click(trigger)
  await expect.element(screen.getByText('One')).toBeVisible()

  await userEvent.click(trigger)
  await expect.element(screen.getByText('One')).not.toBeVisible()
})

// TODO: Keyboard interaction tests need investigation
it.skip('pressing Escape closes menu', async () => {
  const screen = await renderDropdown()

  const trigger = screen.getByRole('button', { name: 'Menu' })

  await userEvent.click(trigger)
  await expect.element(screen.getByText('One')).toBeVisible()

  await userEvent.keyboard('{Escape}')
  await expect.element(screen.getByText('One')).not.toBeVisible()
})
