import { expect, it, vi } from 'vitest'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

it('setValue updates an uncontrolled field and reports the formatted value', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using fixture = createDisposableInputMask('date', INPUT_MASK('date', '__/__/____'), {
    mask: '__/__/____',
    onValueChange,
  })
  fixture.elements.getInstance()?.api.setValue('1234')
  await vi.waitFor(() => expect(fixture.elements.getInputEl().value).toBe('12/34'))
  expect(onValueChange).toHaveBeenCalledWith({ value: '12/34' })
  expect(fixture.elements.getContentEl().textContent).toBe('12/34/____')
})
