import { expect, it } from 'vitest'
import { createDisposableFileInput } from './_utils.js'

const rootId = 'single-file-test'

const template = `
  <div data-part="file-input-root" id="${rootId}">
    <label data-part="file-input-label">Single file input</label>
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
          accept=".pdf,.txt"
        />
      </div>
    </div>
  </div>
`

it('uses singular "file" if there is not a "multiple" attribute', () => {
  using component = createDisposableFileInput(rootId, template)
  const dragText = component.elements.getInstructionsEl()
  expect(dragText?.textContent).toContain('Drag file here or')
})
