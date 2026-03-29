import * as React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { TimePicker } from './time-picker'

function TimePickerComponent(props: React.ComponentProps<typeof TimePicker.Root>) {
  return (
    <TimePicker.Root {...props}>
      <TimePicker.Control>
        <TimePicker.Input />
        <TimePicker.IndicatorGroup>
          <TimePicker.ClearButton />
          <TimePicker.ToggleButton />
        </TimePicker.IndicatorGroup>
      </TimePicker.Control>
      <TimePicker.List>
        {({ options }) => options.map((option, index) => (
          <TimePicker.Item key={option.value} index={index} {...option}>
            {option.label}
          </TimePicker.Item>
        ))}
      </TimePicker.List>
    </TimePicker.Root>
  )
}

it('timePicker works standalone', async () => {
  const screen = await render(
    <TimePickerComponent />,
  )

  await expect.element(screen.getByRole('combobox')).toBeVisible()
})

it('field.Label htmlFor matches TimePicker.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Time</Field.Label>
      <TimePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleName('Time')
})

it('timePicker inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Time</Field.Label>
      <TimePickerComponent />
    </Field.Root>,
  )

  await expect.element(screen.getByRole('combobox')).toBeDisabled()
})

it('timePicker inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Time</Field.Label>
      <TimePickerComponent />
    </Field.Root>,
  )

  await expect.element(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by TimePicker aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Time</Field.Label>
      <Field.Description>Help text</Field.Description>
      <TimePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by TimePicker aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Time</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <TimePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Time</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <TimePickerComponent />
    </Field.Root>,
  )

  const input = screen.getByRole('combobox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Time</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <TimePickerComponent />
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})
