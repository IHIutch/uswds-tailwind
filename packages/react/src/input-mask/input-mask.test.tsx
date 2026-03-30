import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { InputMask } from './input-mask'

it('inputMask works standalone', async () => {
  const screen = await render(
    <InputMask.Root placeholder="___-____">
      <InputMask.Control>
        <InputMask.Input />
      </InputMask.Control>
    </InputMask.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toBeVisible()
})

it('field.Label htmlFor matches InputMask.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Phone</Field.Label>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  const label = screen.getByText('Phone')
  const input = screen.getByRole('textbox')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('inputMask inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Phone</Field.Label>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toBeDisabled()
})

it('inputMask inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Phone</Field.Label>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by InputMask aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Phone</Field.Label>
      <Field.Description>Help text</Field.Description>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by InputMask aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Phone</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Phone</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Phone</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('typing fills in the mask progressively', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Phone</Field.Label>
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Placeholder />
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>,
  )
  const input = screen.getByRole('textbox')
  await input.fill('123')
  await expect.element(input).not.toHaveValue('')
})

it('submits value in form data', async () => {
  let formData = new FormData()
  const screen = await render(
    <form onSubmit={(e) => {
      e.preventDefault()
      formData = new FormData(e.currentTarget)
    }}
    >
      <InputMask.Root placeholder="___-____">
        <InputMask.Control>
          <InputMask.Input name="phone" />
        </InputMask.Control>
      </InputMask.Root>
      <button type="submit">Submit</button>
    </form>,
  )
  await screen.getByRole('textbox').fill('1234567')
  await screen.getByRole('button', { name: 'Submit' }).click()
  expect(formData.get('phone')).toBeTruthy()
})
