import { beforeEach, describe, expect, it } from 'vitest'
import { fileInputInit } from '../../packages/compat/src/file-input.js'

describe('file input: single file input', () => {
  let dragText: HTMLElement | null

  const TEMPLATE = `
    <div data-part="file-input-root" id="single-file-test">
      <label>Single file input</label>
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

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE
    fileInputInit()
    dragText = document.querySelector('[data-part="file-input-instructions"] span')
  })

  it('uses singular "file" if there is not a "multiple" attribute', () => {
    expect(dragText?.innerHTML).toBe('Drag file here or')
  })
})