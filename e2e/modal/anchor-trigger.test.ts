import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// Reports whether the click that reaches the body had its default action prevented.
function watchDefaultPrevented() {
  const seen: boolean[] = []
  const onClick = (event: Event) => {
    seen.push(event.defaultPrevented)
  }
  document.body.addEventListener('click', onClick)
  return {
    seen,
    [Symbol.dispose]: () => {
      document.body.removeEventListener('click', onClick)
      history.replaceState(null, '', location.pathname + location.search)
    },
  }
}

describe('anchor trigger', { tags: ['parity'] }, () => {
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L373-L379 (an anchor trigger gets role="button" and its click no longer navigates)
  it('a click opens the modal, keeps href and role="button", and does not navigate', async () => {
    using clicks = watchDefaultPrevented()
    await using component = createDisposableModals(`${TRIGGER({ id, tag: 'a', attrs: 'href="#somewhere"' })}${MODAL({ id })}`)
    const { getTriggerEl, getContentEl } = component.elements

    await userEvent.click(getTriggerEl(id)!)

    expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl(id)?.getAttribute('href')).toBe('#somewhere')
    expect(getTriggerEl(id)?.getAttribute('role')).toBe('button')
    expect(clicks.seen).toEqual([true])
    expect(location.hash).toBe('')
  })

  // USWDS adds no key handling: Enter on a focused anchor is a native click, and Space does nothing on an anchor.
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L387 (the only listener on a trigger is click)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L185-L188 (closing returns focus to the opener)
  it('enter opens once, space opens nothing, and closing returns focus to the anchor', async () => {
    using clicks = watchDefaultPrevented()
    await using component = createDisposableModals(`${TRIGGER({ id, tag: 'a', attrs: 'href="#somewhere"' })}${MODAL({ id })}`)
    const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements
    getTriggerEl(id)!.focus()

    await userEvent.keyboard(' ')
    expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
    expect(clicks.seen).toEqual([])

    await userEvent.keyboard('{Enter}')
    expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
    expect(clicks.seen).toEqual([true])
    expect(location.hash).toBe('')

    await userEvent.click(getCloseTriggerEl(id)!)
    expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
    await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl(id)))
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L370-L371 (only elements whose aria-controls matches a modal are bound)
  it('an anchor that is not connected to a modal navigates normally', async () => {
    using clicks = watchDefaultPrevented()
    await using component = createDisposableModals(`
      <a id="plain" href="#plain-target">Plain link</a>
      <a id="missing" href="#missing-target" data-scope="modal" data-part="trigger" data-target="no-such-modal">Open nothing</a>
      ${TRIGGER({ id })}${MODAL({ id })}
    `)
    const { getContentEl } = component.elements

    await userEvent.click(document.getElementById('plain')!)
    expect(location.hash).toBe('#plain-target')

    await userEvent.click(document.getElementById('missing')!)
    expect(location.hash).toBe('#missing-target')

    expect(clicks.seen).toEqual([false, false])
    expect(document.getElementById('missing')?.hasAttribute('role')).toBe(false)
    expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L370-L388 (each trigger is bound to the modal its own aria-controls names)
  it('two anchors each open only their own modal and get focus back on close', async () => {
    using _clicks = watchDefaultPrevented()
    await using component = createDisposableModals(`
      ${TRIGGER({ id: 'one', tag: 'a', attrs: 'href="#one"' })}
      ${TRIGGER({ id: 'two', tag: 'a', attrs: 'href="#two"' })}
      ${MODAL({ id: 'one' })}${MODAL({ id: 'two' })}
    `)
    const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements

    await userEvent.click(getTriggerEl('one')!)
    expect(getContentEl('one')?.hasAttribute('hidden')).toBeFalsy()
    expect(getContentEl('two')?.hasAttribute('hidden')).toBeTruthy()
    await userEvent.click(getCloseTriggerEl('one')!)
    await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl('one')))

    await userEvent.click(getTriggerEl('two')!)
    expect(getContentEl('two')?.hasAttribute('hidden')).toBeFalsy()
    expect(getContentEl('one')?.hasAttribute('hidden')).toBeTruthy()
    await userEvent.click(getCloseTriggerEl('two')!)
    await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl('two')))
    expect(location.hash).toBe('')
  })
})
