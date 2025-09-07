import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'
import type { getFileType } from './file-input.utils'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  dropzone: string
  input: string
  errorMessage: string
  instructions: string
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
  /**
   * Whether the file input is disabled
   */
  disabled?: boolean
  /**
   * Screen reader status text
   */
  srStatusText?: string
}

type PropsWithDefault = 'disabled' | 'srStatusText'

export interface FileData {
  name: string
  type: ReturnType<typeof getFileType>
}

export interface FileInputSchema {
  props: RequiredBy<FileInputProps, PropsWithDefault>
  context: {
    isValid: boolean
    errorMessage: string
    isDragging: boolean
    isDisabled: boolean
    srStatusText: string
    files: FileData[]
  }
  state: 'idle' | 'valid' | 'invalid'
  action: 'setDragging' | 'validateFiles' | 'updateSrStatus' | 'checkEmptyFiles'
  event:
  | { type: 'DRAG_START' | 'DRAG_END' }
  | { type: 'INVALID' | 'VALID' }
  | { type: 'CHANGE', files: File[] }
  | { type: 'CHECK_EMPTY_FILES' | 'RESET_TO_IDLE' }
}

export type FileInputService = Service<FileInputSchema>
export type FileInputMachine = Machine<FileInputSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface FileInputApi<T extends PropTypes = PropTypes> {
  isInvalid: boolean
  isDragging: boolean
  isDisabled: boolean

  getRootProps: () => T['element']
  getDropzoneProps: () => T['element']
  getInputProps: () => T['input']
  getErrorMessageProps: () => T['element']
  getInstructionProps: () => T['element']
  getSrStatusProps: () => T['element']
  getPreviewListProps: () => T['element']
  getPreviewHeaderProps: () => T['element']
  getPreviewItemProps: (index: number) => T['element']
  getPreviewItemIconProps: (index: number) => T['element']
  getPreviewItemContentProps: (index: number) => T['element']
}
