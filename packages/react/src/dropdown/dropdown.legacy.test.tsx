import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Dropdown } from './dropdown'

// Behavioral parity tests mirroring e2e/dropdown/dropdown.test.ts.

function renderDropdown() {
  return render(
    <Dropdown.Root>
      <Dropdown.Trigger>Languages</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="english">
          <Dropdown.Link href="#">English</Dropdown.Link>
        </Dropdown.Item>
        <Dropdown.Item value="spanish">
          <Dropdown.Link href="#">Español</Dropdown.Link>
        </Dropdown.Item>
        <Dropdown.Item value="french">
          <Dropdown.Link href="#">Français</Dropdown.Link>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>,
  )
}

it('trigger has aria-expanded and aria-controls attributes', async () => {
  const screen = await renderDropdown()
  const trigger = screen.getByRole('button', { name: 'Languages' })

  await expect.element(trigger).toHaveAttribute('aria-expanded')
  await expect.element(trigger).toHaveAttribute('aria-controls')
})

it('clicking trigger toggles aria-expanded', async () => {
  const screen = await renderDropdown()
  const trigger = screen.getByRole('button', { name: 'Languages' })

  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})

// The dropdown machine closes via `focusout` (mirroring USWDS L77-85: focusout on
// LANGUAGE_PRIMARY), but clicking `document.body` does not move focus because body
// is not focusable. USWDS parity here would require either a global pointerdown
// listener in the machine, or the test clicking a focusable element outside.
// Skipped until the machine behavior is resolved.
it('clicking outside the dropdown closes it', async () => {
  const screen = await renderDropdown()
  const trigger = screen.getByRole('button', { name: 'Languages' })

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(document.body, { position: { x: 0, y: 0 } })
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})

it('clicking an item inside the dropdown closes it', async () => {
  const screen = await renderDropdown()
  const trigger = screen.getByRole('button', { name: 'Languages' })

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(screen.getByText('English'))
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})

it('pressing Escape closes the dropdown', async () => {
  const screen = await renderDropdown()
  const trigger = screen.getByRole('button', { name: 'Languages' })

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{Escape}')
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})
