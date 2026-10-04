import { getFileId } from '@uswds-tailwind/file-input-compat'
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

it('keeps the sr-status unchanged when unrelated content rerenders', async () => {
  const view = (label: string) => (
    <FileInput.Root>
      <FileInput.Label>{label}</FileInput.Label>
      <FileInput.SrStatus />
      <FileInput.Input />
    </FileInput.Root>
  )
  const screen = await render(view('Before'))
  const status = screen.getByRole('status').element()
  const mutations: MutationRecord[] = []
  const observer = new MutationObserver(records => mutations.push(...records))
  observer.observe(status, { attributes: true, childList: true, characterData: true, subtree: true })

  try {
    await screen.rerender(view('After'))

    await expect.element(screen.getByText('After')).toBeVisible()
    expect(screen.getByRole('status').element()).toBe(status)
    expect(status.textContent).toBe('No file selected.')
    expect([...mutations, ...observer.takeRecords()]).toEqual([])
  }
  finally {
    observer.disconnect()
  }
})

it('disabled prop disables the underlying input', async () => {
  await renderFileInput({ disabled: true })
  // The input is visually hidden; locate by type=file via the DOM directly.
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.disabled).toBe(true)
})

it('announces a selected file after the input is disabled and re-enabled', async () => {
  const view = (disabled: boolean) => (
    <FileInput.Root disabled={disabled}>
      <FileInput.SrStatus />
      <FileInput.Input />
    </FileInput.Root>
  )
  const screen = await render(view(false))
  const input = document.querySelector('input[type="file"]') as HTMLInputElement

  await screen.rerender(view(true))
  expect(input).toBeDisabled()

  await screen.rerender(view(false))
  expect(input).not.toBeDisabled()

  await userEvent.upload(input, createMockFile('report.pdf', 'application/pdf'))
  const status = screen.getByRole('status')
  await expect.element(status).toHaveAttribute('aria-live', 'polite')
  await expect.element(status, { timeout: 2000 }).toHaveTextContent('You have selected the file: report.pdf')
})

it('accept prop is forwarded to the underlying input', async () => {
  await renderFileInput({ accept: '.pdf,.txt' })
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.accept).toBe('.pdf,.txt')
})

it('multiple prop is forwarded to the underlying input', async () => {
  await renderFileInput({ multiple: true })
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.multiple).toBe(true)
})

it('updates the preview and accessible name together when replacing or clearing files', async () => {
  const screen = await render(
    <FileInput.Root>
      <FileInput.Input />
      <FileInput.Instructions />
      <FileInput.ItemGroup>
        {({ acceptedFiles }) => acceptedFiles.map((file, index) => <span key={`${getFileId(file)}-${index}`}>{file.name}</span>)}
      </FileInput.ItemGroup>
    </FileInput.Root>,
  )
  const input = document.querySelector('input[type="file"]') as HTMLInputElement

  await userEvent.upload(input, createMockFile('first.txt', 'text/plain'))
  await expect.element(screen.getByText('first.txt')).toBeVisible()
  expect(input.getAttribute('aria-label')).toBe('Change file')

  await userEvent.upload(input, createMockFile('second.txt', 'text/plain'))
  await expect.element(screen.getByText('second.txt')).toBeVisible()
  await expect.element(screen.getByText('first.txt')).not.toBeInTheDocument()
  expect(input.getAttribute('aria-label')).toBe('Change file')

  await userEvent.upload(input, [])
  await expect.element(screen.getByText('second.txt')).not.toBeInTheDocument()
  await expect.element(screen.getByText(/Drag file here or/)).toBeVisible()
  expect(input.getAttribute('aria-label')).toBe('Drag file here or choose from folder')
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

  // USWDS marks the drop target when the selected file type is rejected.
  const dropzone = document.querySelector('[data-scope="file-input"][data-part="dropzone"]')
  expect(dropzone?.hasAttribute('data-invalid')).toBe(true)

  // Error message is rendered
  await expect.element(screen.getByText(/not a valid file type/i)).toBeInTheDocument()
})

it('shows distinct previews for files with identical metadata', async () => {
  await render(
    <FileInput.Root multiple>
      <FileInput.Input />
      <FileInput.ItemGroup>
        {({ acceptedFiles }) => acceptedFiles.map((file, index) => (
          <FileInput.Item key={`${getFileId(file)}-${index}`} file={file}>
            <FileInput.ItemPreview>
              <FileInput.ItemPreviewImage />
              <FileInput.ItemName />
            </FileInput.ItemPreview>
          </FileInput.Item>
        ))}
      </FileInput.ItemGroup>
    </FileInput.Root>,
  )
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  const files = [2, 3].map(width => new File([
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="2"></svg>`,
  ], 'photo.svg', { type: 'image/svg+xml', lastModified: 1 }))

  await userEvent.upload(input, files)
  await expect.poll(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('[data-part="item-preview-image"]'))
    return images.map(image => image.naturalWidth).sort()
  }).toEqual([2, 3])
  await userEvent.upload(input, [files[1]!])
  await expect.poll(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('[data-part="item-preview-image"]'))
    return images.map(image => image.naturalWidth)
  }).toEqual([3])
})
