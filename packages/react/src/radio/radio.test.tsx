import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { Fieldset } from '../fieldset/fieldset'
import { RadioGroup } from './radio'

it('radioGroup works standalone', async () => {
  const screen = await render(
    <RadioGroup.Root>
      <RadioGroup.Item value="a">
        <RadioGroup.ItemInput />
        <RadioGroup.ItemControl />
        <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
      </RadioGroup.Item>
    </RadioGroup.Root>,
  )

  await expect.element(screen.getByRole('radio')).toBeVisible()
})

it('fieldset.Legend is referenced by RadioGroup aria-labelledby', async () => {
  const screen = await render(
    <Fieldset.Root>
      <Fieldset.Legend>Choice</Fieldset.Legend>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Fieldset.Root>,
  )

  const radiogroup = screen.getByRole('radiogroup')
  await expect.element(radiogroup).toHaveAccessibleName('Choice')
})

it('radioGroup inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Choice</Field.Label>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('radio')).toBeDisabled()
})

it('radioGroup inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Choice</Field.Label>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by RadioGroup aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Choice</Field.Label>
      <Field.Description>Help text</Field.Description>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('radio')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by RadioGroup aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Choice</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('radio')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Choice</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('radio')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Choice</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <RadioGroup.Root>
        <RadioGroup.Item value="a">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Option A</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})
