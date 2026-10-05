import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

it('controlled proposals wait for the owner to update value', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using fixture = createDisposableInputMask('date', INPUT_MASK('date', '__/__/____'), {
    mask: '__/__/____',
    value: '12',
    onValueChange,
  })
  const input = fixture.elements.getInputEl()
  input.focus()
  await userEvent.type(input, '3')
  await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith({ value: '12/3' }))
  expect(input.value).toBe('12')
  fixture.elements.getInstance()?.machine.updateProps({ value: '123' })
  await vi.waitFor(() => expect(input.value).toBe('12/3'))
  expect(onValueChange).toHaveBeenCalledTimes(1)
})
