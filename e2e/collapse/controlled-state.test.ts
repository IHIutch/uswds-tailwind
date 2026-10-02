import { VanillaMachine } from '@zag-js/vanilla'
import { expect, it, vi } from 'vitest'
import * as collapse from '../../packages/machines/collapse-compat/src'

async function settle() {
  await Promise.resolve()
  await Promise.resolve()
}

it('controlled false takes precedence over defaultOpen', () => {
  const machine = new VanillaMachine(collapse.machine, {
    id: 'controlled-precedence',
    open: false,
    defaultOpen: true,
  })

  expect(machine.state.get()).toBe('closed')
})

it('controlled requests notify without changing state until the prop updates', async () => {
  const onOpenChange = vi.fn()
  const machine = new VanillaMachine(collapse.machine, {
    id: 'controlled-update',
    open: false,
    onOpenChange,
  })
  machine.start()

  machine.send({ type: 'OPEN' })
  await settle()

  expect(onOpenChange).toHaveBeenCalledOnce()
  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  expect(machine.state.get()).toBe('closed')

  machine.updateProps({ open: true })
  await settle()

  expect(onOpenChange).toHaveBeenCalledOnce()
  expect(machine.state.get()).toBe('open')

  machine.updateProps({ open: false })
  await settle()

  expect(onOpenChange).toHaveBeenCalledOnce()
  expect(machine.state.get()).toBe('closed')

  machine.stop()
})
