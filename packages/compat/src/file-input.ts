import * as fileInput from '@uswds-tailwind/file-input-compat'
import { nanoid } from 'nanoid'
import { normalizeProps } from './lib//normalize-props'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { spreadProps } from './lib/spread-props'

export class FileInput extends Component<fileInput.Props, fileInput.Api> {
  initMachine(props: fileInput.Props): VanillaMachine<fileInput.FileInputSchema> {
    const inputEl = this.input
    const minSizeAttr = inputEl.getAttribute('data-min-size')
    const maxSizeAttr = inputEl.getAttribute('data-max-size')

    return new VanillaMachine(fileInput.machine, {
      ...props,
      accept: inputEl.getAttribute('accept') || undefined,
      minSize: minSizeAttr ? Number.parseInt(minSizeAttr) : undefined,
      maxSize: maxSizeAttr ? Number.parseInt(maxSizeAttr) : undefined,
    })
  }

  initApi() {
    return fileInput.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    this.renderDropzone(this.dropzone)
    this.renderInput(this.input)
    this.renderErrorMessage(this.errorMessage)
  }

  private get dropzone() {
    const dropzoneEl = this.rootEl.querySelector<HTMLElement>(`[data-part="file-input-dropzone"]`)
    if (!dropzoneEl)
      throw new Error('Expected dropzoneEl to be defined')
    return dropzoneEl
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>(`[data-part="file-input-input"]`)
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private get errorMessage() {
    return this.rootEl.querySelector<HTMLElement>(`[data-part="file-input-error-message"]`)
  }

  private renderDropzone(el: HTMLElement) {
    spreadProps(el, this.api.getDropzoneProps())
  }

  private renderInput(el: HTMLElement) {
    spreadProps(el, this.api.getInputProps())
  }

  private renderErrorMessage(el: HTMLElement | null) {
    if (el)
      spreadProps(el, this.api.getErrorMessageProps())
  }
}

export function fileInputInit() {
  document.querySelectorAll<HTMLElement>('[data-part="file-input-root"]').forEach((targetEl) => {
    const fileInput = new FileInput(targetEl, {
      id: targetEl.id || nanoid(),
    })
    fileInput.init()
  })
}
