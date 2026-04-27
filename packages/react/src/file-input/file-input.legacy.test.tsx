import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { FileInput } from './file-input'

// Behavioral parity tests mirroring e2e/file-input/file-input.test.ts + single-file-input.test.ts + file-input-accepts.test.ts.

function renderFileInput({ multiple = false, accept, disabled }: { multiple?: boolean, accept?: string, disabled?: boolean } = {}) {
  return render(
    <FileInput.Root multiple={multiple} accept={accept} disabled={disabled}>
      <FileInput.Label>File input</FileInput.Label>
      <FileInput.SrStatus />
      <FileInput.Dropzone>
        <FileInput.Instructions />
        <FileInput.ErrorMessage>This is not a valid file type.</FileInput.ErrorMessage>
        <FileInput.Input />
      </FileInput.Dropzone>
    </FileInput.Root>,
  )
}

function createMockFile(name: string, type: string): File {
  return new File(['content'], name, { type, lastModified: Date.now() })
}

it('instructions use singular "file" when multiple is false', async () => {
  const screen = await renderFileInput({ multiple: false })
  await expect.element(screen.getByText(/Drag file here or/)).toBeInTheDocument()
})

it('instructions pluralize to "files" when multiple is true', async () => {
  const screen = await renderFileInput({ multiple: true })
  await expect.element(screen.getByText(/Drag files here or/)).toBeInTheDocument()
})

it('sr-status element has aria-live="polite"', async () => {
  const screen = await renderFileInput()
  // Default text is "No file selected." (set by the machine's statusMessage).
  const status = screen.getByText(/No file selected/i)
  await expect.element(status).toHaveAttribute('aria-live', 'polite')
})

it('sr-status has default "No file selected" message on init', async () => {
  const screen = await renderFileInput()
  await expect.element(screen.getByText(/No file selected/i)).toBeInTheDocument()
})

it('disabled prop disables the underlying input', async () => {
  const screen = await renderFileInput({ disabled: true })
  // The input is visually hidden; locate by type=file via the DOM directly.
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.disabled).toBe(true)
})

it('accept prop is forwarded to the underlying input', async () => {
  const screen = await renderFileInput({ accept: '.pdf,.txt' })
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.accept).toBe('.pdf,.txt')
})

it('multiple prop is forwarded to the underlying input', async () => {
  const screen = await renderFileInput({ multiple: true })
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.multiple).toBe(true)
})

// SUGGESTION (review): the `data-invalid` + anatomy-query pair below pins
// to our Zag anatomy and data-attr convention. The error-message text check
// on the line after is already a full behavioral signal (error visible to
// user) — the `data-invalid` assertion duplicates that signal with a more
// brittle anchor. Could drop lines 75-76.
it('uploading an invalid file type sets data-invalid on root and shows error message', async () => {
  const screen = await renderFileInput({ accept: '.pdf,.txt' })
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  const invalidFile = createMockFile('pic.jpg', 'image/jpeg')

  await userEvent.upload(input, invalidFile)

  // Root gets data-invalid (dropzone/input too per anatomy)
  const root = document.querySelector('[data-scope="file-input"][data-part="root"]')
  expect(root?.hasAttribute('data-invalid')).toBe(true)

  // Error message is rendered
  await expect.element(screen.getByText(/not a valid file type/i)).toBeInTheDocument()
})
