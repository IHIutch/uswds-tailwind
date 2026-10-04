import { expect, it } from 'vitest'
import { createDisposableFileInput } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
<div data-scope="file-input" data-part="root" id="${rootId}">
  <label data-part="label">
    Input accepts multiple files
  </label>
  <div data-part="error-text"></div>
  <div>
    <div data-part="sr-status" aria-live="polite">
      No file selected.
    </div>
    <div data-part="dropzone">
      <div data-part="item-group">
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
        multiple
      />
    </div>
  </div>
</div>
`

it('target ui is created', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const dropZone = component.elements.getDropzoneEl()
  expect(dropZone).toBeTruthy()
  expect(dropZone?.getAttribute('data-part')).toBe('dropzone')
})

it('input element exists', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const inputEl = component.elements.getInputEl()
  expect(inputEl).toBeTruthy()
  expect(inputEl?.getAttribute('data-part')).toBe('input')
})

it('box is created', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const dropZone = component.elements.getDropzoneEl()!
  const box = dropZone.querySelector('div')!
  expect(box).toBeTruthy()
})

it('pluralizes "files" if there is a "multiple" attribute', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const dragText = component.elements.getInstructionsEl()
  expect(dragText?.textContent).toContain('Drag files here or')
})

it('creates a status message element', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const statusMessage = component.elements.getSrStatusEl()
  expect(statusMessage).toBeTruthy()
  expect(statusMessage?.getAttribute('aria-live')).toBe('polite')
})

it('adds a default status message', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput(rootId, TEMPLATE)
  const statusMessage = component.elements.getSrStatusEl()
  expect(statusMessage?.innerHTML?.trim()).toBe('No files selected.')
})

const disabledTemplate = `
<div data-scope="file-input" data-part="root" id="disabled-test">
  <label data-part="label">
    Input in a disabled state
  </label>
  <div data-part="error-text"></div>
  <div>
    <div data-part="sr-status" aria-live="polite">
      No file selected.
    </div>
    <div data-part="dropzone">
      <div data-part="item-group">
        <div>
          <div data-part="preview-heading"></div>
        </div>
        <div data-part="item">
          <img data-part="item-preview-image" />
          <div data-file-name></div>
        </div>
      </div>
      <div data-part="instructions">
        <span data-part="drag-text">Drag file here or</span>
        <span data-part="choose">choose from folder</span>
      </div>
      <input
        data-part="input"
        type="file"
        disabled
      />
    </div>
  </div>
</div>
`

it('has disabled styling', { tags: ['legacy'] }, async () => {
  using component = createDisposableFileInput('disabled-test', disabledTemplate)
  const inputEl = component.elements.getInputEl()

  expect(inputEl).toBeDisabled()
})
