import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { FileInput } from '../../packages/compat/src/file-input'
import { createDisposableFileInput, file, fileInputTemplate } from '../file-input/_utils'

describe('file input resource lifecycle', () => {
  it('releases preview URLs when files are replaced, cleared, or the component is destroyed', async () => {
    await using component = createDisposableFileInput('behavior', fileInputTemplate())
    const { elements } = component
    const svg = (name: string) => file(name, 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>')
    const upload = async (name: string) => {
      await userEvent.upload(elements.getInputEl()!, [svg(name)])
      await vi.waitFor(() => expect(elements.getItemPreviewImageEl(name)?.naturalWidth).toBe(2))
      return elements.getItemPreviewImageEl(name)!.src
    }

    const firstUrl = await upload('first.svg')
    expect((await fetch(firstUrl)).ok).toBe(true)
    const secondUrl = await upload('second.svg')
    await expect(fetch(firstUrl)).rejects.toThrow()

    await userEvent.upload(elements.getInputEl()!, [])
    await vi.waitFor(() => expect(elements.getItemGroupEl()!.children).toHaveLength(0))
    await expect(fetch(secondUrl)).rejects.toThrow()

    const thirdUrl = await upload('third.svg')
    const root = elements.getRootEl()!
    FileInput.getInstance(root)!.destroy()
    await expect(fetch(thirdUrl)).rejects.toThrow()
    expect(FileInput.getInstance(root)).toBeNull()
  })
})
