import * as React from 'react'
import { expect, it, vi } from 'vitest'
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

it('clicking checkbox toggles checked state', async () => {
  const screen = await render(
    <Checkbox.Root>
      <Checkbox.Input />
      <Checkbox.Control />
      <Checkbox.Label>Option</Checkbox.Label>
    </Checkbox.Root>,
  )

  const checkbox = screen.getByRole('checkbox')
  await expect.element(checkbox).not.toBeChecked()

  await screen.getByText('Option').click()

  await expect.element(checkbox).toBeChecked()
})

it('disabled checkbox cannot be toggled', async () => {
  const screen = await render(
    <Checkbox.Root>
      <Checkbox.Input disabled />
      <Checkbox.Control />
      <Checkbox.Label>Option</Checkbox.Label>
    </Checkbox.Root>,
  )

  const checkbox = screen.getByRole('checkbox')
  await expect.element(checkbox).toBeDisabled()
  await expect.element(checkbox).not.toBeChecked()
})

it('forwarded ref is set on root element', async () => {
  const ref = React.createRef<HTMLLabelElement>()
  await render(
    <Checkbox.Root ref={ref}>
      <Checkbox.Input />
      <Checkbox.Control />
    </Checkbox.Root>,
  )
  expect(ref.current).toBeInstanceOf(HTMLLabelElement)
})

it('submits value in form data', async () => {
  let formData = new FormData()
  const screen = await render(
    <form onSubmit={(e) => {
      e.preventDefault()
      formData = new FormData(e.currentTarget)
    }}
    >
      <Checkbox.Root>
        <Checkbox.Input name="agree" value="yes" />
        <Checkbox.Control />
        <Checkbox.Label>Agree</Checkbox.Label>
      </Checkbox.Root>
      <button type="submit">Submit</button>
    </form>,
  )

  await screen.getByText('Agree').click()
  await screen.getByRole('button', { name: 'Submit' }).click()
  expect(formData.get('agree')).toBe('yes')
})

it('onCheckedChange fires when checkbox is toggled', async () => {
  const handleChange = vi.fn()
  const screen = await render(
    <Checkbox.Root onCheckedChange={handleChange}>
      <Checkbox.Input />
      <Checkbox.Control />
      <Checkbox.Label>Option</Checkbox.Label>
    </Checkbox.Root>,
  )

  await screen.getByText('Option').click()
  expect(handleChange).toHaveBeenCalledWith({ checked: true })
})

it('checkboxGroup onValueChange fires with all checked values', async () => {
  const handleChange = vi.fn()
  const screen = await render(
    <Checkbox.Group onValueChange={handleChange}>
      <Checkbox.Root value="a">
        <Checkbox.Input />
        <Checkbox.Control />
        <Checkbox.Label>Option A</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root value="b">
        <Checkbox.Input />
        <Checkbox.Control />
        <Checkbox.Label>Option B</Checkbox.Label>
      </Checkbox.Root>
    </Checkbox.Group>,
  )

  await screen.getByText('Option A').click()
  expect(handleChange).toHaveBeenLastCalledWith(['a'])

  await screen.getByText('Option B').click()
  expect(handleChange).toHaveBeenLastCalledWith(['a', 'b'])
})
