import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
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

it('prefilled over-limit input has native validity on mount', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={5} defaultValue="abcdef">
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  const input = screen.getByRole('textbox').element() as HTMLInputElement
  expect(input.value).toBe('abcdef')
  expect(input.validationMessage).toBe('The content is too long.')
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

it('keeps the screen reader status unchanged when unrelated content rerenders', async () => {
  const view = (label: string) => (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <CharacterCount.Root maxLength={20}>
        <CharacterCount.Input />
        <CharacterCount.SrStatus />
      </CharacterCount.Root>
    </Field.Root>
  )
  const screen = await render(view('Before'))
  await screen.rerender(view('After'))

  await expect.element(screen.getByText('After')).toBeVisible()
  expect(screen.container.querySelector('[data-part="sr-status"]')?.textContent).toBe('20 characters allowed')
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

it('allows typing past an input maxlength and reports the over-limit count', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={5}>
      <CharacterCount.Input maxLength={5} />
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )
  const input = screen.getByRole('textbox').element() as HTMLInputElement

  await userEvent.type(input, 'abcdef')

  expect(input.value).toBe('abcdef')
  await expect.element(screen.getByText('1 character over limit')).toBeVisible()
})

it('submits value in form data', async () => {
  let formData = new FormData()
  const screen = await render(
    <form onSubmit={(e) => {
      e.preventDefault()
      formData = new FormData(e.currentTarget)
    }}
    >
      <CharacterCount.Root maxLength={100}>
        <CharacterCount.Input name="message" />
        <CharacterCount.Status />
      </CharacterCount.Root>
      <button type="submit">Submit</button>
    </form>,
  )
  await screen.getByRole('textbox').fill('hello')
  await screen.getByRole('button', { name: 'Submit' }).click()
  expect(formData.get('message')).toBe('hello')
})

it('submits only the accepted controlled value after a rejected edit', async () => {
  const onValueChange = vi.fn()
  const view = (value: string) => (
    <form>
      <CharacterCount.Root maxLength={5} value={value} onValueChange={onValueChange}>
        <CharacterCount.Input name="message" />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </form>
  )
  const screen = await render(view('abc'))
  const input = screen.getByRole('textbox').element() as HTMLInputElement
  await userEvent.fill(input, 'abcdef')
  await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith({ value: 'abcdef' }))
  expect(input.value).toBe('abc')
  expect(new FormData(input.form!).get('message')).toBe('abc')
  expect(input.validationMessage).toBe('')
  await screen.rerender(view('abcdef'))
  await expect.element(screen.getByText('1 character over limit')).toBeVisible()
  expect(input.value).toBe('abcdef')
  expect(input.validationMessage).toBe('The content is too long.')
})

it('updates its validation message when the owner changes errorText', async () => {
  const view = (errorText: string) => (
    <CharacterCount.Root maxLength={5} defaultValue="abcdef" errorText={errorText}>
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>
  )
  const screen = await render(view('Too many characters.'))
  const input = screen.getByRole('textbox').element() as HTMLInputElement
  expect(input.validationMessage).toBe('Too many characters.')
  await screen.rerender(view('Please shorten this text.'))
  await vi.waitFor(() => expect(input.validationMessage).toBe('Please shorten this text.'))
  await userEvent.fill(input, 'abcd')
  await vi.waitFor(() => expect(input.validationMessage).toBe(''))
})

it('preserves another validator when the owner changes errorText', async () => {
  const view = (errorText: string) => (
    <CharacterCount.Root maxLength={5} defaultValue="abcdef" errorText={errorText}>
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>
  )
  const screen = await render(view('Too many characters.'))
  const input = screen.getByRole('textbox').element() as HTMLInputElement
  expect(input.validationMessage).toBe('Too many characters.')
  input.setCustomValidity('Please correct this field.')
  await screen.rerender(view('Please shorten this text.'))
  await userEvent.fill(input, 'abcdefg')
  expect(input.validationMessage).toBe('Please correct this field.')
  await userEvent.fill(input, 'abcd')
  expect(input.validationMessage).toBe('Please correct this field.')
})
