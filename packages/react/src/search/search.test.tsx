import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { Search } from './search'

it('search works standalone', async () => {
  const screen = await render(
    <Search.Root>
      <Search.Label>Search</Search.Label>
      <Search.Input />
      <Search.Button>Go</Search.Button>
    </Search.Root>,
  )

  await expect.element(screen.getByRole('searchbox')).toBeVisible()
})

it('field.Label htmlFor matches Search.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Search</Field.Label>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  const label = screen.getByText('Search')
  const input = screen.getByRole('searchbox')
  expect(label.element().getAttribute('for')).toBe(input.element().id)
})

it('search inherits disabled from Field.Root', async () => {
  const screen = await render(
    <Field.Root disabled>
      <Field.Label>Search</Field.Label>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('searchbox')).toBeDisabled()
})

it('search inherits invalid from Field.Root', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Search</Field.Label>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  await expect.element(screen.getByRole('searchbox')).toHaveAttribute('aria-invalid', 'true')
})

it('field.Description id is referenced by Search.Input aria-describedby', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Search</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('searchbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
})

it('field.ErrorMessage id is referenced by Search.Input aria-describedby when invalid', async () => {
  const screen = await render(
    <Field.Root invalid>
      <Field.Label>Search</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('searchbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Search</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  const input = screen.getByRole('searchbox')
  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).not.toHaveAccessibleDescription(/Required/)

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Search</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <Search.Root>
        <Search.Input />
        <Search.Button>Go</Search.Button>
      </Search.Root>
    </Field.Root>,
  )

  await expect.element(input).toHaveAccessibleDescription(/Help text/)
  await expect.element(input).toHaveAccessibleDescription(/Required/)
})
