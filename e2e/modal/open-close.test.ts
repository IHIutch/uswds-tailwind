import { expect, it, vi } from 'vitest'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

it('open() opens the modal and resolves once the DOM reflects it', { tags: ['new'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getContentEl, getInstance } = component.elements

  await getInstance(id)?.open()

  expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
  await vi.waitFor(() => expect(getContentEl(id)?.contains(document.activeElement)).toBe(true))
})

it('close() closes the modal and resolves once the DOM reflects it', { tags: ['new'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getContentEl, getInstance } = component.elements
  await getInstance(id)?.open()

  await getInstance(id)?.close()

  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
})

it('open() is a no-op when already open', { tags: ['new'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getContentEl, getInstance } = component.elements
  await getInstance(id)?.open()

  await getInstance(id)?.open()

  expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
})

it('close() is a no-op when already closed', { tags: ['new'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getContentEl, getInstance } = component.elements

  await getInstance(id)?.close()

  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
})
