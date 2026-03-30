import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { RangeSlider } from './range-slider'

it('rangeSlider works standalone', async () => {
  const screen = await render(
    <RangeSlider.Root>
      <RangeSlider.Input />
    </RangeSlider.Root>,
  )

  await expect.element(screen.getByRole('slider')).toBeVisible()
})

it('field.Label htmlFor matches RangeSlider.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Volume</Field.Label>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  const label = screen.getByText('Volume')
  const input = screen.getByRole('slider')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('rangeSlider inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Volume</Field.Label>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('slider')).toBeDisabled()
})

it('rangeSlider inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Volume</Field.Label>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by RangeSlider aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Volume</Field.Label>
      <Field.Description>Help text</Field.Description>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('slider')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by RangeSlider aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Volume</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('slider')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Volume</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('slider')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Volume</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <RangeSlider.Root>
        <RangeSlider.Input />
      </RangeSlider.Root>
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('slider renders with default value', async () => {
  const screen = await render(
    <RangeSlider.Root>
      <RangeSlider.Input />
    </RangeSlider.Root>,
  )
  const slider = screen.getByRole('slider')
  await expect.element(slider).toHaveValue('50')
})
