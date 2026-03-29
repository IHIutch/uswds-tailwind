import * as React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { DatePicker } from './date-picker'

function DatePickerComponent(props: React.ComponentProps<typeof DatePicker.Root>) {
  return (
    <DatePicker.Root {...props}>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger />
      </DatePicker.Control>
    </DatePicker.Root>
  )
}

it('datePicker works standalone', async () => {
  const screen = await render(
    <DatePickerComponent />,
  )

  await expect.element(screen.getByRole('textbox')).toBeVisible()
})

it('field.Label htmlFor matches DatePicker.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Date</Field.Label>
      <DatePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleName('Date')
})

it('datePicker inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Date</Field.Label>
      <DatePickerComponent />
    </Field.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toBeDisabled()
})

it('datePicker inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Date</Field.Label>
      <DatePickerComponent />
    </Field.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by DatePicker aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Date</Field.Label>
      <Field.Description>Help text</Field.Description>
      <DatePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by DatePicker aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Date</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <DatePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Date</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <DatePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Date</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <DatePickerComponent />
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})
