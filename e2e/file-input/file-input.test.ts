import { expect, it } from 'vitest'
import { createDisposableFileInput } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
<div data-part="file-input-root" id="${rootId}">
  <label data-part="file-input-label">
    Input accepts multiple files
  </label>
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
        multiple
      />
    </div>
  </div>
</div>
`

it('target ui is created', () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const dropZone = component.elements.getDropzoneEl()
  expect(dropZone).toBeTruthy()
  expect(dropZone?.getAttribute('data-part')).toBe('file-input-dropzone')
})

it('input element exists', () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const inputEl = component.elements.getInputEl()
  expect(inputEl).toBeTruthy()
  expect(inputEl?.getAttribute('data-part')).toBe('file-input-input')
})

it('box is created', () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const dropZone = component.elements.getDropzoneEl()!
  const box = dropZone.querySelector('div')!
  expect(box).toBeTruthy()
})

it('pluralizes "files" if there is a "multiple" attribute', () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const dragText = component.elements.getInstructionsEl()
  expect(dragText?.textContent).toContain('Drag files here or')
})

it('creates a status message element', () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const statusMessage = component.elements.getSrStatusEl()
  expect(statusMessage).toBeTruthy()
  expect(statusMessage?.getAttribute('aria-live')).toBe('polite')
})

it('adds a default status message', () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const statusMessage = component.elements.getSrStatusEl()
  expect(statusMessage?.innerHTML?.trim()).toBe('No file selected.')
})

const disabledTemplate = `
<div data-part="file-input-root" id="disabled-test">
  <label data-part="file-input-label">
    Input in a disabled state
  </label>
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
        <span>Drag file here or</span>
        <span>choose from folder</span>
      </div>
      <input
        data-part="file-input-input"
        type="file"
        disabled
      />
    </div>
  </div>
</div>
`

it('has disabled styling', () => {
  using component = createDisposableFileInput('disabled-test', disabledTemplate)
  const inputEl = component.elements.getInputEl()

  expect(inputEl).toBeDisabled()
})
