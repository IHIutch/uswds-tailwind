import * as React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { Combobox } from './combobox'

const options = [{ value: 'a', text: 'A' }]

const multipleOptions = [
  { value: 'watercraft', text: 'Watercraft' },
  { value: 'automobiles', text: 'Automobiles' },
  { value: 'aircraft', text: 'Aircraft' },
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
            {options.map((option, index) => (
              <Combobox.Item
                key={option.value}
                index={index}
                {...option}
              >
                {option.text}
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
          {({ options }) => options.map((o, i) => (
            <Combobox.Item key={o.value} index={i} {...o}>{o.text}</Combobox.Item>
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
  expect(handleChange).toHaveBeenCalledWith('aircraft')
})
