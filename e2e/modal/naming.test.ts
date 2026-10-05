import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

// Lets the machine's frame-deferred check for title and description parts run.
function nextFrame() {
  return new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

// USWDS needs the author to set aria-labelledby and aria-describedbyx; here the title and description parts wire them.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L249-L250
describe('naming', { tags: ['parity'] }, () => {
  it('the title part names the dialog and the description part describes it, closed and open', async () => {
    const id = 'test'
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
    const { getTriggerEl, getContentEl, getTitleEl, getDescriptionEl } = component.elements
    await nextFrame()

    expect(document.getElementById(getContentEl(id)!.getAttribute('aria-labelledby')!)).toBe(getTitleEl(id))
    expect(document.getElementById(getContentEl(id)!.getAttribute('aria-describedby')!)).toBe(getDescriptionEl(id))

    await userEvent.click(getTriggerEl(id)!)
    await nextFrame()

    expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
    expect(document.getElementById(getContentEl(id)!.getAttribute('aria-labelledby')!)).toBe(getTitleEl(id))
    expect(document.getElementById(getContentEl(id)!.getAttribute('aria-describedby')!)).toBe(getDescriptionEl(id))
  })

  it('sibling modals are each named by their own title and description', async () => {
    await using component = createDisposableModals(`
      ${TRIGGER({ id: 'one' })}${TRIGGER({ id: 'two' })}
      ${MODAL({ id: 'one' })}${MODAL({ id: 'two' })}
    `)
    const { getTriggerEl, getContentEl, getTitleEl, getDescriptionEl } = component.elements

    await userEvent.click(getTriggerEl('one')!)
    await nextFrame()

    for (const id of ['one', 'two']) {
      const content = getContentEl(id)!
      expect(document.getElementById(content.getAttribute('aria-labelledby')!)).toBe(getTitleEl(id))
      expect(document.getElementById(content.getAttribute('aria-describedby')!)).toBe(getDescriptionEl(id))
    }
    expect(getTitleEl('one')).not.toBe(getTitleEl('two'))
  })

  it('an authored aria-label names a dialog with no title part', async () => {
    const id = 'labelled'
    await using component = createDisposableModals(`
      ${TRIGGER({ id })}
      <div data-scope="modal" data-part="root" data-value="${id}">
        <div data-part="backdrop"></div>
        <div data-part="positioner">
          <div data-part="content" aria-label="Unsaved changes">
            <p>No heading here</p>
            <button type="button" data-part="close-trigger">Close</button>
          </div>
        </div>
      </div>
    `)
    const { getTriggerEl, getContentEl } = component.elements

    await userEvent.click(getTriggerEl(id)!)
    await nextFrame()

    expect(getContentEl(id)?.getAttribute('aria-label')).toBe('Unsaved changes')
    expect(getContentEl(id)?.hasAttribute('aria-labelledby')).toBe(false)
  })

  it('an authored aria-label takes precedence over the title part', async () => {
    const id = 'both'
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id }).replace('data-part="content"', 'data-part="content" aria-label="Unsaved changes"')}`)
    const { getTriggerEl, getContentEl, getDescriptionEl } = component.elements

    await userEvent.click(getTriggerEl(id)!)
    await nextFrame()

    expect(getContentEl(id)?.getAttribute('aria-label')).toBe('Unsaved changes')
    expect(getContentEl(id)?.hasAttribute('aria-labelledby')).toBe(false)
    expect(document.getElementById(getContentEl(id)!.getAttribute('aria-describedby')!)).toBe(getDescriptionEl(id))
  })

  it('an open dialog with no title or description part gets neither attribute', async () => {
    const id = 'bare'
    await using component = createDisposableModals(`
      ${TRIGGER({ id })}
      <div data-scope="modal" data-part="root" data-value="${id}">
        <div data-part="backdrop"></div>
        <div data-part="positioner">
          <div data-part="content">
            <p>No heading here</p>
            <button type="button" data-part="close-trigger">Close</button>
          </div>
        </div>
      </div>
    `)
    const { getTriggerEl, getContentEl } = component.elements

    await userEvent.click(getTriggerEl(id)!)
    await nextFrame()

    expect(getContentEl(id)?.hasAttribute('aria-labelledby')).toBe(false)
    expect(getContentEl(id)?.hasAttribute('aria-describedby')).toBe(false)
  })
})
