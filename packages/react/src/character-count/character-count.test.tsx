import * as React from 'react'
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

it.each([undefined, 'exact-counter'])('uses id as the machine namespace and ids.root as the DOM override (%s)', async (rootId) => {
  const screen = await render(
    <CharacterCount.Root id="counter" ids={rootId ? { root: rootId } : undefined} maxLength={5}>
      <CharacterCount.Input />
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )
  const expectedRootId = rootId ?? 'character-count:counter'
  const input = screen.getByRole('textbox').element() as HTMLInputElement
  expect(document.getElementById(expectedRootId)).toContainElement(input)
  expect(input.id).toBe('character-count:counter:input')
  await screen.getByRole('textbox').fill('abcdef')
  await expect.element(screen.getByText('1 character over limit')).toBeVisible()
  expect(input.validationMessage).toBe('The content is too long.')
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

it('shows a value the owner sets after the user has typed', async () => {
  const view = (value: string) => (
    <CharacterCount.Root maxLength={5} value={value} onValueChange={() => {}}>
      <CharacterCount.Input />
    </CharacterCount.Root>
  )
  const screen = await render(view('abc'))
  const input = screen.getByRole('textbox')
  await userEvent.fill(input, 'abcd')
  await screen.rerender(view(''))
  await expect.element(input).toHaveValue('')
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

it('honors ids.status inside Field and keeps the counter accessible while typing', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <p id="counter-help">Keep it brief.</p>
      <CharacterCount.Root ids={{ status: 'exact-status' }} inputDescriptionIds="counter-help" maxLength={5}>
        <CharacterCount.Input />
        <CharacterCount.Status />
      </CharacterCount.Root>
    </Field.Root>,
  )
  const input = screen.getByRole('textbox', { name: 'Message' })
  await expect.element(screen.getByText('5 characters allowed')).toHaveAttribute('id', 'exact-status')
  await expect.element(input).toHaveAccessibleDescription('Keep it brief. 5 characters allowed')
  await input.fill('abcdef')
  await expect.element(screen.getByText('1 character over limit')).toHaveAttribute('id', 'exact-status')
  await expect.element(input).toHaveAccessibleDescription('Keep it brief. 1 character over limit')
  expect((input.element() as HTMLInputElement).validationMessage).toBe('The content is too long.')
})

function ControlledCharacterCount() {
  const [value, setValue] = React.useState('hello world')
  return (
    <CharacterCount.Root maxLength={20} value={value} onValueChange={details => setValue(details.value)}>
      <CharacterCount.Input />
    </CharacterCount.Root>
  )
}

it.each([
  ['uncontrolled', <CharacterCount.Root key="uncontrolled" maxLength={20} defaultValue="hello world"><CharacterCount.Input /></CharacterCount.Root>],
  ['controlled', <ControlledCharacterCount key="controlled" />],
])('keeps the caret in place when typing mid-text (%s)', async (_, ui) => {
  const screen = await render(ui)
  const input = screen.getByRole('textbox')
  const el = input.element() as HTMLInputElement
  el.focus()
  el.setSelectionRange(5, 5)
  await userEvent.keyboard('XY')
  await expect.element(input).toHaveValue('helloXY world')
})
