import * as fileInput from '@uswds-tailwind/file-input-compat'
import { nextTick } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { normalizeProps } from './lib//normalize-props'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { spreadProps } from './lib/spread-props'

export class FileInput extends Component<fileInput.Props, fileInput.Api> {
  static instances = new Map<string, FileInput>()

  static getInstance(id: string) {
    return FileInput.instances.get(id)
  }

  // Lazily captured template elements
  private _templates: Map<string, HTMLElement> | null = null

  initMachine(props: fileInput.Props): VanillaMachine<fileInput.FileInputSchema> {
    FileInput.instances.set(props.id, this)

    const inputEl = this.input

    return new VanillaMachine(fileInput.machine, {
      ...props,
      accept: inputEl.getAttribute('accept') || undefined,
      disabled: inputEl.disabled,
      errorMessage: inputEl.getAttribute('data-errormessage') || undefined,
    })
  }

  initApi() {
    return fileInput.connect(this.machine.service, normalizeProps)
  }

  // Helper to clone element with attributes only
  private cloneElementWithAttributes(element: HTMLElement): HTMLElement {
    const clone = document.createElement(element.tagName.toLowerCase())
    // Copy all attributes
    for (const attr of element.attributes) {
      clone.setAttribute(attr.name, attr.value)
    }
    return clone
  }

  // Helper to store template elements with attributes
  private storeTemplates() {
    if (!this._templates) {
      this._templates = new Map()

      const templateItem = this.previewList.querySelector<HTMLElement>('[data-part="file-input-preview-item"]')

      if (!templateItem) {
        throw new Error('Expected templateItem to be defined')
      }

      this._templates.set('listItem', this.cloneElementWithAttributes(templateItem))

      const icon = templateItem.querySelector<HTMLElement>('[data-part="file-input-preview-item-icon"]')
      if (icon) {
        this._templates.set('icon', this.cloneElementWithAttributes(icon))
      }

      const content = templateItem.querySelector<HTMLElement>('[data-part="file-input-preview-item-content"]')
      if (content) {
        this._templates.set('content', this.cloneElementWithAttributes(content))
      }
    }
  }

  render() {
    // Store templates on first render
    this.storeTemplates()

    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.dropzone, this.api.getDropzoneProps())
    spreadProps(this.input, this.api.getInputProps())
    spreadProps(this.instructions, this.api.getInstructionProps())

    this.renderSrStatus(this.srStatus)
    this.renderErrorMessage(this.errorMessage)
    this.renderPreviewList(this.previewList)
    this.renderPreviewHeader(this.previewHeader)
  }

  // Helper to get required elements
  private getElement<T extends HTMLElement = HTMLElement>(part: string, required = true): T {
    const el = this.rootEl.querySelector<T>(`[data-part="${part}"]`)
    if (required && !el) {
      throw new Error(`Expected ${part} to be defined`)
    }
    return el as T
  }

  private get dropzone() {
    return this.getElement('file-input-dropzone')
  }

  private get input() {
    return this.getElement<HTMLInputElement>('file-input-input')
  }

  private get instructions() {
    return this.getElement('file-input-instructions')
  }

  private get srStatus() {
    return this.getElement('file-input-sr-status')
  }

  private get previewList() {
    return this.getElement('file-input-preview-list')
  }

  private get previewHeader() {
    return this.getElement('file-input-preview-header')
  }

  private get errorMessage() {
    return this.getElement('file-input-error-message', false)
  }

  private renderPreviewList(previewListEl: HTMLElement) {
    spreadProps(previewListEl, this.api.getPreviewListProps())

    const files = this.machine.ctx.get('files') as fileInput.FileInputSchema['context']['files']

    // Clear existing items
    previewListEl.querySelectorAll('[data-part="file-input-preview-item"]').forEach(item => item.remove())

    files.forEach((file, i) => {
      if (!file?.name)
        return

      // Create elements using templates with fallbacks
      const listItemTemplate = this._templates?.get('listItem')
      const iconTemplate = this._templates?.get('icon')
      const contentTemplate = this._templates?.get('content')

      const listItemEl = listItemTemplate ? this.cloneElementWithAttributes(listItemTemplate) : document.createElement('div')
      const iconEl = iconTemplate ? this.cloneElementWithAttributes(iconTemplate) : document.createElement('div')
      const contentEl = contentTemplate ? this.cloneElementWithAttributes(contentTemplate) : document.createElement('div')
      // Ensure data-part attributes for fallback elements
      if (!listItemTemplate)
        listItemEl.setAttribute('data-part', 'file-input-preview-item')
      if (!iconTemplate)
        iconEl.setAttribute('data-part', 'file-input-preview-item-icon')
      if (!contentTemplate)
        contentEl.setAttribute('data-part', 'file-input-preview-item-content')

      // Apply API props and content
      spreadProps(listItemEl, this.api.getPreviewItemProps(i))
      spreadProps(iconEl, this.api.getPreviewItemIconProps(i))
      spreadProps(contentEl, this.api.getPreviewItemContentProps(i))
      contentEl.textContent = file.name

      // Assemble and append
      listItemEl.appendChild(iconEl)
      listItemEl.appendChild(contentEl)
      previewListEl.appendChild(listItemEl)
    })
  }

  private renderPreviewHeader(el: HTMLElement) {
    spreadProps(el, this.api.getPreviewHeaderProps())
    const fileCount = this.machine.ctx.get('files')?.length || 0
    el.textContent = fileCount === 1 ? 'Selected file' : `${fileCount} files selected`
  }

  private renderSrStatus(el: HTMLElement) {
    spreadProps(el, this.api.getSrStatusProps())
    el.textContent = this.machine.ctx.get('srStatusText')
  }

  private renderErrorMessage(el: HTMLElement | null) {
    if (el) {
      spreadProps(el, this.api.getErrorMessageProps())
      el.textContent = this.machine.prop('errorMessage')
    }
  }

  // Public method to set files programmatically for testing
  async setFiles(files: File[]) {
    this.machine.service.send({
      type: 'CHANGE',
      files,
    })
    await new Promise<void>(resolve => nextTick(resolve))
    // Force re-render to update DOM
    this.render()
  }
}

export function fileInputInit() {
  document.querySelectorAll<HTMLElement>('[data-part="file-input-root"]').forEach((targetEl) => {
    const id = targetEl.id || nanoid()
    const fileInput = new FileInput(targetEl, { id })
    fileInput.init()
  })
}
