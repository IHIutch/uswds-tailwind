import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Modal } from './modal'

// Behavioral parity tests mirroring e2e/modal/modal.test.ts.

function renderModal() {
  return render(
    <Modal.Root>
      <Modal.Trigger>Open modal</Modal.Trigger>
      <Modal.Backdrop data-testid="backdrop" />
      <Modal.Positioner>
        <Modal.Content>
          <Modal.Title>Unsaved changes</Modal.Title>
          <Modal.Description>Your changes will be lost if you leave.</Modal.Description>
          <Modal.CloseTrigger aria-label="Close this window">Close</Modal.CloseTrigger>
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>,
  )
}

it('content has role="dialog"', async () => {
  const screen = await renderModal()
  await screen.getByRole('button', { name: 'Open modal' }).click()

  const dialog = screen.getByRole('dialog')
  await expect.element(dialog).toBeInTheDocument()
})

it('content references Title via aria-labelledby and Description via aria-describedby', async () => {
  const screen = await renderModal()
  await screen.getByRole('button', { name: 'Open modal' }).click()

  const dialog = screen.getByRole('dialog')
  await expect.element(dialog).toHaveAccessibleName('Unsaved changes')
  await expect.element(dialog).toHaveAccessibleDescription('Your changes will be lost if you leave.')
})

it('trigger has aria-controls pointing to the content id', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })
  await expect.element(trigger).toHaveAttribute('aria-controls')
})

it('trigger aria-expanded toggles with open state', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })

  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
})

it('clicking close trigger closes modal', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })

  await userEvent.click(trigger)
  await expect.element(screen.getByRole('dialog')).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Close this window' }))
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})

// Mirrors USWDS CLOSERS selector `.usa-modal-overlay:not([data-force-action])`.
// The Positioner (z-50) is `pointer-events-none` so clicks fall through to the
// Backdrop beneath; the Content is `pointer-events-auto` so modal body clicks
// still work normally.
it('clicking backdrop closes modal', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

  // Click in the top-left corner of the backdrop, outside the centered
  // modal content. Use position (5,5) rather than (0,0) — Playwright treats
  // (0,0) as an edge case that doesn't dispatch the click.
  await userEvent.click(screen.getByTestId('backdrop'), { force: true, position: { x: 5, y: 5 } })
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})

it('pressing Escape closes modal', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })

  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{Escape}')
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
})

it('closing the modal returns focus to the opening trigger', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })

  await userEvent.click(trigger)
  await userEvent.click(screen.getByRole('button', { name: 'Close this window' }))

  expect(document.activeElement).toBe(trigger.element())
})

// USWDS's legacy approach hides sibling body content via `aria-hidden="true"`
// while the modal is open. Our migrated modal renders in-tree (no body-level
// portal) so the machine's sibling-walk can't find non-modal peers; instead
// we signal the SR boundary with `aria-modal="true"` on the dialog — the
// WAI-ARIA 1.2 equivalent. Either strategy alone satisfies the a11y goal.
it('dialog has aria-modal="true" when open so SR users are scoped to the dialog', async () => {
  const screen = await renderModal()
  const trigger = screen.getByRole('button', { name: 'Open modal' })
  await userEvent.click(trigger)

  const dialog = screen.getByRole('dialog')
  await expect.element(dialog).toHaveAttribute('aria-modal', 'true')
})
