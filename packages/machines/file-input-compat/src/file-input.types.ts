import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  dropzone: string
  input: string
  errorMessage: string
}>

export interface FileInputProps extends CommonProperties {
  /**
   * Comma separated list of accepted file types
   */
  accept?: string
  /**
   * Minimum file size in bytes
   */
  minSize?: number
  /**
   * Maximum file size in bytes
   */
  maxSize?: number
}

export interface FileInputSchema {
  props: Partial<FileInputProps>
  context: {
    isValid: boolean
    errorMessage: string
    isDragging: boolean
  }
  state: 'valid' | 'invalid'
  action: 'setDragging' | 'validateFiles' | 'toggleState'
  event:
    | { type: 'DRAG_START' | 'DRAG_END' }
    | { type: 'INVALID' | 'VALID' }
    | { type: 'CHANGE', files: File[] }
}

export type FileInputService = Service<FileInputSchema>
export type FileInputMachine = Machine<FileInputSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface FileInputApi<T extends PropTypes = PropTypes> {
  isInvalid: boolean
  isDragging: boolean

  getRootProps: () => T['element']
  getDropzoneProps: () => T['element']
  getInputProps: () => T['input']
  getErrorMessageProps: () => T['element']
}
