import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableFileInput, file, fileInputTemplate } from './_utils'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L363-L379 (each change schedules its own delayed announcement)
it('queues each announcement during rapid selections', { tags: ['parity'] }, async () => {
  await using component = createDisposableFileInput('status', fileInputTemplate({ id: 'status' }))
  const { getInputEl, getSrStatusEl } = component.elements
  await userEvent.upload(getInputEl()!, [file('first.png', 'image/png')])
  await new Promise(resolve => setTimeout(resolve, 500))
  await userEvent.upload(getInputEl()!, [file('second.png', 'image/png')])
  await vi.waitFor(() => expect(getSrStatusEl()!.textContent).toBe('You have selected the file: first.png'), { timeout: 800, interval: 10 })
  await vi.waitFor(() => expect(getSrStatusEl()!.textContent).toBe('You have selected the file: second.png'), { timeout: 1000 })
})
