import * as React from 'react'
import { expect, it, vi } from 'vitest'
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

it('reports the selected item value', async () => {
  const onItemSelect = vi.fn()
  const screen = await render(
    <Dropdown.Root onItemSelect={onItemSelect}>
      <Dropdown.Trigger>Menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="one">
          <Dropdown.Link href="#one">One</Dropdown.Link>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>,
  )

  await screen.getByRole('button', { name: 'Menu' }).click()
  await screen.getByText('One').click()

  expect(onItemSelect).toHaveBeenCalledOnce()
  expect(onItemSelect).toHaveBeenCalledWith({ value: 'one' })
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

it('controlled closed state takes precedence over defaultOpen', async () => {
  const onOpenChange = vi.fn()
  const screen = await render(
    <Dropdown.Root open={false} defaultOpen={true} onOpenChange={onOpenChange}>
      <Dropdown.Trigger>Menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="one"><Dropdown.Link href="#one">One</Dropdown.Link></Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>,
  )

  await expect.element(screen.getByText('One')).not.toBeVisible()
  await screen.getByRole('button', { name: 'Menu' }).click()

  expect(onOpenChange).toHaveBeenCalledOnce()
  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  await expect.element(screen.getByText('One')).not.toBeVisible()
})

it('a controlled owner can decline a close request and then accept it', async () => {
  const onOpenChange = vi.fn()
  function ControlledDropdown() {
    const [open, setOpen] = React.useState(true)
    return (
      <>
        <button type="button" onClick={() => setOpen(false)}>Accept close</button>
        <Dropdown.Root open={open} onOpenChange={onOpenChange}>
          <Dropdown.Trigger>Menu</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item value="one"><Dropdown.Link href="#one">One</Dropdown.Link></Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </>
    )
  }
  const screen = await render(<ControlledDropdown />)

  await expect.element(screen.getByText('One')).toBeVisible()
  await screen.getByRole('button', { name: 'Menu' }).click()

  expect(onOpenChange).toHaveBeenCalledWith({ open: false })
  await expect.element(screen.getByText('One')).toBeVisible()

  await screen.getByRole('button', { name: 'Accept close' }).click()
  await expect.element(screen.getByText('One')).not.toBeVisible()
})

it('preserves HTML root ids without changing generated trigger ids', async () => {
  const view = (id: string) => (
    <Dropdown.Root id={id} ids={{ root: 'fallback-root', content: 'custom-menu' }}>
      <Dropdown.Trigger>Menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="one"><Dropdown.Link href="#one">One</Dropdown.Link></Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  )
  const screen = await render(view('dropdown-root'))
  const trigger = screen.getByRole('button', { name: 'Menu' })
  const triggerId = trigger.element().id
  expect(document.getElementById('dropdown-root')).toContainElement(trigger.element())
  expect(trigger.element().getAttribute('aria-controls')).toBe('custom-menu')
  await screen.rerender(view('renamed-dropdown'))
  expect(document.getElementById('renamed-dropdown')).toContainElement(trigger.element())
  expect(trigger.element().id).toBe(triggerId)
  await trigger.click()
  await expect.element(screen.getByText('One')).toBeVisible()
})

it('uses the root part override when no HTML id is supplied', async () => {
  const screen = await render(
    <Dropdown.Root ids={{ root: 'dropdown-part-root' }}><Dropdown.Trigger>Menu</Dropdown.Trigger></Dropdown.Root>,
  )
  expect(document.getElementById('dropdown-part-root')).toContainElement(screen.getByRole('button', { name: 'Menu' }).element())
})
