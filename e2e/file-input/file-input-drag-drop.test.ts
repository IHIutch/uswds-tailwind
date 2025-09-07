import { beforeEach, describe, expect, it } from 'vitest'
import { fileInputInit } from '../../packages/compat/src/file-input.js'

describe('file Input - Drag and Drop', () => {
  let rootEl: HTMLElement
  let dropZone: HTMLElement | null

  const TEMPLATE = `
<div data-part="file-input-root" id="test">
  <label>
    Drag and drop files
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

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE
    fileInputInit()

    rootEl = document.querySelector('[data-part="file-input-root"]')!
    dropZone = document.querySelector('[data-part="file-input-dropzone"]')
  })

  describe('drag and drop functionality', () => {
    it('should show dragging state on dragover', async () => {
      const file = createMockFile('test.txt', 1024, 'text/plain')

      // Create a drag operation but don't drop yet
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const dragOverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })

      dropZone?.dispatchEvent(dragOverEvent)

      // Wait for state update
      await new Promise(resolve => queueMicrotask(resolve))

      expect(rootEl.getAttribute('data-dragging')).toBe('true')
      expect(dropZone?.getAttribute('data-dragging')).toBe('true')
    })

    it('should remove dragging state on dragleave', async () => {
      const file = createMockFile('test.txt', 1024, 'text/plain')

      // First trigger dragover
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const dragOverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })

      dropZone?.dispatchEvent(dragOverEvent)
      await new Promise(resolve => queueMicrotask(resolve))

      // Then trigger dragleave
      const dragLeaveEvent = new DragEvent('dragleave', {
        bubbles: true,
        cancelable: true,
      })

      dropZone?.dispatchEvent(dragLeaveEvent)
      await new Promise(resolve => queueMicrotask(resolve))

      expect(rootEl.getAttribute('data-dragging')).not.toBe('true')
      expect(dropZone?.getAttribute('data-dragging')).not.toBe('true')
    })

    it('should handle dropped files', async () => {
      const file = createMockFile('test.txt', 1024, 'text/plain')
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })

      dropZone?.dispatchEvent(dropEvent)

      // Wait for state update
      await new Promise(resolve => queueMicrotask(resolve))

      // The component should process the dropped file
      // Since it's a valid file type (no accept attribute), it should be valid
      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(rootEl.getAttribute('data-dragging')).not.toBe('true')
    })

    it('should handle multiple dropped files', async () => {
      const file1 = createMockFile('test1.txt', 1024, 'text/plain')
      const file2 = createMockFile('test2.txt', 2048, 'text/plain')

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file1)
      dataTransfer.items.add(file2)

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })

      dropZone?.dispatchEvent(dropEvent)

      // Wait for state update
      await new Promise(resolve => queueMicrotask(resolve))

      // Both files should be valid
      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
    })
  })
})
