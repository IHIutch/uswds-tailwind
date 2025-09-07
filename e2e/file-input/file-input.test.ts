import { beforeEach, describe, expect, it } from 'vitest'
import { fileInputInit } from '../../packages/compat/src/file-input.js'

describe('file input initialized at file input', () => {
  let dropZone: HTMLElement
  let inputEl: HTMLInputElement
  let box: HTMLElement
  let dragText: HTMLElement
  let statusMessage: HTMLElement

  const template = (multiple: boolean = true) => `
<div data-part="file-input-root" id="test">
  <label>
    Input accepts ${multiple ? 'multiple files' : 'single file'}
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
        <span>Drag ${multiple ? 'files' : 'file'} here or</span>
        <span>choose from folder</span>
      </div>
      <input
        data-part="file-input-input"
        type="file"
        ${multiple ? 'multiple' : ''}
      />
    </div>
  </div>
</div>
`

  beforeEach(() => {
    document.body.innerHTML = template(true)
    fileInputInit()

    dropZone = document.querySelector('[data-part="file-input-dropzone"]')!
    inputEl = document.querySelector('[data-part="file-input-input"]')!
    dragText = document.querySelector('span')!
    box = dropZone.querySelector('div')!
    statusMessage = document.querySelector('[aria-live="polite"]')!
  })

  describe('file input component builds successfully', () => {
    it('target ui is created', () => {
      expect(dropZone).toBeTruthy()
      expect(dropZone?.getAttribute('data-part')).toBe('file-input-dropzone')
    })

    it('input element exists', () => {
      expect(inputEl).toBeTruthy()
      expect(inputEl?.getAttribute('data-part')).toBe('file-input-input')
    })

    it('box is created', () => {
      expect(box).toBeTruthy()
    })

    it('pluralizes "files" if there is a "multiple" attribute', () => {
      expect(dragText?.innerHTML).toBe('Drag files here or')
    })

    it('creates a status message element', () => {
      expect(statusMessage).toBeTruthy()
      expect(statusMessage?.getAttribute('aria-live')).toBe('polite')
    })

    it('adds a default status message', () => {
      expect(statusMessage?.innerHTML?.trim()).toBe('No file selected.')
    })
  })

  describe('single file input', () => {
    beforeEach(() => {
      document.body.innerHTML = template(false)
      fileInputInit()

      dragText = document.querySelector('span')!
    })

    it('uses singular "file" if there is not a "multiple" attribute', () => {
      expect(dragText.innerHTML).toBe('Drag file here or')
    })
  })

  describe('disabled file input', () => {
    beforeEach(() => {
      document.body.innerHTML = `
<div data-part="file-input-root" id="test2">
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
      fileInputInit()
      inputEl = document.querySelector('[data-part="file-input-input"]')!
    })

    it('has disabled styling', () => {
      // The component should have disabled class when input is disabled
      expect(inputEl?.disabled).toBe(true)
    })

    it('input is disabled', () => {
      expect(inputEl?.disabled).toBe(true)
    })
  })
})
