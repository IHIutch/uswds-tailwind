import { expect, it } from 'vitest'
import { FileInput } from '../../packages/compat/src/file-input.js'
import { createDisposableFileInput } from './_utils.js'

const defaultErrorMessage = 'Error: This is not a valid file type.'
const customErrorMessage = 'Please upload a valid file'
const rootId = 'test'

const template = `
<div data-part="file-input-root" id="${rootId}">
  <label data-part="file-input-label">Input accepts only specific file types</label>
  <div data-part="file-input-error-message"></div>
  <div>
    <div data-part="file-input-sr-status" aria-live="polite">
      No file selected.
    </div>
    <div data-part="file-input-dropzone">
      <div data-part="file-input-preview-list">
        <div>
          <div data-part="file-input-preview-header"></div>
        </div>
        <div data-part="file-input-preview-item">
          <div data-part="file-input-preview-item-icon"></div>
          <div data-part="file-input-preview-item-content"></div>
        </div>
      </div>
      <div data-part="file-input-instructions">
        <span>Drag files here or</span>
        <span>choose from folder</span>
      </div>
      <input
        data-part="file-input-input"
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

it('target ui is created', () => {
  using component = createDisposableFileInput(rootId, template)
  const dropZone = component.elements.getDropzoneEl()

  expect(dropZone).toBeTruthy()
  expect(dropZone?.getAttribute('data-part')).toBe('file-input-dropzone')
})

it('input element exists', () => {
  using component = createDisposableFileInput(rootId, template)
  const inputEl = component.elements.getInputEl()

  expect(inputEl).toBeTruthy()
  expect(inputEl?.getAttribute('data-part')).toBe('file-input-input')
})

it('pluralizes "files" if there is a "multiple" attribute', () => {
  using component = createDisposableFileInput(rootId, template)
  const dragText = component.elements.getInstructionsEl()

  expect(dragText?.textContent).toContain('Drag files here or')
})

it('mock file should be defined with specific values', () => {
  expect(invalidFile).toBeTruthy()
  expect(invalidFile.name).toBe('pic.jpg')
  expect(invalidFile.size).toBe(size)
  expect(invalidFile.type).toBe('image/jpeg')
})

it('mock file should not be allowed', async () => {
  using component = createDisposableFileInput(rootId, template)
  const instance = FileInput.getInstance(rootId)

  await instance?.setFiles([invalidFile])
  expect(instance).toBeTruthy()

  const rootEl = component.elements.getRootEl()!
  expect(rootEl.getAttribute('data-invalid')).toBeDefined()
})

it('should provide a default error message for invalid file type', async () => {
  using component = createDisposableFileInput(rootId, template)
  const instance = FileInput.getInstance(rootId)

  await instance?.setFiles([invalidFile])

  const errorMessage = component.elements.getErrorMessageEl()!
  const rootEl = component.elements.getRootEl()!

  expect(errorMessage?.textContent).toBe(defaultErrorMessage)
  expect(rootEl.getAttribute('data-invalid')).toBeDefined()
})

it('should allow a custom error message for invalid file type', async () => {
  // Create template with custom error message
  const customTemplate = `
<div data-part="file-input-root" id="${rootId}">
  <label data-part="file-input-label">Input accepts only specific file types</label>
  <div data-part="file-input-error-message"></div>
  <div>
    <div data-part="file-input-sr-status" aria-live="polite">
      No file selected.
    </div>
    <div data-part="file-input-dropzone">
      <div data-part="file-input-preview-list">
        <div>
          <div data-part="file-input-preview-header"></div>
        </div>
        <div data-part="file-input-preview-item">
          <div data-part="file-input-preview-item-icon"></div>
          <div data-part="file-input-preview-item-content"></div>
        </div>
      </div>
      <div data-part="file-input-instructions">
        <span>Drag files here or</span>
        <span>choose from folder</span>
      </div>
      <input
        data-part="file-input-input"
        type="file"
        accept=".pdf,.txt"
        multiple
        data-errormessage="${customErrorMessage}"
      />
    </div>
  </div>
</div>
`

  using component = createDisposableFileInput(rootId, customTemplate)

  const instance = FileInput.getInstance(rootId)

  await instance?.setFiles([invalidFile])

  const rootEl = component.elements.getRootEl()!
  const errorMessage = component.elements.getErrorMessageEl()

  expect(errorMessage?.textContent).toBe(customErrorMessage)
  expect(rootEl.getAttribute('data-invalid')).toBeDefined()
})
