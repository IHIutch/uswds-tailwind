import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { FileInputApi, FileInputSchema } from './file-input.types'
import { ariaAttr, dataAttr, visuallyHiddenStyle } from '@zag-js/dom-query'
import { parts } from './file-input.anatomy'
import * as dom from './file-input.dom'
import { getFileType } from './file-input.utils'

export function connect<T extends PropTypes>(
  service: Service<FileInputSchema>,
  normalize: NormalizeProps<T>,
): FileInputApi<T> {
  const { state, send, scope, context, prop } = service
  const isDragging = context.get('isDragging')
  const isInvalid = state.matches('invalid')
  const isValid = state.matches('valid')
  const isDisabled = context.get('isDisabled')

  return {
    isInvalid,
    isDragging,
    isDisabled,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-invalid': dataAttr(isInvalid),
        'data-valid': dataAttr(isValid),
        'data-dragging': dataAttr(isDragging),
        'data-disabled': dataAttr(isDisabled),
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        'id': dom.getLabelId(scope),
        'data-disabled': dataAttr(isDisabled),
        'htmlFor': dom.getInputId(scope),
      })
    },

    getDropzoneProps() {
      return normalize.element({
        ...parts.dropzone.attrs,
        'id': dom.getDropzoneId(scope),
        'data-invalid': dataAttr(isInvalid),
        'data-valid': dataAttr(isValid),
        'data-dragging': dataAttr(isDragging),
        onDragOver() {
          if (!isDisabled) {
            context.set('isDragging', true)
          }
        },
        onDragLeave() {
          if (!isDisabled) {
            context.set('isDragging', false)
          }
        },
        onDrop(event) {
          if (!isDisabled) {
            context.set('isDragging', false)
            const files = Array.from(event.dataTransfer?.files || [])
            send({ type: 'CHANGE', files })
          }
        },
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'multiple': prop('multiple'),
        'aria-invalid': ariaAttr(isInvalid),
        'aria-label': 'Drag files here or choose from folder',
        'data-invalid': dataAttr(isInvalid),
        'data-valid': dataAttr(isValid),
        'data-dragging': dataAttr(isDragging),
        'data-errormessage': isInvalid ? prop('errorMessage') : undefined,
        onChange(event) {
          if (!isDisabled) {
            const files = Array.from(event.currentTarget.files ?? [])
            if (files.length) {
              send({ type: 'CHANGE', files })
            }
            else {
              send({ type: 'RESET' })
            }
          }
        },
      })
    },

    getInstructionProps() {
      return normalize.element({
        ...parts.instructions.attrs,
        'id': dom.getInstructionsId(scope),
        'aria-hidden': 'true',
        'data-invalid': dataAttr(isInvalid),
        'data-valid': dataAttr(isValid),
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'aria-live': 'polite',
        'style': visuallyHiddenStyle,
      })
    },

    getPreviewListProps() {
      return normalize.element({
        ...parts.previewList.attrs,
        'id': dom.getPreviewListId(scope),
        'data-invalid': dataAttr(isInvalid),
        'data-valid': dataAttr(isValid),
        'data-dragging': dataAttr(isDragging),
      })
    },

    getPreviewTitleProps() {
      return normalize.element({
        ...parts.previewTitle.attrs,
        id: dom.getPreviewTitleId(scope),
      })
    },

    getPreviewItemProps({ file }) {
      return normalize.element({
        ...parts.previewItem.attrs,
        id: dom.getPreviewItemId(scope, dom.getFileId(file)),
      })
    },

    getPreviewItemIconProps({ file }) {
      const fileExt = file.name.split('.').pop()

      return normalize.element({
        ...parts.previewItemIcon.attrs,
        'id': dom.getPreviewItemIconId(scope, dom.getFileId(file)),
        'data-type': getFileType(fileExt),
      })
    },

    getPreviewItemThumbProps({ file }) {
      return normalize.element({
        ...parts.previewItemThumb.attrs,
        id: dom.getPreviewItemThumbId(scope, dom.getFileId(file)),
        alt: file.name,
      })
    },

    getPreviewItemContentProps({ file }) {
      return normalize.element({
        ...parts.previewItemContent.attrs,
        id: dom.getPreviewItemContentId(scope, dom.getFileId(file)),
      })
    },

    getErrorMessageProps() {
      return normalize.element({
        ...parts.errorMessage.attrs,
        'data-invalid': dataAttr(isInvalid),
        'data-valid': dataAttr(isValid),
        'id': dom.getErrorMessageId(scope),
      })
    },
  }
}
