import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { FileInputApi, FileInputSchema } from './file-input.types'
import { parts } from './file-input.anatomy'
import * as dom from './file-input.dom'

export function connect<T extends PropTypes>(
  service: Service<FileInputSchema>,
  normalize: NormalizeProps<T>,
): FileInputApi<T> {
  const { state, send, scope, context } = service
  const isInvalid = state.matches('invalid')
  const isDragging = context.get('isDragging')

  return {
    isInvalid,
    isDragging,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-invalid': isInvalid ? 'true' : undefined,
        'data-dragging': isDragging ? 'true' : undefined,
      })
    },

    getDropzoneProps() {
      return normalize.element({
        ...parts.dropzone.attrs,
        'id': dom.getDropzoneId(scope),
        'data-dragging': isDragging ? 'true' : undefined,
        onDragover() {
          send({ type: 'DRAG_START' })
        },
        onDragleave() {
          send({ type: 'DRAG_END' })
        },
        onDrop(event) {
          send({ type: 'DRAG_END' })
          const files = Array.from(event.dataTransfer?.files ?? [])
          send({ type: 'CHANGE', files })
        },
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'data-invalid': isInvalid ? 'true' : undefined,
        'aria-invalid': isInvalid ? 'true' : undefined,
        onChange(event) {
          const files = Array.from(event.currentTarget.files ?? [])
          send({ type: 'CHANGE', files })
        },
      })
    },

    getErrorMessageProps() {
      return normalize.element({
        ...parts.errorMessage.attrs,
        id: dom.getErrorMessageId(scope),
        textContent: context.get('errorMessage'),
      })
    },
  }
}
