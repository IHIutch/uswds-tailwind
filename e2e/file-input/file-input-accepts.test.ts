import { beforeEach, describe, expect, it } from 'vitest'
import { FileInput, fileInputInit } from '../../packages/compat/src/file-input.js'

describe('file Input - Accept Types', () => {
  let rootEl: HTMLElement
  let dropZone: HTMLElement | null
  let inputEl: HTMLInputElement | null
  let errorMessage: HTMLElement | null

  const defaultErrorMessage = 'Error: This is not a valid file type.'

  const TEMPLATE = `
<div data-part="file-input-root" id="test">
  <label>Input accepts only specific file types</label>
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

  /**
   * Create a mock file for testing
   */
  function createMockFile(name: string, size: number, mimeType: string): File {
    const content = Array.from({ length: size }, () => 'a').join('')
    const file = new File([content], name, {
      type: mimeType,
      lastModified: Date.now(),
    })
    return file
  }

  describe('file input component should respond to file type on change', () => {
    const size = 1024 * 1024 * 2 // 2MB
    const invalidFile = createMockFile('pic.jpg', size, 'image/jpeg')

    beforeEach(() => {
      document.body.innerHTML = TEMPLATE
      fileInputInit()

      rootEl = document.querySelector('[data-part="file-input-root"]')!
      dropZone = document.querySelector('[data-part="file-input-dropzone"]')
      inputEl = document.querySelector('[data-part="file-input-input"]')
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')
    })

    it('target ui is created', () => {
      expect(dropZone).toBeTruthy()
      expect(dropZone?.getAttribute('data-part')).toBe('file-input-dropzone')
    })

    it('input element exists', () => {
      expect(inputEl).toBeTruthy()
      expect(inputEl?.getAttribute('data-part')).toBe('file-input-input')
    })

    it('pluralizes "files" if there is a "multiple" attribute', () => {
      const dragText = document.querySelector('span')
      expect(dragText?.innerHTML).toBe('Drag files here or')
    })

    it('mock file should be defined with specific values', () => {
      expect(invalidFile).toBeTruthy()
      expect(invalidFile.name).toBe('pic.jpg')
      expect(invalidFile.size).toBe(size)
      expect(invalidFile.type).toBe('image/jpeg')
    })

    it('mock file should not be allowed', async () => {
      // Get the FileInput instance
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      // Use the public method to set files
      await instance?.setFiles([invalidFile])

      // Re-query elements after render
      rootEl = document.querySelector('[data-part="file-input-root"]')!

      expect(rootEl.getAttribute('data-invalid')).toBe('true')
    })

    it('should provide a default error message for invalid file type', async () => {
      // Get the FileInput instance
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      // Use the public method to set files
      await instance?.setFiles([invalidFile])

      // Re-query elements after render
      rootEl = document.querySelector('[data-part="file-input-root"]')!
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')

      expect(errorMessage?.textContent).toBe(defaultErrorMessage)
      expect(rootEl.getAttribute('data-invalid')).toBe('true')
    })

    it('should accept valid file types', async () => {
      const validFile = createMockFile('document.pdf', size, 'application/pdf')

      // Get the FileInput instance
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      // Use the public method to set files
      await instance?.setFiles([validFile])

      // Re-query elements after render
      rootEl = document.querySelector('[data-part="file-input-root"]')!
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })
  })
})
