import type { EventObject, Machine, Service } from '@zag-js/core'
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
   * Whether the file input is disabled
   */
  disabled?: boolean
  /**
   * Screen reader status text
   */
  srStatusText?: string
  /**
   * Custom error message for invalid file types
   */
  errorMessage?: string
}

type PropsWithDefault = 'disabled' | 'srStatusText' | 'errorMessage'

export interface FileData {
  name: string
  type: ReturnType<typeof getFileType>
}

export interface FileInputSchema {
  props: RequiredBy<FileInputProps, PropsWithDefault>
  context: {
    isDragging: boolean
    isDisabled: boolean
    srStatusText: string
    files: FileData[]
  }
  state: 'idle' | 'valid' | 'invalid'
  action: 'validateFiles' | 'updateSrStatus' | 'checkEmptyFiles'
  event: EventObject & (
    | { type: 'VALID' }
    | { type: 'INVALID' }
    | { type: 'CHANGE', files: File[] }
    | { type: 'RESET' }
  )
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
  getLabelProps: () => T['label']
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
