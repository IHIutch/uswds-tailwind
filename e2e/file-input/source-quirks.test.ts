import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableFileInput, file, fileInputTemplate } from './_utils'

// Intentional difference: instruction and status defaults are scoped to each input.
it('keeps singular instruction copy independent of a multiple-file sibling', { tags: ['new'] }, async () => {
  using component = createDisposableFileInput('single', fileInputTemplate({ id: 'single' }) + fileInputTemplate({ id: 'multiple', multiple: true }))
  const single = component.elements
  await userEvent.upload(single.getInputEl()!, [file('seed.pdf', 'application/pdf')])
  await vi.waitFor(() => expect(single.getPreviewHeaderEl()!.textContent).toBe('Selected file Change file'))
  await userEvent.upload(single.getInputEl()!, [])
  await vi.waitFor(() => {
    expect(single.getInputEl()!.getAttribute('aria-label')).toBe('Drag file here or choose from folder')
  })
  await vi.waitFor(() => expect(single.getSrStatusEl()!.textContent).toBe('No file selected.'), { timeout: 1500 })
})

// Intentional difference: validation does not share a rejection latch across inputs.
it('keeps a rejected selection from suppressing a sibling change', { tags: ['new'] }, async () => {
  using component = createDisposableFileInput('restricted', fileInputTemplate({ id: 'restricted', accept: '.pdf' }) + fileInputTemplate({ id: 'sibling', multiple: true }))
  const restricted = component.elements
  const sibling = document.getElementById('file-input:sibling')!
  await userEvent.upload(restricted.getInputEl()!, [file('bad.png', 'image/png')])
  await vi.waitFor(() => expect(restricted.getDropzoneEl()!.hasAttribute('data-invalid')).toBe(true))
  await userEvent.upload(sibling.querySelector<HTMLInputElement>('[data-part="input"]')!, [file('first.png', 'image/png')])
  await vi.waitFor(() => {
    expect(sibling.querySelector<HTMLElement>('[data-part="preview-list"]')!.children).toHaveLength(1)
    expect(sibling.querySelector<HTMLElement>('[data-part="preview-heading"]')!.textContent).toBe('Selected file Change file')
  })
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L363-L379 (each change schedules its own delayed announcement)
it('queues each announcement during rapid selections', { tags: ['parity'] }, async () => {
  using component = createDisposableFileInput('status', fileInputTemplate({ id: 'status' }))
  const { getInputEl, getSrStatusEl } = component.elements
  await userEvent.upload(getInputEl()!, [file('first.png', 'image/png')])
  await new Promise(resolve => setTimeout(resolve, 500))
  await userEvent.upload(getInputEl()!, [file('second.png', 'image/png')])
  await vi.waitFor(() => expect(getSrStatusEl()!.textContent).toBe('You have selected the file: first.png'), { timeout: 800, interval: 10 })
  await vi.waitFor(() => expect(getSrStatusEl()!.textContent).toBe('You have selected the file: second.png'), { timeout: 1000 })
})
