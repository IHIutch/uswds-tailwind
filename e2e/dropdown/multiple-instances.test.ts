import { expect, it, vi } from 'vitest'
import { server, userEvent } from 'vitest/browser'
import { createDisposableDropdowns, DROPDOWN } from './_utils.js'

it('opening a sibling closes the active dropdown', { tags: ['parity'] }, async () => {
  await using component = createDisposableDropdowns(`${DROPDOWN({ id: 'one' })}${DROPDOWN({ id: 'two' })}`)
  const { getTriggerEl, getContentEl } = component.elements

  await userEvent.click(getTriggerEl('one'))
  expect(getContentEl('one')?.hidden).toBe(false)
  expect(getContentEl('two')?.hidden).toBe(true)

  await userEvent.click(getTriggerEl('two'))
  await vi.waitFor(() => {
    expect(getContentEl('one')?.hidden).toBe(true)
    expect(getContentEl('two')?.hidden).toBe(false)
  })
})

it('keyboard activation switches to the next dropdown', { tags: ['parity'] }, async () => {
  await using component = createDisposableDropdowns(`${DROPDOWN({ id: 'one' })}${DROPDOWN({ id: 'two' })}`)
  const { getTriggerEl, getContentEl } = component.elements

  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(getContentEl('one')?.hidden).toBe(false))

  // WebKit's Tab skips links by default; Option+Tab is Safari's key for reaching them.
  await userEvent.keyboard(server.browser === 'webkit' ? '{Alt>}{Tab}{/Alt}' : '{Tab}')
  expect(document.activeElement).toBe(getContentEl('one')?.querySelector('a'))

  await userEvent.tab()
  expect(document.activeElement).toBe(getTriggerEl('two'))

  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => {
    expect(getContentEl('one')?.hidden).toBe(true)
    expect(getContentEl('two')?.hidden).toBe(false)
  })
})

it('focus leaving the root closes the dropdown', { tags: ['parity'] }, async () => {
  await using component = createDisposableDropdowns(`<button id="outside">Outside</button>${DROPDOWN({ id: 'one' })}`)
  const { getTriggerEl, getContentEl } = component.elements
  const trigger = getTriggerEl('one')

  trigger.focus()
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(getContentEl('one')?.hidden).toBe(false))
  document.getElementById('outside')?.focus()

  await vi.waitFor(() => expect(getContentEl('one')?.hidden).toBe(true))
})

it('nested dropdowns retain their own parts and ids', { tags: ['new'] }, async () => {
  const inner = DROPDOWN({ id: 'inner' })
  await using component = createDisposableDropdowns(DROPDOWN({
    id: 'outer',
    content: `<li data-part="item" data-value="outer-item">${inner}</li>`,
  }))
  const { getRootEl, getTriggerEl, getContentEl } = component.elements

  expect(getRootEl('outer')?.contains(getRootEl('inner'))).toBe(true)
  expect(getTriggerEl('outer').getAttribute('aria-controls')).toBe(getContentEl('outer')?.id)
  expect(getTriggerEl('inner').getAttribute('aria-controls')).toBe(getContentEl('inner')?.id)
  expect(getTriggerEl('outer')).not.toBe(getTriggerEl('inner'))
})
