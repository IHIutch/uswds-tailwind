import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { expectNever } from '../_utils'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

it('reports each typed character once with the formatted value', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using component = createDisposableInputMask('date', INPUT_MASK('date', '__/__/____'), {
    mask: '__/__/____',
    onValueChange,
  })
  await userEvent.type(component.elements.getInputEl(), '123')
  await expect.poll(() => onValueChange.mock.calls).toEqual([
    [{ value: '1' }],
    [{ value: '12' }],
    [{ value: '12/3' }],
  ])
})

it('does not report keys that leave the value unchanged', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using component = createDisposableInputMask('date', INPUT_MASK('date', '__/__/____'), {
    mask: '__/__/____',
    onValueChange,
  })
  await userEvent.type(component.elements.getInputEl(), '12')
  await expect.poll(() => onValueChange.mock.calls.length).toBe(2)
  await userEvent.keyboard('{ArrowLeft}')
  await expectNever(() => expect(onValueChange.mock.calls.length).toBeGreaterThan(2))
})
