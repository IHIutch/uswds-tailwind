import * as React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Field } from '../field/field'
import { Combobox } from './combobox'

const options = [{ value: 'a', label: 'A' }]

const multipleOptions = [
  { value: 'watercraft', label: 'Watercraft' },
  { value: 'automobiles', label: 'Automobiles' },
  { value: 'aircraft', label: 'Aircraft' },
]

function ComboboxComponent(props: React.ComponentProps<typeof Combobox.Root>) {
  return (
    <Combobox.Root {...props}>
      <Combobox.Control>
        <Combobox.Input />
      </Combobox.Control>
      <Combobox.List />
    </Combobox.Root>
  )
}

function FullComboboxComponent(props: React.ComponentProps<typeof Combobox.Root>) {
  return (
    <Combobox.Root {...props}>
      <Combobox.Label>Choose an option</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearButton />
          <Combobox.ToggleButton />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.List>
        {({ options }) => (
          <>
            {options.map(option => (
              <Combobox.Item
                key={option.id}
                {...option}
              >
                {option.label}
              </Combobox.Item>
            ))}
            <Combobox.EmptyItem />
          </>
        )}
      </Combobox.List>
    </Combobox.Root>
  )
}

it('combobox works standalone', async () => {
  const screen = await render(
    <ComboboxComponent options={options} />,
  )

  await expect.element(screen.getByRole('combobox')).toBeVisible()
})

it('field.Label htmlFor matches Combobox.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Pick</Field.Label>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  const label = screen.getByText('Pick')
  const input = screen.getByRole('combobox')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('combobox inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Pick</Field.Label>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  await expect.element(screen.getByRole('combobox')).toBeDisabled()
})

it('combobox inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Pick</Field.Label>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  await expect.element(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by Combobox aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Pick</Field.Label>
      <Field.Description>Help text</Field.Description>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by Combobox aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Pick</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Pick</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Pick</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <ComboboxComponent options={options} />
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('typing in input filters the dropdown options', async () => {
  const screen = await render(
    <FullComboboxComponent options={multipleOptions} />,
  )

  const input = screen.getByRole('combobox')
  await input.fill('Air')

  await expect.element(screen.getByText('Aircraft')).toBeVisible()
  await expect.element(screen.getByText('Watercraft')).not.toBeInTheDocument()
  await expect.element(screen.getByText('Automobiles')).not.toBeInTheDocument()
})

it('clicking an option selects it and updates input value', async () => {
  const screen = await render(
    <FullComboboxComponent options={multipleOptions} />,
  )

  const input = screen.getByRole('combobox')
  await input.fill('a')

  await screen.getByText('Aircraft').click()

  await expect.element(input).toHaveValue('Aircraft')
})

it('clear button resets input value', async () => {
  const screen = await render(
    <FullComboboxComponent options={multipleOptions} />,
  )

  const input = screen.getByRole('combobox')
  await input.fill('a')
  await screen.getByText('Aircraft').click()
  await expect.element(input).toHaveValue('Aircraft')

  await screen.getByRole('button', { name: /clear the select contents/i }).click()

  await expect.element(input).toHaveValue('')
})

it('toggle button opens the dropdown list', async () => {
  const screen = await render(
    <FullComboboxComponent options={multipleOptions} />,
  )

  await screen.getByRole('button', { name: /toggle the dropdown list/i }).click()

  await expect.element(screen.getByRole('listbox')).toBeVisible()
})

it('submits value in form data', async () => {
  let formData = new FormData()
  const screen = await render(
    <form onSubmit={(e) => {
      e.preventDefault()
      formData = new FormData(e.currentTarget)
    }}
    >
      <Combobox.Root options={multipleOptions}>
        <Combobox.Control>
          <Combobox.Input name="vehicle" />
        </Combobox.Control>
        <Combobox.List>
          {({ options }) => options.map(o => (
            <Combobox.Item key={o.id} {...o}>{o.label}</Combobox.Item>
          ))}
        </Combobox.List>
      </Combobox.Root>
      <button type="submit">Submit</button>
    </form>,
  )
  await screen.getByRole('combobox').fill('Air')
  await screen.getByText('Aircraft').click()
  await screen.getByRole('button', { name: 'Submit' }).click()
  expect(formData.get('vehicle')).toBe('Aircraft')
})

it('onValueChange fires when option is selected', async () => {
  const handleChange = vi.fn()
  const screen = await render(
    <FullComboboxComponent options={multipleOptions} onValueChange={handleChange} />,
  )

  await screen.getByRole('combobox').fill('Air')
  await screen.getByText('Aircraft').click()
  expect(handleChange).toHaveBeenCalledWith({ value: 'aircraft', label: 'Aircraft' })
})

it('arrowDown moves DOM focus to the newly-highlighted option', async () => {
  const screen = await render(
    <FullComboboxComponent options={multipleOptions} />,
  )
  const input = screen.getByRole('combobox')

  input.element().focus()
  await userEvent.keyboard('{ArrowDown}') // open, Watercraft highlighted
  await userEvent.keyboard('{ArrowDown}') // move to Automobiles

  await expect.element(screen.getByRole('option', { name: 'Automobiles' })).toHaveFocus()
})

it('preserves root ids and Field labels while keeping generated input ids stable', async () => {
  const view = (id: string) => (
    <div>
      <Field.Root>
        <Field.Label>Pick</Field.Label>
        <ComboboxComponent id={id} options={multipleOptions} />
      </Field.Root>
      <button>Outside</button>
    </div>
  )
  const screen = await render(view('combobox-root'))
  const input = screen.getByRole('combobox')
  const inputId = input.element().id
  expect(document.getElementById('combobox-root')).toContainElement(input.element())
  expect(screen.getByText('Pick').element().getAttribute('for')).toBe(inputId)
  await input.fill('Water')
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')
  await screen.getByRole('button', { name: 'Outside' }).click()
  await expect.element(input).toHaveAttribute('aria-expanded', 'false')
  await screen.rerender(view('renamed-combobox'))
  expect(document.getElementById('renamed-combobox')).toContainElement(input.element())
  expect(input.element().id).toBe(inputId)
  expect(screen.getByText('Pick').element().getAttribute('for')).toBe(inputId)
  await input.fill('Water')
  await expect.element(input).toHaveAttribute('aria-expanded', 'true')
  await screen.getByRole('button', { name: 'Outside' }).click()
  await expect.element(input).toHaveAttribute('aria-expanded', 'false')
})

it('uses explicit part ids and gives the HTML id precedence over ids.root', async () => {
  const screen = await render(
    <ComboboxComponent id="authored-combobox" options={options} ids={{ root: 'fallback-root', input: 'custom-input' }} />,
  )
  const input = screen.getByRole('combobox').element()
  expect(input.id).toBe('custom-input')
  expect(document.getElementById('authored-combobox')).toContainElement(input)
  await screen.rerender(<ComboboxComponent options={options} ids={{ root: 'fallback-root', input: 'custom-input' }} />)
  expect(document.getElementById('fallback-root')).toContainElement(input)
})
