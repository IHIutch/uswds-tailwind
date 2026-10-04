import * as React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Modal } from './modal'

function renderModal() {
  return render(
    <Modal.Root>
      <Modal.Trigger>Open modal</Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <Modal.Title>Test Modal Title</Modal.Title>
          <Modal.Description>Test description</Modal.Description>
          <Modal.CloseTrigger aria-label="Close this window">Close</Modal.CloseTrigger>
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>,
  )
}

it('modal is not visible by default', async () => {
  const screen = await renderModal()

  await expect.element(screen.getByText('Test Modal Title')).not.toBeVisible()
})

it('clicking trigger opens modal', async () => {
  const screen = await renderModal()

  await screen.getByRole('button', { name: 'Open modal' }).click()
  await expect.element(screen.getByText('Test Modal Title')).toBeVisible()
})

it('modal has accessible name via Modal.Title', async () => {
  const screen = await renderModal()

  await screen.getByRole('button', { name: 'Open modal' }).click()

  const dialog = screen.getByRole('dialog')
  await expect.element(dialog).toHaveAccessibleName('Test Modal Title')
})

it('clicking close trigger closes modal', async () => {
  const screen = await renderModal()

  await screen.getByRole('button', { name: 'Open modal' }).click()
  await expect.element(screen.getByText('Test Modal Title')).toBeVisible()

  await screen.getByRole('button', { name: 'Close this window' }).click()
  await expect.element(screen.getByText('Test Modal Title')).not.toBeVisible()
})

it('controlled modal opens when the parent mounts with open={true}', async () => {
  const screen = await render(
    <Modal.Root open={true} onOpenChange={() => {}}>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <Modal.Title>Initially Open</Modal.Title>
          <Modal.Description>desc</Modal.Description>
          <Modal.CloseTrigger aria-label="Close">Close</Modal.CloseTrigger>
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>,
  )
  await expect.element(screen.getByText('Initially Open')).toBeVisible()
})

it('controlled modal opens and closes when the parent accepts user requests', async () => {
  const onOpenChange = vi.fn()

  function Controlled() {
    const [open, setOpen] = React.useState(false)
    return (
      <Modal.Root
        open={open}
        onOpenChange={(details) => {
          onOpenChange(details)
          setOpen(details.open)
        }}
      >
        <Modal.Trigger>Open modal</Modal.Trigger>
        <Modal.Backdrop />
        <Modal.Positioner>
          <Modal.Content>
            <Modal.Title>Controlled Title</Modal.Title>
            <Modal.Description>Controlled description</Modal.Description>
            <Modal.CloseTrigger aria-label="Close this window">Close</Modal.CloseTrigger>
          </Modal.Content>
        </Modal.Positioner>
      </Modal.Root>
    )
  }

  const screen = await render(<Controlled />)
  await screen.getByRole('button', { name: 'Open modal' }).click()
  expect(onOpenChange).toHaveBeenLastCalledWith({ open: true })
  await expect.element(screen.getByText('Controlled Title')).toBeVisible()

  onOpenChange.mockClear()
  await screen.getByRole('button', { name: 'Close this window' }).click()
  expect(onOpenChange).toHaveBeenCalledWith({ open: false })
  await expect.element(screen.getByText('Controlled Title')).not.toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Open modal' })).toHaveFocus()
})

it('controlled visibility changes only when the parent accepts open and close requests', async () => {
  const onOpenChange = vi.fn()
  const view = (open: boolean) => (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Trigger>Open modal</Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <Modal.Title>Owner controlled</Modal.Title>
          <Modal.Description>Waiting for the parent</Modal.Description>
          <Modal.CloseTrigger aria-label="Close this window">Close</Modal.CloseTrigger>
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>
  )
  const screen = await render(view(false))
  const trigger = screen.getByRole('button', { name: 'Open modal' }).element()
  const title = screen.getByText('Owner controlled')

  await expect.element(title).not.toBeVisible()
  await userEvent.click(trigger)
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
  await expect.element(title).not.toBeVisible()

  await screen.rerender(view(true))
  await expect.element(title).toBeVisible()
  expect(onOpenChange).toHaveBeenCalledOnce()

  await screen.getByRole('button', { name: 'Close this window' }).click()
  expect(onOpenChange).toHaveBeenLastCalledWith({ open: false })
  expect(onOpenChange).toHaveBeenCalledTimes(2)
  await expect.element(title).toBeVisible()

  await screen.rerender(view(false))
  await expect.element(title).not.toBeVisible()
  await expect.element(trigger).toHaveFocus()
  expect(onOpenChange).toHaveBeenCalledTimes(2)
})

// TODO: Keyboard interaction tests need investigation
it.skip('pressing Escape closes modal', async () => {
  const screen = await renderModal()

  const trigger = screen.getByRole('button', { name: 'Open modal' })
  await userEvent.click(trigger)
  await expect.element(screen.getByText('Test Modal Title')).toBeVisible()

  await userEvent.keyboard('{Escape}')
  await expect.element(screen.getByText('Test Modal Title')).not.toBeVisible()
})
