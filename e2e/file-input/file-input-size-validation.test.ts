import { beforeEach, describe, expect, it } from 'vitest'
import { FileInput, fileInputInit } from '../../packages/compat/src/file-input.js'

describe('file Input - Size Validation', () => {
  let rootEl: HTMLElement
  let errorMessage: HTMLElement | null

  const template = (minSize?: string, maxSize?: string) => `
<div data-part="file-input-root" id="test">
  <label>
    Upload files with size restrictions
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
        ${minSize ? `data-min-size="${minSize}"` : ''}
        ${maxSize ? `data-max-size="${maxSize}"` : ''}
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
    const content = Array.from({ length: size }).fill('a').join('')
    const file = new File([content], name, {
      type: mimeType,
      lastModified: Date.now(),
    })
    return file
  }

  describe('minimum file size validation', () => {
    const minSize = 1024 // 1KB

    beforeEach(() => {
      document.body.innerHTML = template(minSize.toString())
      fileInputInit()

      rootEl = document.querySelector('[data-part="file-input-root"]')!
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')
    })

    it('should reject files smaller than minimum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const smallFile = createMockFile('small.txt', 512, 'text/plain') // 512 bytes < 1KB
      await instance?.setFiles([smallFile])

      expect(rootEl.getAttribute('data-invalid')).toBe('true')
      expect(errorMessage?.textContent).toBe(`The selected file must be larger than ${minSize}.`)
    })

    it('should accept files equal to minimum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const validFile = createMockFile('valid.txt', 1024, 'text/plain') // Exactly 1KB
      await instance?.setFiles([validFile])

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })

    it('should accept files larger than minimum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const largeFile = createMockFile('large.txt', 2048, 'text/plain') // 2KB > 1KB
      await instance?.setFiles([largeFile])

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })
  })

  describe('maximum file size validation', () => {
    const maxSize = 1024 * 1024 // 1MB

    beforeEach(() => {
      document.body.innerHTML = template(undefined, maxSize.toString())
      fileInputInit()

      rootEl = document.querySelector('[data-part="file-input-root"]')!
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')
    })

    it('should accept files smaller than maximum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const smallFile = createMockFile('small.txt', 512 * 1024, 'text/plain') // 512KB < 1MB
      await instance?.setFiles([smallFile])

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })

    it('should accept files equal to maximum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const validFile = createMockFile('valid.txt', 1024 * 1024, 'text/plain') // Exactly 1MB
      await instance?.setFiles([validFile])

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })

    it('should reject files larger than maximum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const largeFile = createMockFile('large.txt', 2 * 1024 * 1024, 'text/plain') // 2MB > 1MB
      await instance?.setFiles([largeFile])

      expect(rootEl.getAttribute('data-invalid')).toBe('true')
      expect(errorMessage?.textContent).toBe(`The selected file must be smaller than ${maxSize}.`)
    })
  })

  describe('combined min and max file size validation', () => {
    const minSize = 1024 // 1KB
    const maxSize = 1024 * 1024 // 1MB

    beforeEach(() => {
      document.body.innerHTML = template(minSize.toString(), maxSize.toString())
      fileInputInit()

      rootEl = document.querySelector('[data-part="file-input-root"]')!
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')
    })

    it('should reject files smaller than minimum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const tooSmallFile = createMockFile('tiny.txt', 512, 'text/plain') // 512 bytes < 1KB
      await instance?.setFiles([tooSmallFile])

      expect(rootEl.getAttribute('data-invalid')).toBe('true')
      expect(errorMessage?.textContent).toBe(`The selected file must be larger than ${minSize}.`)
    })

    it('should reject files larger than maximum size', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const tooLargeFile = createMockFile('huge.txt', 2 * 1024 * 1024, 'text/plain') // 2MB > 1MB
      await instance?.setFiles([tooLargeFile])

      expect(rootEl.getAttribute('data-invalid')).toBe('true')
      expect(errorMessage?.textContent).toBe(`The selected file must be smaller than ${maxSize}.`)
    })

    it('should accept files within the size range', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const validFile = createMockFile('valid.txt', 100 * 1024, 'text/plain') // 100KB (between 1KB and 1MB)
      await instance?.setFiles([validFile])

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })
  })

  describe('multiple files with size validation', () => {
    const maxSize = 1024 * 1024 // 1MB

    beforeEach(() => {
      document.body.innerHTML = template(undefined, maxSize.toString())
      fileInputInit()

      rootEl = document.querySelector('[data-part="file-input-root"]')!
      errorMessage = document.querySelector('[data-part="file-input-error-message"]')
    })

    it('should reject if any file exceeds size limit', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const validFile = createMockFile('valid.txt', 500 * 1024, 'text/plain') // 500KB - OK
      const invalidFile = createMockFile('large.txt', 2 * 1024 * 1024, 'text/plain') // 2MB - Too large

      await instance?.setFiles([validFile, invalidFile])

      expect(rootEl.getAttribute('data-invalid')).toBe('true')
      expect(errorMessage?.textContent).toBe(`The selected file must be smaller than ${maxSize}.`)
    })

    it('should accept if all files are within size limit', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const file1 = createMockFile('file1.txt', 500 * 1024, 'text/plain') // 500KB - OK
      const file2 = createMockFile('file2.txt', 300 * 1024, 'text/plain') // 300KB - OK

      await instance?.setFiles([file1, file2])

      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(errorMessage?.textContent).toBe('')
    })
  })
})
