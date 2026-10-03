import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableFileInput, file, fileInputTemplate } from './_utils'

describe('file previews and live status', () => {
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L363-L379 (announce the selected filename after one second)
  it('announces one selected file after the source one-second delay', { tags: ['parity'] }, async () => {
    using component = createDisposableFileInput('behavior', fileInputTemplate())
    const { elements } = component

    await userEvent.upload(elements.getInputEl()!, [file('photo.png', 'image/png')])
    await vi.waitFor(() => expect(elements.getPreviewHeaderEl()!.textContent).toBe('Selected file Change file'))
    expect(elements.getSrStatusEl()!.textContent).toBe('No file selected.')
    await vi.waitFor(() => expect(elements.getSrStatusEl()!.textContent).toBe('You have selected the file: photo.png'), { timeout: 1500 })
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L363-L379 (announce filenames or the default empty status)
  it('announces multiple filenames and then an empty selection', { tags: ['parity'] }, async () => {
    using component = createDisposableFileInput('behavior', fileInputTemplate({ multiple: true }))
    const { elements } = component

    await userEvent.upload(elements.getInputEl()!, [file('a.png', 'image/png'), file('b.png', 'image/png')])
    await vi.waitFor(() => expect(elements.getSrStatusEl()!.textContent).toBe('You have selected 2 files: a.png, b.png'), { timeout: 1500 })
    await userEvent.upload(elements.getInputEl()!, [])
    await vi.waitFor(() => expect(elements.getSrStatusEl()!.textContent).toBe('No files selected.'), { timeout: 1500 })
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L457-L499 (loading preview, file data, and extension fallback)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L417-L425 (use the fallback when the image fails)
  it('renders image previews and extension fallbacks', { tags: ['parity'] }, async () => {
    using component = createDisposableFileInput('behavior', fileInputTemplate({ multiple: true }))
    const { elements } = component

    const svg = file('photo.svg', 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="3" height="2"></svg>')
    const pdf = file('report.pdf', 'application/pdf', 'not a decodable image')
    await userEvent.upload(elements.getInputEl()!, [svg, pdf])
    await vi.waitFor(() => {
      const images = Array.from(elements.getPreviewListEl()!.querySelectorAll('img'))
      expect(images).toHaveLength(2)
      expect(images.every(image => image.alt === '')).toBe(true)
    })
    await vi.waitFor(() => {
      const report = Array.from(elements.getPreviewListEl()!.children).find(item => item.textContent === 'report.pdf')!
      expect(report.querySelector('img')?.getAttribute('data-preview-type')).toBe('pdf')
      const photo = Array.from(elements.getPreviewListEl()!.children).find(item => item.textContent === 'photo.svg')!
      expect(photo.querySelector('img')?.src.startsWith('data:image/svg+xml')).toBe(true)
    })
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L319-L353 (remove old previews and restore instructions)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L439-L446 (clear previews before rendering a new selection)
  it('removes the old preview when a newer selection arrives', { tags: ['parity'] }, async () => {
    using component = createDisposableFileInput('behavior', fileInputTemplate())
    const { elements } = component

    await userEvent.upload(elements.getInputEl()!, [file('old.png', 'image/png')])
    await vi.waitFor(() => expect(elements.getPreviewListEl()!.textContent).toBe('old.png'))
    await userEvent.upload(elements.getInputEl()!, [file('new.pdf', 'application/pdf')])
    await vi.waitFor(() => expect(elements.getPreviewListEl()!.textContent).toBe('new.pdf'))
    expect(elements.getPreviewListEl()!.children).toHaveLength(1)
    await userEvent.upload(elements.getInputEl()!, [])
    await vi.waitFor(() => {
      expect(elements.getPreviewListEl()!.children).toHaveLength(0)
      expect(elements.getInstructionsEl()!.hasAttribute('hidden')).toBe(false)
    })
  })
})
