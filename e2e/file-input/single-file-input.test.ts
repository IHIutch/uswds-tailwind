import { expect, it } from 'vitest'
import { createDisposableFileInput } from './_utils.js'

const rootId = 'single-file-test'

const template = `
  <div data-scope="file-input" data-part="root" id="${rootId}">
    <label data-part="label">Single file input</label>
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
          accept=".pdf,.txt"
        />
      </div>
    </div>
  </div>
`

it('uses singular "file" if there is not a "multiple" attribute', { tags: ['legacy'] }, async () => {
  await using component = createDisposableFileInput(rootId, template)
  const dragText = component.elements.getInstructionsEl()
  expect(dragText?.textContent).toContain('Drag file here or')
})
