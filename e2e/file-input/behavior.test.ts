import { describe, expect, it, vi } from 'vitest'
import { createDisposableFileInput, file, fileInputTemplate, selectFiles } from './_utils'

describe('file input behavior', () => {
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L191-L222 (desktop instructions and accessible name)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L268-L284 (initial live status)
  it('shows instructions and an empty selection status', { tags: ['parity'] }, async () => {
    await using component = createDisposableFileInput('behavior', fileInputTemplate())
    const { elements } = component

    expect(elements.getInstructionsEl()).toBeVisible()
    expect(elements.getInstructionsEl()).toHaveTextContent('Drag file here or choose from folder')
    expect(elements.getInputEl()).toHaveAccessibleName('Drag file here or choose from folder')
    expect(elements.getSrStatusEl()).toHaveTextContent('No file selected.')
    expect(elements.getPreviewHeaderEl()).not.toBeVisible()
    expect(elements.getErrorMessageEl()).not.toBeVisible()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L319-L353 (clear previous previews and restore instructions)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L389-L410 (selection heading and accessible name)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L439-L510 (render filenames and reset an empty selection)
  it('shows selected filenames and updates them when the selection changes or is cleared', { tags: ['parity'] }, async () => {
    await using component = createDisposableFileInput('behavior', fileInputTemplate({ multiple: true }))
    const { elements } = component

    selectFiles(elements.getInputEl()!, [file('first.png', 'image/png')])
    await vi.waitFor(() => {
      expect(elements.getPreviewItemContentEl('first.png')).toBeVisible()
      expect(elements.getPreviewHeaderEl()).toHaveTextContent('Selected file Change file')
      expect(elements.getInstructionsEl()).not.toBeVisible()
      expect(elements.getInputEl()).toHaveAccessibleName('Change file')
    })

    selectFiles(elements.getInputEl()!, [file('second.png', 'image/png'), file('third.png', 'image/png')])
    await vi.waitFor(() => {
      expect(elements.getPreviewItemEl('first.png')).toBeUndefined()
      expect(elements.getPreviewItemContentEl('second.png')).toBeVisible()
      expect(elements.getPreviewItemContentEl('third.png')).toBeVisible()
      expect(elements.getPreviewHeaderEl()).toHaveTextContent('2 files selected Change files')
      expect(elements.getInputEl()).toHaveAccessibleName('Change files')
    })

    selectFiles(elements.getInputEl()!, [])
    await vi.waitFor(() => {
      expect(elements.getPreviewListEl()).not.toBeVisible()
      expect(elements.getPreviewHeaderEl()).not.toBeVisible()
      expect(elements.getInstructionsEl()).toBeVisible()
      expect(elements.getInputEl()).toHaveAccessibleName('Drag files here or choose from folder')
    })
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L547-L589 (reject the entire batch and expose the error)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L341-L345 (clear the previous error on a valid change)
  it('shows an error for a mixed selection and accepts a later valid selection', { tags: ['parity'] }, async () => {
    await using component = createDisposableFileInput('behavior', fileInputTemplate({ multiple: true, accept: '.png' }))
    const { elements } = component

    selectFiles(elements.getInputEl()!, [file('good.png', 'image/png'), file('bad.pdf', 'application/pdf')])
    await vi.waitFor(() => {
      expect(elements.getErrorMessageEl()).toBeVisible()
      expect(elements.getErrorMessageEl()).toHaveTextContent('Error: This is not a valid file type.')
      expect(elements.getInputEl()).toHaveAccessibleName('Error: This is not a valid file type. Drag files here or choose from folder')
      expect(elements.getInputEl()!.files).toHaveLength(0)
      expect(elements.getPreviewListEl()).not.toBeVisible()
    })

    selectFiles(elements.getInputEl()!, [file('recovered.png', 'image/png')])
    await vi.waitFor(() => {
      expect(elements.getErrorMessageEl()).not.toBeVisible()
      expect(elements.getPreviewItemContentEl('recovered.png')).toBeVisible()
      expect(elements.getInputEl()).toHaveAccessibleName('Change file')
    })
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L559-L570 (MIME wildcard matching accepts the file)
  it('accepts an image when image uploads are allowed', { tags: ['parity'] }, async () => {
    await using component = createDisposableFileInput('behavior', fileInputTemplate({ accept: 'image/*' }))
    const { elements } = component

    selectFiles(elements.getInputEl()!, [file('photo.png', 'image/png')])
    await vi.waitFor(() => {
      expect(elements.getPreviewItemContentEl('photo.png')).toBeVisible()
      expect(elements.getErrorMessageEl()).not.toBeVisible()
    })
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L549-L552 (custom error copy)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L575-L586 (visible error and accessible name)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L341-L345 (remove the error on recovery)
  it('shows a configured error message and clears it after a valid selection', { tags: ['parity'] }, async () => {
    await using component = createDisposableFileInput('behavior', fileInputTemplate({ accept: '.png', errorText: 'Upload a PNG file' }))
    const { elements } = component

    selectFiles(elements.getInputEl()!, [file('bad.pdf', 'application/pdf')])
    await vi.waitFor(() => {
      expect(elements.getErrorMessageEl()).toBeVisible()
      expect(elements.getErrorMessageEl()).toHaveTextContent('Upload a PNG file')
      expect(elements.getInputEl()).toHaveAccessibleName('Upload a PNG file Drag file here or choose from folder')
    })

    selectFiles(elements.getInputEl()!, [file('good.png', 'image/png')])
    await vi.waitFor(() => {
      expect(elements.getErrorMessageEl()).not.toBeVisible()
      expect(elements.getPreviewItemContentEl('good.png')).toBeVisible()
      expect(elements.getInputEl()).toHaveAccessibleName('Change file')
    })
  })
})
