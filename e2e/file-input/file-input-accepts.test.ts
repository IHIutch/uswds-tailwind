import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableFileInput } from './_utils.js'

const defaultErrorMessage = 'Error: This is not a valid file type.'
const customErrorMessage = 'Please upload a valid file'
const rootId = 'test'

const template = `
<div data-scope="file-input" data-part="root" id="${rootId}">
  <label data-part="label">Input accepts only specific file types</label>
  <div data-part="error-text"></div>
  <div>
    <div data-part="sr-status" aria-live="polite">
      No file selected.
    </div>
    <div data-part="dropzone">
      <div data-part="preview-list">
        <div>
          <div data-part="preview-heading"></div>
        </div>
        <div data-part="item">
          <img data-part="item-preview-image" />
          <div data-file-name></div>
        </div>
      </div>
      <div data-part="instructions">
        <span data-part="drag-text">Drag files here or</span>
        <span data-part="choose">choose from folder</span>
      </div>
      <input
        data-part="input"
        type="file"
        accept=".pdf,.txt"
        multiple
      />
    </div>
  </div>
</div>
`

function createMockFile(name: string, size: number, mimeType: string): File {
  const content = Array.from({ length: size }, () => 'a').join('')
  const file = new File([content], name, {
    type: mimeType,
    lastModified: Date.now(),
  })
  return file
}

const size = 1024 * 1024 * 2 // 2MB
const invalidFile = createMockFile('pic.jpg', size, 'image/jpeg')

it('target ui is created', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, template)
  const dropZone = component.elements.getDropzoneEl()

  expect(dropZone).toBeTruthy()
  expect(dropZone?.getAttribute('data-part')).toBe('dropzone')
})

it('input element exists', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, template)
  const inputEl = component.elements.getInputEl()

  expect(inputEl).toBeTruthy()
  expect(inputEl?.getAttribute('data-part')).toBe('input')
})

it('pluralizes "files" if there is a "multiple" attribute', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, template)
  const dragText = component.elements.getInstructionsEl()

  expect(dragText?.textContent).toContain('Drag files here or')
})

it('mock file should be defined with specific values', { tags: ['legacy'] }, () => {
  expect(invalidFile).toBeTruthy()
  expect(invalidFile.name).toBe('pic.jpg')
  expect(invalidFile.size).toBe(size)
  expect(invalidFile.type).toBe('image/jpeg')
})

it('mock file should not be allowed', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, template)
  await userEvent.upload(component.elements.getInputEl()!, invalidFile)

  const dropzone = component.elements.getDropzoneEl()!
  expect(dropzone.hasAttribute('data-invalid')).toBe(true)
})

it('should provide a default error message for invalid file type', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, template)
  await userEvent.upload(component.elements.getInputEl()!, invalidFile)

  const errorMessage = component.elements.getErrorMessageEl()!
  const dropzone = component.elements.getDropzoneEl()!

  expect(errorMessage?.textContent).toBe(defaultErrorMessage)
  expect(dropzone.hasAttribute('data-invalid')).toBe(true)
  expect(errorMessage?.hasAttribute('data-invalid')).toBe(true)
})

it('should allow a custom error message for invalid file type', { tags: ['legacy'] }, async () => {
  // Create template with custom error message
  const customTemplate = `
<div data-scope="file-input" data-part="root" id="${rootId}">
  <label data-part="label">Input accepts only specific file types</label>
  <div data-part="error-text"></div>
  <div>
    <div data-part="sr-status" aria-live="polite">
      No file selected.
    </div>
    <div data-part="dropzone">
      <div data-part="preview-list">
        <div>
          <div data-part="preview-heading"></div>
        </div>
        <div data-part="item">
          <img data-part="item-preview-image" />
          <div data-file-name></div>
        </div>
      </div>
      <div data-part="instructions">
        <span data-part="drag-text">Drag files here or</span>
        <span data-part="choose">choose from folder</span>
      </div>
      <input
        data-part="input"
        type="file"
        accept=".pdf,.txt"
        multiple
        data-errormessage="${customErrorMessage}"
      />
    </div>
  </div>
</div>
`

  await using component = createDisposableFileInput(rootId, customTemplate)

  await userEvent.upload(component.elements.getInputEl()!, invalidFile)

  const dropzone = component.elements.getDropzoneEl()!
  const errorMessage = component.elements.getErrorMessageEl()

  expect(errorMessage?.textContent).toBe(customErrorMessage)
  expect(dropzone.hasAttribute('data-invalid')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L389-L410 (selection heading)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L439-L499 (render selected filenames and previews)
it('renders a native file selection in the authored preview list', { tags: ['parity'] }, async () => {
  using component = createDisposableFileInput(rootId, template)
  const input = component.elements.getInputEl()!
  const selected = new File(['file contents'], 'report.pdf', { type: 'application/pdf' })
  await userEvent.upload(input, selected)

  await vi.waitFor(() => {
    expect(component.elements.getPreviewListEl()?.querySelectorAll('[data-part="item"]')).toHaveLength(1)
    expect(component.elements.getPreviewListEl()?.hasAttribute('data-valid')).toBe(true)
    expect(component.elements.getPreviewItemContentEl('report.pdf')?.textContent).toBe('report.pdf')
    expect(component.elements.getPreviewHeaderEl()?.textContent).toBe('Selected file Change file')
  })
})
