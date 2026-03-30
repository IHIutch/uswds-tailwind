import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { CharacterCount } from './character-count'

it('characterCount works standalone', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={100}>
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toBeVisible()
})

it('field.Label htmlFor matches CharacterCount.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  const label = screen.getByText('Message')
  const input = screen.getByRole('textbox')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('characterCount inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Message</Field.Label>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toBeDisabled()
})

it('characterCount inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Message</Field.Label>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
})

it('characterCount.Status is referenced by aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/characters/)
})

// TODO: CharacterCount.Status owns aria-describedby — need to combine with Field error IDs
it.skip('field.ErrorMessage id is referenced by CharacterCount aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Message</Field.Label>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

// TODO: CharacterCount.Status owns aria-describedby — need to combine with Field error IDs
it.skip('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Message</Field.Label>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('status text shows character count', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={20}>
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )
  await expect.element(screen.getByText(/20 characters allowed/)).toBeVisible()
})

it('character count updates as user types', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={20}>
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )
  const input = screen.getByRole('textbox')
  await input.fill('hello')
  await expect.element(screen.getByText(/15 characters left/)).toBeVisible()
})
