import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { Select } from './select'

function renderSelect(fieldProps: Record<string, any> = {}) {
  return render(
    <Field.Root {...fieldProps}>
      <Field.Label>Choose</Field.Label>
      {fieldProps.description && <Field.Description>{fieldProps.description}</Field.Description>}
      {fieldProps.errorMessage && <Field.ErrorMessage>{fieldProps.errorMessage}</Field.ErrorMessage>}
      <Select.Root>
        <Select.Field>
          <option value="a">A</option>
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>,
  )
}

it('select works standalone without Field.Root', async () => {
  const screen = await render(
    <Select.Root>
      <Select.Field>
        <option value="a">A</option>
      </Select.Field>
    </Select.Root>,
  )
  await expect.element(screen.getByRole('combobox')).toBeVisible()
})

it('field.Label htmlFor matches Select id', async () => {
  const screen = await renderSelect()
  const label = screen.getByText('Choose')
  const select = screen.getByRole('combobox')
  expect(label.element().getAttribute('for')).toBe(select.element().id)
})

it('select inherits disabled from Field.Root', async () => {
  const screen = await renderSelect({ disabled: true })
  await expect.element(screen.getByRole('combobox')).toBeDisabled()
})

it('select inherits invalid from Field.Root', async () => {
  const screen = await renderSelect({ invalid: true })
  await expect.element(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by Select aria-describedby', async () => {
  const screen = await renderSelect({ description: 'Help text' })
  const select = screen.getByRole('combobox')
  await expect.element(select).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by Select aria-describedby when invalid', async () => {
  const screen = await renderSelect({ invalid: true, description: 'Help text', errorMessage: 'Required' })
  const select = screen.getByRole('combobox')
  await expect.element(select).toHaveAccessibleDescription(/Help text/)
  await expect.element(select).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await renderSelect({ description: 'Help text', errorMessage: 'Required' })
  const select = screen.getByRole('combobox')
  await expect.element(select).toHaveAccessibleDescription(/Help text/)
  await expect.element(select).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Choose</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Select.Root>
        <Select.Field>
          <option value="a">A</option>
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>,
  )

  await expect.element(select).toHaveAccessibleDescription(/Help text/)
  await expect.element(select).toHaveAccessibleDescription(/Required/)
})
