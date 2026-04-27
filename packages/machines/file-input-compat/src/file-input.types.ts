import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface FileRejection {
  file: File
  errors: string[]
}

export interface FileChangeDetails {
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
}

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  dropzone: string
  input: string
  label: string
  item: (id: string) => string
}>

export interface FileInputProps extends CommonProperties {
  ids?: ElementIds | undefined
  name?: string | undefined
  accept?: string | undefined
  disabled?: boolean | undefined
  multiple?: boolean | undefined
  required?: boolean | undefined
  errorMessage?: string | undefined
  onFileChange?: ((details: FileChangeDetails) => void) | undefined
}

type PropsWithDefault = 'errorMessage'

interface Context {
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
}

interface Computed {
  itemsLabel: string
}

export interface FileInputSchema {
  state: 'idle' | 'focused' | 'dragging'
  props: RequiredBy<FileInputProps, PropsWithDefault>
  context: Context
  computed: Computed
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type FileInputService = Service<FileInputSchema>

export type FileInputMachine = Machine<FileInputSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ItemProps {
  file: File
}

export interface FileInputApi<T extends PropTypes = PropTypes> {
  focused: boolean
  dragging: boolean
  disabled: boolean
  hasFiles: boolean
  hasInvalidFiles: boolean
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
  errorMessageText: string
  statusMessage: string
  previewHeadingText: string
  changeItemText: string
  dragText: string
  chooseText: string
  openFilePicker: VoidFunction
  clearFiles: VoidFunction
  deleteFile: (file: File) => void
  createFileUrl: (file: File, cb: (url: string) => void) => VoidFunction
  getFilePreviewType: (file: File) => 'pdf' | 'word' | 'excel' | 'video' | 'generic' | 'image'

  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getDropzoneProps: () => T['element']
  getInputProps: () => T['input']
  getInstructionsProps: () => T['element']
  getStatusProps: () => T['element']
  getErrorMessageProps: () => T['element']
  getPreviewHeadingProps: () => T['element']
  getItemGroupProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
  getItemPreviewProps: (props: ItemProps) => T['img']
  getItemNameProps: (props: ItemProps) => T['element']
  getItemDeleteTriggerProps: (props: ItemProps) => T['button']
}
