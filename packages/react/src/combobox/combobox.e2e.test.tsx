import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Combobox } from './combobox'

// Behavioral parity tests mirroring e2e/combobox/combo-box.test.ts.

const options = [
  { value: 'apple', text: 'Apple' },
  { value: 'apricot', text: 'Apricot' },
  { value: 'avocado', text: 'Avocado' },
  { value: 'banana', text: 'Banana' },
  { value: 'blackberry', text: 'Blackberry' },
  { value: 'cherry', text: 'Cherry' },
  { value: 'grape', text: 'Grape' },
  { value: 'plantain', text: 'Plantain' },
]

function renderCombobox() {
  return render(
    <Combobox.Root options={options}>
      <Combobox.Label>Fruit</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearButton />
          <Combobox.ToggleButton />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.List>
        {({ options: items }) => items.map((opt, index) => (
          <Combobox.Item key={opt.value} index={index} value={opt.value} text={opt.text}>
            {opt.text}
          </Combobox.Item>
        ))}
      </Combobox.List>
    </Combobox.Root>,
  )
}

it('list is hidden by default', async () => {
  const screen = await renderCombobox()
  const listbox = screen.getByRole('listbox', { includeHidden: true })
  expect((listbox.element() as HTMLElement).hidden).toBe(true)
})

it('input has role="combobox" and aria-autocomplete="list"', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAttribute('aria-autocomplete', 'list')
})

it('clicking input opens the list', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.click(input)
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')
})

it('clicking the toggle button opens the list', async () => {
  const screen = await renderCombobox()
  const toggle = screen.getByRole('button', { name: /toggle the dropdown list/i })
  const input = screen.getByRole('combobox')

  await userEvent.click(toggle)
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')
})

it('clicking the toggle button twice toggles the list closed', async () => {
  const screen = await renderCombobox()
  const toggle = screen.getByRole('button', { name: /toggle the dropdown list/i })
  const input = screen.getByRole('combobox')

  await userEvent.click(toggle)
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(toggle)
  await expect.element(input).toHaveAttribute('aria-expanded', 'false')
})

it('typing filters the option list', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.fill(input, 'a')

  // "Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Grape", "Plantain" all contain 'a'
  // Check at least one expected match is visible
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toBeVisible()
  await expect.element(screen.getByRole('option', { name: 'Apricot' })).toBeVisible()
})

it('typing a non-match leaves the listbox empty', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.fill(input, 'zzz-no-match-zzz')
  // No options should match
  const options = document.querySelectorAll('[role="option"]')
  expect(options.length).toBe(0)
})

it('pressing Escape closes an open list', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.click(input)
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{Escape}')
  await expect.element(input).toHaveAttribute('aria-expanded', 'false')
})

it('pressing ArrowDown from empty input opens the list', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  input.element().focus()
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')
})

// KNOWN MACHINE ISSUE: the combobox input uses `defaultValue` rather than
// `value`, so clicking an option doesn't sync the DOM input's value. Fails
// until the machine switches to a controlled input pattern.
it('clicking an option updates the input value to the option text', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.click(input)
  await userEvent.click(screen.getByRole('option', { name: 'Apple' }))

  await expect.element(input).toHaveValue('Apple')
})

// KNOWN MACHINE ISSUE: same uncontrolled input root cause.
it('clicking an option closes the list', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.click(input)
  await userEvent.click(screen.getByRole('option', { name: 'Apple' }))

  await expect.element(input).toHaveAttribute('aria-expanded', 'false')
})

it('options have role="option"', async () => {
  const screen = await renderCombobox()
  const input = screen.getByRole('combobox')

  await userEvent.click(input)

  const firstOption = screen.getByRole('option', { name: 'Apple' })
  await expect.element(firstOption).toHaveAttribute('role', 'option')
})
