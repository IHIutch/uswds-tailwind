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
    <CharacterCount.Root maxLength={100}>
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  const label = screen.getByText('Message')
  const input = screen.getByRole('textbox')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('characterCount inherits disabled from Field.Root', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={100}>
      <Field.Root disabled>
        <Field.Label>Message</Field.Label>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toBeDisabled()
})

it('characterCount inherits invalid from Field.Root', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={100}>
      <Field.Root invalid>
        <Field.Label>Message</Field.Label>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/usa-character-count.twig#L2-L16 (the form group holds the label, hint and input; the hint describes the input, the status does not)
it('field.Description describes CharacterCount.Input', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={100}>
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Field.Description>Keep it brief.</Field.Description>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  await expect.element(screen.getByRole('textbox')).toHaveAccessibleDescription('Keep it brief.')
})

it('field.ErrorMessage id is referenced by CharacterCount aria-describedby when invalid', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={100}>
      <Field.Root invalid>
        <Field.Label>Message</Field.Label>
        <Field.ErrorMessage>Required</Field.ErrorMessage>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={100}>
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Field.ErrorMessage>Required</Field.ErrorMessage>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )

  const input = screen.getByRole('textbox')
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <CharacterCount.Root maxLength={100}>
      <Field.Root invalid>
        <Field.Label>Message</Field.Label>
        <Field.ErrorMessage>Required</Field.ErrorMessage>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
    </CharacterCount.Root>,
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
    <CharacterCount.Root maxLength={20}>
      <Field.Root>
        <Field.Label>{label}</Field.Label>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.SrStatus />
    </CharacterCount.Root>
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

it('honors ids.status and describes the input with inputDescriptionIds and Field.Description', async () => {
  const screen = await render(
    <CharacterCount.Root ids={{ status: 'exact-status' }} inputDescriptionIds="counter-help" maxLength={5}>
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Field.Description>Keep it brief.</Field.Description>
        <CharacterCount.Input />
      </Field.Root>
      <p id="counter-help">You can enter up to 5 characters.</p>
      <CharacterCount.Status />
    </CharacterCount.Root>,
  )
  const input = screen.getByRole('textbox', { name: 'Message' })
  await expect.element(input).toHaveAccessibleDescription('You can enter up to 5 characters. Keep it brief.')
  await input.fill('abcdef')
  await expect.element(screen.getByText('1 character over limit')).toHaveAttribute('id', 'exact-status')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L230-L236 (the form group and label show the error state over the limit)
it('marks the Field root and label invalid over the limit', async () => {
  const screen = await render(
    <CharacterCount.Root maxLength={5}>
      <Field.Root data-testid="field">
        <Field.Label>Message</Field.Label>
        <CharacterCount.Input />
      </Field.Root>
    </CharacterCount.Root>,
  )
  const input = screen.getByRole('textbox', { name: 'Message' })
  await input.fill('abcdef')
  await expect.element(screen.getByTestId('field')).toHaveAttribute('data-invalid')
  await expect.element(screen.getByText('Message')).toHaveAttribute('data-invalid')
  await expect.element(input).not.toHaveAttribute('aria-invalid')
  await input.fill('abc')
  await expect.element(screen.getByTestId('field')).not.toHaveAttribute('data-invalid')
  await expect.element(screen.getByText('Message')).not.toHaveAttribute('data-invalid')
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
