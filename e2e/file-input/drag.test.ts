import { expect, it } from 'vitest'
import { createDisposableFileInput, fileInputTemplate } from './_utils'

// userEvent can't drag files in from the OS, so these dispatch the drag events the dropzone receives.

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L626-L640 (highlight on dragover, clear on dragleave)
it('highlights the dropzone while files are dragged over it', { tags: ['parity'] }, async () => {
  await using component = createDisposableFileInput('drag', fileInputTemplate({ id: 'drag' }))
  const { getDropzoneEl, getInputEl } = component.elements

  getInputEl()!.dispatchEvent(new DragEvent('dragover', { bubbles: true }))
  await expect.element(getDropzoneEl()!).toHaveAttribute('data-dragging')

  getInputEl()!.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
  await expect.element(getDropzoneEl()!).not.toHaveAttribute('data-dragging')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L642-L648 (clear the highlight on drop)
it('clears the dropzone highlight when files are dropped', { tags: ['parity'] }, async () => {
  await using component = createDisposableFileInput('drag', fileInputTemplate({ id: 'drag' }))
  const { getDropzoneEl, getInputEl } = component.elements

  getInputEl()!.dispatchEvent(new DragEvent('dragover', { bubbles: true }))
  await expect.element(getDropzoneEl()!).toHaveAttribute('data-dragging')

  getInputEl()!.dispatchEvent(new DragEvent('drop', { bubbles: true }))
  await expect.element(getDropzoneEl()!).not.toHaveAttribute('data-dragging')
})
