import { fileInputInit } from '../../packages/compat/src/file-input'
import { createDisposableComponent } from '../_utils'

export function createDisposableFileInput(id: string, template: string) {
  return createDisposableComponent(
    template,
    fileInputInit,
    () => {
      const getRootEl = () => document.getElementById(`fileInput:${id}`)
      const getDropzoneEl = () => document.getElementById(`fileInput:${id}:dropzone`)
      const getInputEl = () => document.getElementById(`fileInput:${id}:input`) as HTMLInputElement
      const getErrorMessageEl = () => document.getElementById(`fileInput:${id}:error-message`)
      const getInstructionsEl = () => document.getElementById(`fileInput:${id}:instructions`)
      const getSrStatusEl = () => document.getElementById(`fileInput:${id}:sr-status`)
      const getPreviewHeaderEl = () => document.getElementById(`fileInput:${id}:preview-header`)
      const getPreviewListEl = () => document.getElementById(`fileInput:${id}:preview-list`)

      const getPreviewItemEl = (value: string) => document.getElementById(`fileInput:${id}:preview-item:${value}`)
      const getPreviewItemIconEl = (value: string) => document.getElementById(`fileInput:${id}:preview-item-icon:${value}`)
      const getPreviewItemContentEl = (value: string) => document.getElementById(`fileInput:${id}:preview-item-content:${value}`)

      return {
        getRootEl,
        getDropzoneEl,
        getInputEl,
        getErrorMessageEl,
        getInstructionsEl,
        getSrStatusEl,
        getPreviewHeaderEl,
        getPreviewListEl,
        getPreviewItemEl,
        getPreviewItemIconEl,
        getPreviewItemContentEl,
      }
    },
  )
}
