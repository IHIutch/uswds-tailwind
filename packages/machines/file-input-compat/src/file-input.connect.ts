import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { FileInputApi, FileInputService } from './file-input.types'
import { ariaAttr, dataAttr } from '@zag-js/dom-query'
import { parts } from './file-input.anatomy'
import * as dom from './file-input.dom'
import { getDefaultAriaLabel, getFileId, getItemsLabel, getPreviewType, isBatchValid } from './file-input.utils'

export function connect<T extends PropTypes>(
  service: FileInputService,
  normalize: NormalizeProps<T>,
): FileInputApi<T> {
  const { state, send, prop, context, scope, refs } = service
  const dragging = state.matches('dragging')

  const acceptedFiles = context.get('acceptedFiles')
  const invalid = context.get('invalid')
  const errorText = context.get('errorText')
  const srStatusText = context.get('srStatusText')

  const itemsLabel = getItemsLabel(prop('multiple'))
  const dragText = `Drag ${itemsLabel} here or`
  const chooseText = 'choose from folder'
  const defaultAriaLabel = getDefaultAriaLabel(itemsLabel)
  const ariaLabelText = invalid
    ? `${errorText} ${defaultAriaLabel}`
    : acceptedFiles.length > 1
      ? 'Change files'
      : acceptedFiles.length === 1
        ? 'Change file'
        : defaultAriaLabel

  const disabled = prop('disabled')
  const ariaDisabled = prop('ariaDisabled')
  const hasFiles = acceptedFiles.length > 0

  const changeText = acceptedFiles.length > 1 ? 'Change files' : 'Change file'
  const previewHeadingText
    = acceptedFiles.length === 1
      ? 'Selected file'
      : acceptedFiles.length > 1
        ? `${acceptedFiles.length} files selected`
        : ''

  return {
    acceptedFiles,
    invalid,
    errorText,
    srStatusText,
    previewHeadingText,
    previewChangeText: changeText,

    dragText,
    chooseText,
    disabled,
    getFileId,
    getPreviewType(file) {
      return getPreviewType(file)
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'dir': prop('dir'),
        'id': dom.getRootId(scope),
        'data-disabled': dataAttr(disabled || ariaDisabled),
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        'id': dom.getLabelId(scope),
        'htmlFor': dom.getInputId(scope),
        'data-disabled': dataAttr(disabled || ariaDisabled),
      })
    },

    getDropzoneProps() {
      return normalize.element({
        ...parts.dropzone.attrs,
        'id': dom.getDropzoneId(scope),
        'data-dragging': dataAttr(dragging),
        'data-invalid': dataAttr(invalid),
        onDragOver() {
          send({ type: 'DROPZONE.DRAG_OVER' })
        },
        onDragLeave() {
          send({ type: 'DROPZONE.DRAG_LEAVE' })
        },
        onDrop() {
          send({ type: 'DROPZONE.DROP' })
        },
      })
    },

    getBoxProps() {
      return normalize.element({
        ...parts.box.attrs,
        id: dom.getBoxId(scope),
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'type': 'file',
        'accept': prop('accept'),
        'multiple': prop('multiple'),
        'disabled': disabled || undefined,
        'aria-label': ariaLabelText,
        'aria-disabled': ariaAttr(ariaDisabled),
        onInput(event) {
          const input = event.currentTarget
          const files = Array.from(input.files ?? [])
          if (!isBatchValid(prop('accept'), files))
            input.value = ''
          send({ type: 'FILE.SELECT', files })
        },
      })
    },

    getInstructionsProps() {
      return normalize.element({
        ...parts.instructions.attrs,
        'id': dom.getInstructionsId(scope),
        'aria-hidden': true,
        'hidden': hasFiles,
      })
    },

    getDragTextProps() {
      return normalize.element({ ...parts.dragText.attrs })
    },

    getChooseProps() {
      return normalize.element({ ...parts.choose.attrs })
    },

    getItemGroupProps() {
      return normalize.element({
        ...parts.itemGroup.attrs,
        'id': dom.getItemGroupId(scope),
        'hidden': !hasFiles,
        'data-valid': dataAttr(hasFiles),
      })
    },

    getPreviewHeadingProps() {
      return normalize.element({
        ...parts.previewHeading.attrs,
        'id': dom.getPreviewHeadingId(scope),
        'hidden': !hasFiles,
        'data-change-text': changeText,
      })
    },

    getItemProps() {
      return normalize.element({
        ...parts.item.attrs,
        'aria-hidden': true,
      })
    },

    getItemPreviewImageProps({ file, url, status = 'loading', onLoad, onError }) {
      return normalize.img({
        ...parts.itemPreviewImage.attrs,
        'alt': '',
        'src': url,
        'data-loading': dataAttr(status === 'loading'),
        'data-preview-type': status === 'fallback' ? getPreviewType(file) : undefined,
        onLoad,
        onError,
      })
    },

    getErrorTextProps() {
      return normalize.element({
        ...parts.errorText.attrs,
        'id': dom.getErrorTextId(scope),
        'aria-hidden': true,
        'hidden': !invalid,
        'data-invalid': dataAttr(invalid),
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
        'hidden': !refs.get('hasStatus'),
      })
    },

    createFileUrl(file, cb) {
      const win = scope.getWin()
      const url = win.URL.createObjectURL(file)
      let revoked = false
      const revoke = () => {
        if (revoked)
          return
        revoked = true
        win.URL.revokeObjectURL(url)
      }
      try {
        cb(url)
      }
      catch (error) {
        revoke()
        throw error
      }
      return revoke
    },
  }
}
