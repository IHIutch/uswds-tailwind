import { fileInputInit } from '../../packages/compat/src/file-input'
import { createDisposableComponent } from '../_utils'

export function createDisposableFileInput(id: string, template: string) {
  return createDisposableComponent(
    template,
    fileInputInit,
    () => {
      const getRootEl = () => document.getElementById(`file-input:${id}`)
      const getDropzoneEl = () => getRootEl()?.querySelector<HTMLElement>('[data-part="dropzone"]')
      const getInputEl = () => getRootEl()?.querySelector<HTMLInputElement>('[data-part="input"]')
      const getErrorMessageEl = () => getRootEl()?.querySelector<HTMLElement>('[data-part="error-text"]')
      const getInstructionsEl = () => getRootEl()?.querySelector<HTMLElement>('[data-part="instructions"]')
      const getSrStatusEl = () => getRootEl()?.querySelector<HTMLElement>('[data-part="sr-status"]')
      const getPreviewHeaderEl = () => getRootEl()?.querySelector<HTMLElement>('[data-part="preview-heading"]')
      const getItemGroupEl = () => getRootEl()?.querySelector<HTMLElement>('[data-part="item-group"]')

      const getItemEl = (value: string) => Array.from(getRootEl()?.querySelectorAll<HTMLElement>('[data-part="item"]') ?? []).find(item => item.textContent?.includes(value))
      const getItemPreviewImageEl = (value: string) => getItemEl(value)?.querySelector<HTMLImageElement>('[data-part="item-preview-image"]')
      const getItemNameEl = (value: string) => getItemEl(value)?.querySelector<HTMLElement>('[data-file-name]')

      const getLabelEl = () => getRootEl()?.querySelector<HTMLLabelElement>('[data-part="label"]')

      return {
        getLabelEl,
        getRootEl,
        getDropzoneEl,
        getInputEl,
        getErrorMessageEl,
        getInstructionsEl,
        getSrStatusEl,
        getPreviewHeaderEl,
        getItemGroupEl,
        getItemEl,
        getItemPreviewImageEl,
        getItemNameEl,
      }
    },
  )
}

export function file(name: string, type = 'application/octet-stream', contents = 'content') {
  return new File([contents], name, { type })
}

interface FileInputOptions {
  id?: string
  multiple?: boolean
  disabled?: boolean
  ariaDisabled?: boolean
  accept?: string
  errorText?: string
  name?: string
}

export function fileInputTemplate(options: FileInputOptions = {}) {
  const { id = 'behavior', multiple, disabled, ariaDisabled, accept, errorText, name } = options
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
  return `<div data-scope="file-input" data-part="root" id="${escape(id)}">
    <label data-part="label">Upload file</label>
    <div data-part="sr-status"></div>
    <div data-part="dropzone">
      <div data-part="instructions"><span data-part="drag-text"></span> <span data-part="choose"></span></div>
      <input data-part="input" type="file"
        ${multiple ? 'multiple' : ''} ${disabled ? 'disabled' : ''}
        ${ariaDisabled ? 'aria-disabled="true"' : ''}
        ${accept === undefined ? '' : `accept="${escape(accept)}"`}
        ${errorText === undefined ? '' : `data-errormessage="${escape(errorText)}"`}
        ${name === undefined ? '' : `name="${escape(name)}"`} />
      <div data-part="preview-heading"></div>
      <div data-part="error-text"></div>
      <div data-part="item-group"><div data-part="item"><img data-part="item-preview-image" /><span data-file-name></span></div></div>
    </div>
  </div>`
}
