import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableFileInput, file, fileInputTemplate, stubPointer } from './_utils'

// The visible instructions swap with the `fine-pointer` CSS variant; these cover the input's name.

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L191-L222 (only the choose action without a fine pointer)
it('names the input with only the choose action without a fine pointer', { tags: ['parity'] }, async () => {
  using _pointer = stubPointer(false)
  await using component = createDisposableFileInput('touch', fileInputTemplate({ id: 'touch' }))
  const { getInputEl } = component.elements

  await expect.element(getInputEl()!).toHaveAccessibleName('Choose from folder')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L40-L52 (no matchMedia means no fine pointer)
it('names the input with only the choose action when matchMedia is unavailable', { tags: ['parity'] }, async () => {
  using _pointer = stubPointer(null)
  await using component = createDisposableFileInput('touch', fileInputTemplate({ id: 'touch' }))
  const { getInputEl } = component.elements

  await expect.element(getInputEl()!).toHaveAccessibleName('Choose from folder')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L245-L260 (rebuild the instructions when the pointer changes)
it('updates the input name when the pointer changes', { tags: ['parity'] }, async () => {
  using pointer = stubPointer(false)
  await using component = createDisposableFileInput('touch', fileInputTemplate({ id: 'touch', multiple: true }))
  const { getInputEl } = component.elements

  pointer.change(true)
  await expect.element(getInputEl()!).toHaveAccessibleName('Drag files here or choose from folder')

  pointer.change(false)
  await expect.element(getInputEl()!).toHaveAccessibleName('Choose from folder')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L220-L222 (a pointer change keeps the selection's name)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L503-L505 (clearing restores the default name)
it('keeps "Change file" when the pointer changes after a selection', { tags: ['parity'] }, async () => {
  using pointer = stubPointer(true)
  await using component = createDisposableFileInput('touch', fileInputTemplate({ id: 'touch' }))
  const { getInputEl } = component.elements

  await userEvent.upload(getInputEl()!, [file('photo.png', 'image/png')])
  await expect.element(getInputEl()!).toHaveAccessibleName('Change file')
  pointer.change(false)
  await expect.element(getInputEl()!).toHaveAccessibleName('Change file')

  await userEvent.upload(getInputEl()!, [])
  await expect.element(getInputEl()!).toHaveAccessibleName('Choose from folder')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L580-L582 (the error name ends with the default instructions)
it('names a rejected touch selection with the choose action', { tags: ['parity'] }, async () => {
  using _pointer = stubPointer(false)
  await using component = createDisposableFileInput('touch', fileInputTemplate({ id: 'touch', accept: '.png' }))
  const { getInputEl } = component.elements

  await userEvent.upload(getInputEl()!, [file('bad.pdf', 'application/pdf')])
  await expect.element(getInputEl()!).toHaveAccessibleName('Error: This is not a valid file type. Choose from folder')
})
