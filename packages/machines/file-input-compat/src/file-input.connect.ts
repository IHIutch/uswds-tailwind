import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { FileInputApi, FileInputService, ItemProps } from './file-input.types'
import { dataAttr, visuallyHiddenStyle } from '@zag-js/dom-query'
import { parts } from './file-input.anatomy'
import * as dom from './file-input.dom'
import { getFilePreviewType } from './file-input.utils'

export function connect<T extends PropTypes>(
  service: FileInputService,
  normalize: NormalizeProps<T>,
): FileInputApi<T> {
  const { state, context, send, prop, scope, computed } = service

  const disabled = !!prop('disabled')
  const focused = state.matches('focused')
  const dragging = state.matches('dragging')
  const acceptedFiles = context.get('acceptedFiles')
  const rejectedFiles = context.get('rejectedFiles')
  const hasFiles = acceptedFiles.length > 0
  const hasInvalidFiles = rejectedFiles.length > 0
  const multiple = !!prop('multiple')

  const itemsLabel = computed('itemsLabel')
  const dragText = `Drag ${itemsLabel} here or`
  const chooseText = 'choose from folder'

  const changeItemText = multiple ? 'Change files' : 'Change file'
  let previewHeadingText = ''
  if (acceptedFiles.length === 1) {
    previewHeadingText = 'Selected file'
  }
  else if (acceptedFiles.length > 1) {
    previewHeadingText = `${acceptedFiles.length} files selected`
  }

  // Consumer can override with the `srStatusText` prop (i18n hook).
  const defaultStatusText = `No ${itemsLabel} selected.`
  let srStatusText = prop('srStatusText') ?? defaultStatusText
  if (prop('srStatusText') == null) {
    if (acceptedFiles.length === 1) {
      srStatusText = `You have selected the file: ${acceptedFiles[0]!.name}`
    }
    else if (acceptedFiles.length > 1) {
      const fileNames = acceptedFiles.map(f => f.name).join(', ')
      srStatusText = `You have selected ${acceptedFiles.length} files: ${fileNames}`
    }
  }

  const errorMessageText = prop('errorMessage')

  // - Default: "Drag file(s) here or choose from folder" (L182-189)
  // - After file selection: "Change file(s)" (L350)
  // - After error: "Error: ... Drag file(s) here or choose from folder" (L522-524)
  const defaultAriaLabel = `${dragText} ${chooseText}`
  let inputAriaLabel = defaultAriaLabel
  if (hasFiles) {
    inputAriaLabel = changeItemText
  }
  else if (hasInvalidFiles) {
    inputAriaLabel = `${errorMessageText} ${defaultAriaLabel}`
  }

  return {
    focused,
    dragging,
    disabled,
    hasFiles,
    hasInvalidFiles,
    acceptedFiles,
    rejectedFiles,
    errorMessageText,
    srStatusText,
    previewHeadingText,
    changeItemText,
    dragText,
    chooseText,

    openFilePicker() {
      if (disabled)
        return
      send({ type: 'OPEN' })
    },

    clearFiles() {
      if (disabled)
        return
      send({ type: 'FILES.CLEAR' })
    },

    deleteFile(file) {
      if (disabled)
        return
      send({ type: 'FILE.DELETE', file })
    },

    // Uses URL.createObjectURL for efficiency; returns cleanup function
    createFileUrl(file: File, cb: (url: string) => void) {
      const win = scope.getWin()
      const url = win.URL.createObjectURL(file)
      cb(url)
      return () => win.URL.revokeObjectURL(url)
    },

    getFilePreviewType(file: File) {
      return getFilePreviewType(file)
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-disabled': dataAttr(disabled),
        'data-dragging': dataAttr(dragging),
        'data-invalid': dataAttr(hasInvalidFiles),
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        'id': dom.getLabelId(scope),
        'htmlFor': dom.getInputId(scope),
        'data-disabled': dataAttr(disabled),
      })
    },

    getDropzoneProps() {
      return normalize.element({
        ...parts.dropzone.attrs,
        'id': dom.getDropzoneId(scope),
        'data-disabled': dataAttr(disabled),
        'data-dragging': dataAttr(dragging),
        'data-invalid': dataAttr(hasInvalidFiles),

        onDragOver(event) {
          if (disabled)
            return
          event.preventDefault()
          event.stopPropagation()
          send({ type: 'DROPZONE.DRAG_OVER' })
        },

        onDragLeave(event) {
          if (disabled)
            return
          send({ type: 'DROPZONE.DRAG_LEAVE' })
        },

        // Also processes files from dataTransfer since the machine model
        onDrop(event) {
          if (disabled)
            return
          event.preventDefault()
          event.stopPropagation()
          const files = Array.from(event.dataTransfer?.files ?? [])
          send({ type: 'DROPZONE.DROP', files })
        },
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'type': 'file',
        'name': prop('name'),
        'accept': prop('accept'),
        'multiple': multiple || undefined,
        'required': prop('required') || undefined,
        'disabled': disabled || undefined,
        'aria-label': inputAriaLabel,

        onClick(event) {
          // Stop propagation to prevent dropzone click handler from firing
          event.stopPropagation()
          // Allow re-selection of the same file
          event.currentTarget.value = ''
        },

        onInput(event) {
          if (disabled)
            return
          const { files } = event.currentTarget
          send({ type: 'INPUT.CHANGE', files: files ? Array.from(files) : [] })
        },
        onFocus() {
          send({ type: 'INPUT.FOCUS' })
        },
        onBlur() {
          send({ type: 'INPUT.BLUR' })
        },
      })
    },

    // Hidden when files are selected or error is showing
    getInstructionsProps() {
      return normalize.element({
        ...parts.instructions.attrs,
        'aria-hidden': true,
        'hidden': hasFiles || hasInvalidFiles || undefined,
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'aria-live': 'polite' as const,
        'style': visuallyHiddenStyle,
      })
    },

    getErrorMessageProps() {
      return normalize.element({
        ...parts.errorMessage.attrs,
        'aria-hidden': true,
        'hidden': !hasInvalidFiles || undefined,
      })
    },

    getPreviewHeadingProps() {
      return normalize.element({
        ...parts.previewHeading.attrs,
        hidden: !hasFiles || undefined,
      })
    },

    getItemGroupProps() {
      return normalize.element({
        ...parts.itemGroup.attrs,
        'data-disabled': dataAttr(disabled),
        'data-valid': dataAttr(hasFiles),
        'data-invalid': dataAttr(hasInvalidFiles),
      })
    },

    getItemProps(props: ItemProps) {
      const { file } = props
      return normalize.element({
        ...parts.item.attrs,
        'id': dom.getItemId?.(scope, dom.getFileId(file)),
        'aria-hidden': true,
        'data-disabled': dataAttr(disabled),
      })
    },

    getItemPreviewProps(props: ItemProps) {
      const { file } = props
      return normalize.img({
        ...parts.itemPreview.attrs,
        'alt': '',
        'data-type': getFilePreviewType(file),
        'data-disabled': dataAttr(disabled),
      })
    },

    getItemNameProps(props: ItemProps) {
      return normalize.element({
        ...parts.itemName.attrs,
        'data-disabled': dataAttr(disabled),
      })
    },

    getItemDeleteTriggerProps(props: ItemProps) {
      const { file } = props
      return normalize.button({
        ...parts.itemDeleteTrigger.attrs,
        'type': 'button',
        'disabled': disabled || undefined,
        'data-disabled': dataAttr(disabled),
        'aria-label': `Delete ${file.name}`,
        onClick() {
          if (disabled)
            return
          send({ type: 'FILE.DELETE', file })
        },
      })
    },
  }
}
