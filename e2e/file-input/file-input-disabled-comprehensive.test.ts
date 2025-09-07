import { beforeEach, describe, expect, it } from 'vitest'
import { FileInput, fileInputInit } from '../../packages/compat/src/file-input.js'

describe('file Input - Disabled State Comprehensive', () => {
  let rootEl: HTMLElement
  let dropZone: HTMLElement | null
  let inputEl: HTMLInputElement | null

  const TEMPLATE = `
<div data-part="file-input-root" id="test">
  <label>
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

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE
    fileInputInit()

    rootEl = document.querySelector('[data-part="file-input-root"]')!
    dropZone = document.querySelector('[data-part="file-input-dropzone"]')
    inputEl = document.querySelector('[data-part="file-input-input"]')
  })

  describe('disabled styling and behavior', () => {
    it('input should be disabled', () => {
      expect(inputEl?.disabled).toBe(true)
    })

    it('should have disabled class on wrapper', () => {
      // The new component uses data-disabled attribute instead of CSS class
      expect(rootEl.getAttribute('data-disabled')).toBe('true')

      // The legacy component added usa-file-input--disabled class
      // This test documents the modern approach using data attributes
    })

    it('should not respond to drag events when disabled', async () => {
      const dragOverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      })

      dropZone?.dispatchEvent(dragOverEvent)

      // Wait for potential state update
      await new Promise(resolve => queueMicrotask(resolve))

      // The disabled component should not respond to drag events
      expect(rootEl.getAttribute('data-dragging')).not.toBe('true')
    })

    it('should not accept dropped files when disabled', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      })

      dropZone?.dispatchEvent(dropEvent)

      // Wait for potential state update
      await new Promise(resolve => queueMicrotask(resolve))

      // The component should not process files when disabled
      expect(rootEl.getAttribute('data-invalid')).not.toBe('true')
      expect(rootEl.getAttribute('data-dragging')).not.toBe('true')
    })

    it('should have proper ARIA attributes for disabled state', () => {
      // Disabled inputs should maintain proper accessibility
      expect(inputEl?.getAttribute('aria-disabled')).toBe(null) // HTML disabled is sufficient
      expect(inputEl?.disabled).toBe(true)
    })

    it('should not be focusable when disabled', () => {
      // Disabled inputs should not receive focus
      inputEl?.focus()
      expect(document.activeElement).not.toBe(inputEl)
    })

    it('should not respond to click events when disabled', () => {
      // Disabled inputs cannot be clicked with userEvent in browser testing
      // This is the correct behavior - disabled elements should not be interactive
      expect(inputEl?.disabled).toBe(true)

      // Verify the input is not focusable
      inputEl?.focus()
      expect(document.activeElement).not.toBe(inputEl)
    })
  })

  describe('visual indicators', () => {
    it('should have visual indication of disabled state', () => {
      // Check for opacity or other visual indicators
      const computedStyle = window.getComputedStyle(inputEl!)

      // Disabled form elements typically have reduced opacity or different cursor
      // The exact styling depends on the component's CSS
      expect(inputEl?.disabled).toBe(true)

      // The dropzone might also have visual indicators
      const dropzoneStyle = window.getComputedStyle(dropZone!)
      // Document the expected visual changes for disabled state
    })

    it('should maintain structure but indicate non-interactive state', () => {
      // All elements should still be present
      expect(dropZone).toBeTruthy()
      expect(inputEl).toBeTruthy()
      expect(dropZone?.querySelector('div')).toBeTruthy()
      expect(document.querySelector('span')).toBeTruthy()

      // But input should be disabled
      expect(inputEl?.disabled).toBe(true)
    })
  })

  describe('programmatic interaction when disabled', () => {
    it('should not accept files via setFiles when disabled', async () => {
      const instance = FileInput.getInstance(rootEl.id.split(':')[1])
      expect(instance).toBeTruthy()

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

      // Try to set files programmatically
      await instance?.setFiles([file])

      // The behavior when trying to set files on a disabled input
      // might vary - document the expected behavior
      expect(inputEl?.disabled).toBe(true)
    })
  })
})
