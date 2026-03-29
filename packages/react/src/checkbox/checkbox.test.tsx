import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { Checkbox } from './checkbox'

it('checkbox works standalone', async () => {
  const screen = await render(
    <Checkbox.Root>
      <Checkbox.Input />
      <Checkbox.Control />
      <Checkbox.Label>Option</Checkbox.Label>
    </Checkbox.Root>,
  )

  await expect.element(screen.getByRole('checkbox')).toBeVisible()
})

it('field.Label htmlFor matches Checkbox.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Accept</Field.Label>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  const label = screen.getByText('Accept')
  const input = screen.getByRole('checkbox')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('checkbox inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Accept</Field.Label>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('checkbox')).toBeDisabled()
})

it('checkbox inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Accept</Field.Label>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by Checkbox aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Accept</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('checkbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by Checkbox aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Accept</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('checkbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Accept</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('checkbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Accept</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Checkbox.Root>
        <Checkbox.Input />
        <Checkbox.Control />
      </Checkbox.Root>
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})
