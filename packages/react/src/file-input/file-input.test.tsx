import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Field } from '../field/field'
import { FileInput } from './file-input'

it('fileInput works standalone', async () => {
  await render(
    <FileInput.Root>
      <FileInput.Label>Upload</FileInput.Label>
      <FileInput.Input />
    </FileInput.Root>,
  )

  const label = document.querySelector('label')!
  const input = document.querySelector('input[type="file"]')!

  expect(label.htmlFor).toBeTruthy()
  expect(label.htmlFor).toBe(input.id)
})

it('field.Label htmlFor matches FileInput.Input id', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Upload</Field.Label>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  const label = screen.getByText('Upload')
  const input = document.querySelector('input[type="file"]')!

  const labelFor = label.element().getAttribute('for')
  expect(labelFor).toBeTruthy()
  expect(labelFor).toBe(input.id)
})

it('fileInput inherits disabled from Field.Root', async () => {
  await render(
    <Field.Root disabled>
      <Field.Label>Upload</Field.Label>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  const input = document.querySelector('input[type="file"]')! as HTMLInputElement
  expect(input.disabled).toBe(true)
})

it('fileInput inherits invalid from Field.Root', async () => {
  await render(
    <Field.Root invalid>
      <Field.Label>Upload</Field.Label>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  const input = document.querySelector('input[type="file"]')!
  expect(input.getAttribute('aria-invalid')).toBe('true')
})

it('field.Description id is referenced by FileInput aria-describedby', async () => {
  await render(
    <Field.Root>
      <Field.Label>Upload</Field.Label>
      <Field.Description>Help text</Field.Description>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  const description = document.querySelector('[data-part="description"]')!
  const input = document.querySelector('input[type="file"]')!
  expect(description.id).toBeTruthy()
  expect(input.getAttribute('aria-describedby')).toContain(description.id)
})

it('field.ErrorMessage id is referenced by FileInput aria-describedby when invalid', async () => {
  await render(
    <Field.Root invalid>
      <Field.Label>Upload</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  const errorMessage = document.querySelector('[data-part="error-text"]')!
  const input = document.querySelector('input[type="file"]')!
  expect(errorMessage.id).toBeTruthy()
  expect(input.getAttribute('aria-describedby')).toContain(errorMessage.id)
})

it('aria-describedby updates when invalid is set dynamically', async () => {
  const screen = await render(
    <Field.Root>
      <Field.Label>Upload</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  expect(document.querySelector('[data-part="error-text"]')).toBeNull()

  await screen.rerender(
    <Field.Root invalid>
      <Field.Label>Upload</Field.Label>
      <Field.Description>Help text</Field.Description>
      <Field.ErrorMessage>Required</Field.ErrorMessage>
      <FileInput.Root>
        <FileInput.Input />
      </FileInput.Root>
    </Field.Root>,
  )

  const errorMessage = document.querySelector('[data-part="error-text"]')!
  const input = document.querySelector('input[type="file"]')!
  expect(errorMessage.id).toBeTruthy()
  expect(input.getAttribute('aria-describedby')).toContain(errorMessage.id)
})

it('renders dropzone instruction text', async () => {
  const screen = await render(
    <FileInput.Root>
      <FileInput.Label>Upload</FileInput.Label>
      <FileInput.Dropzone>
        <FileInput.Instructions />
        <FileInput.Input />
      </FileInput.Dropzone>
    </FileInput.Root>,
  )
  await expect.element(screen.getByText(/Drag file here or/)).toBeVisible()
})

it('file input has name attribute for form submission', async () => {
  await render(
    <FileInput.Root>
      <FileInput.Input name="upload" />
    </FileInput.Root>,
  )
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.name).toBe('upload')
})
