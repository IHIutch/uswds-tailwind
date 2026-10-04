import * as combobox from '@uswds-tailwind/combobox-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function MachineCombobox(props: Partial<combobox.Props>) {
  const service = useMachine(combobox.machine, { id: 'sync-free', options, ...props })
  const api = combobox.connect(service, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <label {...api.getLabelProps()}>Fruit</label>
      <select {...api.getHiddenSelectProps()}>
        <option value="">Choose a fruit</option>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <input {...api.getInputProps()} />
      <button {...api.getClearTriggerProps()}>Clear</button>
      <button {...api.getTriggerProps()}>Toggle</button>
      <ul {...api.getListProps()}>
        {api.items.map(item => <li key={item.id} {...api.getItemProps({ item })}>{item.label}</li>)}
      </ul>
      <div {...api.getStatusProps()}>{api.srStatusText}</div>
    </div>
  )
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L465-L534
it('shows the current matching label and commits the selected value', async () => {
  const screen = await render(<MachineCombobox />)
  const input = screen.getByRole('combobox')

  await userEvent.fill(input, 'apple')
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toBeVisible()
  await userEvent.fill(input, 'cherry')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toBeVisible()
  await expect.element(screen.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
  await expect.element(input).toHaveValue('Cherry')
  expect(document.querySelector<HTMLSelectElement>('[data-scope="combobox"][data-part="hidden-select"]')?.value).toBe('cherry')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L592-L603
it('clears an open selection and shows all options', async () => {
  const screen = await render(<MachineCombobox defaultValue="cherry" />)
  await userEvent.click(screen.getByRole('button', { name: 'Toggle the dropdown list' }))
  await userEvent.click(screen.getByRole('button', { name: 'Clear the select contents' }))

  await expect.element(screen.getByRole('combobox')).toHaveValue('')
  await expect.element(screen.getByRole('status')).toHaveTextContent('3 results available.')
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('data-highlighted')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-selected', 'false')
  expect(document.querySelector<HTMLSelectElement>('[data-scope="combobox"][data-part="hidden-select"]')?.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L698
it('focuses the selected option when ArrowDown opens the list', async () => {
  const screen = await render(<MachineCombobox defaultValue="cherry" />)
  window.focus()
  await expect.element(screen.getByRole('combobox')).toHaveValue('Cherry')
  await userEvent.tab()
  await userEvent.keyboard('{ArrowDown}')

  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus()
  await userEvent.keyboard('{ArrowUp}')
  await expect.element(screen.getByRole('option', { name: 'Banana' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L845-L850
it('restores the committed label when clicking or tabbing outside', async () => {
  const screen = await render(
    <>
      <button type="button">Outside</button>
      <MachineCombobox defaultValue="banana" />
    </>,
  )
  const input = screen.getByRole('combobox')
  const outside = screen.getByRole('button', { name: 'Outside' })

  await userEvent.fill(input, 'ch')
  await userEvent.click(outside)
  await expect.element(input).toHaveValue('Banana')
  await expect.element(input).toHaveAttribute('aria-expanded', 'false')

  await userEvent.fill(input, 'app')
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
  await expect.element(outside).toHaveFocus()
  await expect.element(input).toHaveValue('Banana')
  await expect.element(input).toHaveAttribute('aria-expanded', 'false')
})

// Public callback and submitted form values are adapter behavior, not USWDS event parity.
it('reports committed value changes with their labels and keeps the submitted value current', async () => {
  const onValueChange = vi.fn()
  const screen = await render(<form><MachineCombobox name="fruit" defaultValue="banana" onValueChange={onValueChange} /></form>)
  const select = document.querySelector<HTMLSelectElement>('[data-scope="combobox"][data-part="hidden-select"]')!
  const form = select.form!
  expect(new FormData(form).get('fruit')).toBe('banana')

  await userEvent.click(screen.getByRole('button', { name: 'Toggle the dropdown list' }))
  await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
  await expect.element(screen.getByRole('combobox')).toHaveValue('Cherry')
  expect(new FormData(form).get('fruit')).toBe('cherry')
  expect(onValueChange).toHaveBeenLastCalledWith({ value: 'cherry', label: 'Cherry' })

  await userEvent.click(screen.getByRole('button', { name: 'Toggle the dropdown list' }))
  await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
  await expect.element(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')

  await userEvent.click(screen.getByRole('button', { name: 'Clear the select contents' }))
  await expect.element(screen.getByRole('combobox')).toHaveValue('')
  expect(new FormData(form).get('fruit')).toBe('')
  expect(onValueChange).toHaveBeenLastCalledWith({ value: '', label: '' })
})

// Internal time-picker filtering is a port-specific extension, not USWDS parity.
it('lets a custom filter override regex matching and result ordering', async () => {
  const customFilter = (query: string, source: readonly combobox.ComboboxOptionData[]) =>
    query === 'time query' ? [source[2]!, source[0]!] : []
  const screen = await render(<MachineCombobox filter="no regex match" customFilter={customFilter} />)

  await userEvent.fill(screen.getByRole('combobox'), 'time query')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toBeVisible()
  expect(Array.from(document.querySelectorAll('[data-part="item"]'), item => item.textContent)).toEqual(['Cherry', 'Apple'])
  await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
  await expect.element(screen.getByRole('combobox')).toHaveValue('Cherry')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L336-L385
it('uses explicit capture names to extract part of the input for regex matching', async () => {
  const screen = await render(<MachineCombobox filter="{{fruit}}" filterExtras={{ fruit: 'fruit (\\w+)' }} />)

  await userEvent.fill(screen.getByRole('combobox'), 'fruit cherry')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toBeVisible()
  expect(Array.from(document.querySelectorAll('[data-part="item"]'), item => item.textContent)).toEqual(['Cherry'])
  await userEvent.click(screen.getByRole('option', { name: 'Cherry' }))
  await expect.element(screen.getByRole('combobox')).toHaveValue('Cherry')
})
