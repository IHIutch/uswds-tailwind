import { visuallyHiddenStyle } from '@zag-js/dom-query'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { CharacterCount } from './character-count'

// Behavioral parity tests mirroring e2e/character-count/character-count.test.ts.

// Default helper omits SrStatus so `getByText` is unambiguous for the
// visible-status assertions. Tests that need to observe the SR debounce
// opt in via `withSrStatus`.
function renderCharacterCount({
  maxLength = 20,
  withSrStatus = false,
}: { maxLength?: number, withSrStatus?: boolean } = {}) {
  return render(
    <CharacterCount.Root maxLength={maxLength}>
      <CharacterCount.Label>Text input</CharacterCount.Label>
      <CharacterCount.Input />
      <CharacterCount.Status />
      {withSrStatus && <CharacterCount.SrStatus />}
    </CharacterCount.Root>,
  )
}

it('shows "N characters allowed" as the initial status', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  await expect.element(screen.getByText('20 characters allowed')).toBeVisible()
})

it('shows "N characters left" as user types below the limit', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const input = screen.getByRole('textbox')

  await input.fill('1')
  await expect.element(screen.getByText('19 characters left')).toBeVisible()
})

it('shows singular "1 character left" at one under the limit', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const input = screen.getByRole('textbox')

  await input.fill('1234567890123456789')
  await expect.element(screen.getByText('1 character left')).toBeVisible()
})

it('shows "1 character over limit" when one over', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const input = screen.getByRole('textbox')

  await input.fill('123456789012345678901')
  await expect.element(screen.getByText('1 character over limit')).toBeVisible()
})

// New
it('shows "N characters over limit" when multiple over', async () => {
  const screen = await renderCharacterCount({ maxLength: 20, withSrStatus: true })
  const input = screen.getByRole('textbox')

  await input.fill('1234567890123456789012345')

  const status = screen.container.querySelector('[data-part="status"]') as HTMLElement
  const srStatus = screen.container.querySelector('[data-part="sr-status"]') as HTMLElement

  // Visible status updates synchronously
  expect(status.textContent).toBe('5 characters over limit')
  await expect.element(status).toBeVisible()

  // SR status is debounced (1000ms). Poll until it catches up.
  await vi.waitFor(
    () => expect(srStatus.textContent).toBe('5 characters over limit'),
    { timeout: 1500, interval: 100 },
  )

  expect(srStatus).toHaveStyle(visuallyHiddenStyle)
}, 2000)

it('input is valid under the limit (no data-invalid, no validationMessage)', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const input = screen.getByRole('textbox')
  await input.fill('1')

  const inputEl = input.element() as HTMLInputElement
  expect(inputEl.validationMessage).toBe('')
  expect(inputEl.hasAttribute('data-invalid')).toBe(false)
})

it('input becomes invalid over the limit (data-invalid set, validationMessage populated)', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const input = screen.getByRole('textbox')
  await input.fill('123456789012345678901')

  const inputEl = input.element() as HTMLInputElement
  expect(inputEl.validationMessage).toBe('The content is too long.')
  expect(inputEl.hasAttribute('data-invalid')).toBe(true)
})

it('status renders only text content (no HTML injection)', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const status = screen.getByText('20 characters allowed')

  Array.from(status.element().childNodes).forEach((node) => {
    expect(node.nodeType).toBe(Node.TEXT_NODE)
  })
})
