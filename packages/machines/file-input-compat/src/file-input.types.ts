import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'
/** Extension fallback category; `image` represents a preview without a fallback. */

export type PreviewType = 'image' | 'pdf' | 'word' | 'excel' | 'video' | 'generic'
/** Consumers manage image loading and apply the fallback only after an image error. */

export type PreviewStatus = 'loading' | 'success' | 'fallback'

export interface PreviewImageProps {
  file: File
  /** The consumer creates and releases the preview URL. */
  url?: string | undefined
  status?: PreviewStatus | undefined
  onLoad?: (() => void) | undefined
  onError?: (() => void) | undefined
}

export type ElementIds = Partial<{
  root: string
  label: string
  dropzone: string
  box: string
  input: string
  instructions: string
  previewList: string
  previewHeading: string
  srStatus: string
  errorText: string
}>

export interface FileInputProps extends DirectionProperty, CommonProperties {
  ids?: ElementIds | undefined
  /** Raw accept tokens; a nonmatching file rejects the entire selection. */
  accept?: string | undefined
  /** @default false */
  multiple?: boolean | undefined
  /** Disables the native picker; scripted change events still run. @default false */
  disabled?: boolean | undefined
  /** Marks the input disabled without blocking interaction. @default false */
  ariaDisabled?: boolean | undefined
  /** @default "Error: This is not a valid file type." */
  errorText?: string | undefined
}

type PropsWithDefault = 'disabled' | 'ariaDisabled' | 'multiple' | 'errorText'

export interface FileInputSchema {
  props: RequiredBy<FileInputProps, PropsWithDefault>
  state: 'idle' | 'dragging'
  context: {
    acceptedFiles: File[]
    invalid: boolean
    errorText: string
    srStatusText: string
    /** Fixed at initialization: initially disabled inputs never gain a status region. */
    hasStatus: boolean
  }
  refs: {
    statusTimers: ReturnType<Window['setTimeout']>[]
  }
  guard: 'isValidBatch'
  effect: 'cleanupTimers' | 'observeNativeInput'
  action: 'acceptFiles' | 'rejectBatch' | 'scheduleStatus'
  event:
    | { type: 'FILES.CHANGE', files: File[] }
    | { type: 'DRAG.OVER' }
    | { type: 'DRAG.LEAVE' }
    | { type: 'DROP' }
}

export type FileInputService = Service<FileInputSchema>

export type FileInputMachine = Machine<FileInputSchema>

export interface FileInputApi<T extends PropTypes = PropTypes> {
  /** The current accepted selection; cleared when a batch is rejected. */
  acceptedFiles: File[]
  invalid: boolean
  errorText: string
  /** Live-region text, updated after each selection's one-second delay. */
  srStatusText: string
  /** Leading heading text, excluding the change action. */
  previewHeadingText: string
  previewChangeText: string
  dragText: string
  chooseText: string
  disabled: boolean
  /**
   * Stable framework key for a File object, including files with identical metadata.
   * Repeating the same object within one list is unsupported.
   */
  getFileIdentity: (file: File) => string
  getPreviewType: (file: File) => PreviewType
  getRootProps: () => T['element']
  getLabelProps: () => T['label']
  getDropzoneProps: () => T['element']
  getBoxProps: () => T['element']
  getInputProps: () => T['input']
  getInstructionsProps: () => T['element']
  getDragTextProps: () => T['element']
  getChooseProps: () => T['element']
  getPreviewListProps: () => T['element']
  getPreviewHeadingProps: () => T['element']
  getItemProps: (details: { file: File }) => T['element']
  getItemPreviewImageProps: (details: PreviewImageProps) => T['img']
  getErrorTextProps: () => T['element']
  getSrStatusProps: () => T['element']
  /**
   * Creates a preview URL and returns an idempotent cleanup.
   * Revokes the URL before rethrowing if the callback throws.
   */
  createFileUrl: (file: File, cb: (url: string) => void) => () => void
}
