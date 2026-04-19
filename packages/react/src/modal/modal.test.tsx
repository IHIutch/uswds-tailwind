import { expect, it } from 'vitest'
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

// TODO: Keyboard interaction tests need investigation
it.skip('pressing Escape closes modal', async () => {
  const screen = await renderModal()

  const trigger = screen.getByRole('button', { name: 'Open modal' })
  await userEvent.click(trigger)
  await expect.element(screen.getByText('Test Modal Title')).toBeVisible()

  await userEvent.keyboard('{Escape}')
  await expect.element(screen.getByText('Test Modal Title')).not.toBeVisible()
})
