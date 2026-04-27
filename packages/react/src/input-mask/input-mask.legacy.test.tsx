import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { InputMask } from './input-mask'

function renderPhone() {
  return render(
    <InputMask.Root placeholder="___-___-____">
      <InputMask.Label>US Telephone Number</InputMask.Label>
      <InputMask.Control>
        <InputMask.Placeholder />
        <InputMask.Input />
      </InputMask.Control>
    </InputMask.Root>,
  )
}

it('input is empty on init and has maxLength matching the placeholder', async () => {
  const screen = await renderPhone()
  const input = screen.getByRole('textbox')
  const inputEl = input.element() as HTMLInputElement
  expect(inputEl.value).toBe('')
  expect(inputEl.maxLength).toBe(12) // "___-___-____".length
})

it('typing digits formats to a phone number with hyphens', async () => {
  const screen = await renderPhone()
  const input = screen.getByRole('textbox')
  const inputEl = input.element() as HTMLInputElement
  await userEvent.click(input)
  await userEvent.type(inputEl, '5551234567')
  expect(inputEl.value).toBe('555-123-4567')
})

it('typing three digits leaves the input unformatted; full hyphen appears on the 4th', async () => {
  const screen = await renderPhone()
  const input = screen.getByRole('textbox')
  const inputEl = input.element() as HTMLInputElement
  await userEvent.click(input)
  await userEvent.type(inputEl, '555')
  expect(inputEl.value).toBe('555')
  await userEvent.type(inputEl, '1')
  expect(inputEl.value).toBe('555-1')
})

it('letters in a digit slot get dropped; subsequent digits keep filling slots', async () => {
  const screen = await renderPhone()
  const input = screen.getByRole('textbox')
  const inputEl = input.element() as HTMLInputElement
  await userEvent.click(input)
  await userEvent.type(inputEl, '5a5')
  // keyup of 'a' formats "5a" → "5"; keyup of '5' formats "55" → "55"
  expect(inputEl.value).toBe('55')
})
