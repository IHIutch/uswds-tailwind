import { visuallyHiddenStyle } from '@zag-js/dom-query'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
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
    <Field.Root>
      <Field.Label>Text input</Field.Label>
      <CharacterCount.Root maxLength={maxLength}>
        <CharacterCount.Input />
        <CharacterCount.Status />
        {withSrStatus && <CharacterCount.SrStatus />}
      </CharacterCount.Root>
    </Field.Root>,
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

  const status = screen.getByText('5 characters over limit').element() as HTMLElement
  const srStatus = screen.container.querySelector('[data-part="sr-status"]') as HTMLElement

  // Visible status updates synchronously
  expect(status.textContent).toBe('5 characters over limit')
  await expect.element(status).toBeVisible()

  // SR status uses USWDS's 1200 ms debounce and assertive over-limit warning.
  await vi.waitFor(
    () => {
      expect(srStatus.textContent).toBe('Character limit exceeded. 5 characters over limit')
      expect(srStatus.getAttribute('aria-live')).toBe('assertive')
    },
    { timeout: 1900, interval: 100 },
  )

  expect(srStatus).toHaveStyle(visuallyHiddenStyle)
}, 2400)

// SUGGESTION (review): `data-invalid` on the next three tests is our Zag
// convention (via `dataAttr()`); `validationMessage` is the native HTML
// constraint-validation API and would survive an attribute rename. Could
// drop the `data-invalid` assertions and keep only `validationMessage`
// checks — same behavioral signal, less coupling to our anatomy.
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

it('clears validity when the user dips back under the limit', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const input = screen.getByRole('textbox')
  await input.fill('123456789012345678901')
  await input.fill('12345')

  const inputEl = input.element() as HTMLInputElement
  expect(inputEl.validationMessage).toBe('')
  expect(inputEl.hasAttribute('data-invalid')).toBe(false)
})

it('status renders only text content (no HTML injection)', async () => {
  const screen = await renderCharacterCount({ maxLength: 20 })
  const status = screen.getByText('20 characters allowed')

  Array.from(status.element().childNodes).forEach((node) => {
    expect(node.nodeType).toBe(Node.TEXT_NODE)
  })
})
