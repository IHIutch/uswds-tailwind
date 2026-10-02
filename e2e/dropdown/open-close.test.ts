import { expect, it } from 'vitest'
import { createDisposableDropdown, DROPDOWN } from './_utils.js'

const id = 'test'

it('open() opens the dropdown', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(id, DROPDOWN({ id }))

  await component.elements.getInstance()?.open()

  expect(component.elements.getContentEl()?.hidden).toBe(false)
})

it('close() closes the dropdown', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(id, DROPDOWN({ id }))
  await component.elements.getInstance()?.open()

  await component.elements.getInstance()?.close()

  expect(component.elements.getContentEl()?.hidden).toBe(true)
})

it('repeated open() and close() calls are no-ops', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(id, DROPDOWN({ id }))

  await component.elements.getInstance()?.open()
  await component.elements.getInstance()?.open()
  expect(component.elements.getContentEl()?.hidden).toBe(false)

  await component.elements.getInstance()?.close()
  await component.elements.getInstance()?.close()
  expect(component.elements.getContentEl()?.hidden).toBe(true)
})
