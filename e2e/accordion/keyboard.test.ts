import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <ul data-scope="accordion" data-part="root" id="${rootId}">
    <li data-part="item" data-value="a">
      <button data-part="item-trigger">Section A</button>
      <div data-part="item-content"></div>
    </li>
  </ul>
`

// USWDS has no key handling of its own: a focused button turns Enter and Space into the same click.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L70-L72 (the click handler)
describe('keyboard activation', { tags: ['parity'] }, () => {
  it('enter opens then closes a focused trigger', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE)
    const { getTriggerEl, getContentEl } = component.elements
    getTriggerEl('a')!.focus()
    expect(document.activeElement).toBe(getTriggerEl('a'))

    await userEvent.keyboard('{Enter}')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(document.activeElement).toBe(getTriggerEl('a'))

    await userEvent.keyboard('{Enter}')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
    expect(document.activeElement).toBe(getTriggerEl('a'))
  })

  it('space opens then closes a focused trigger', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE)
    const { getTriggerEl, getContentEl } = component.elements
    getTriggerEl('a')!.focus()
    expect(document.activeElement).toBe(getTriggerEl('a'))

    await userEvent.keyboard(' ')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(document.activeElement).toBe(getTriggerEl('a'))

    await userEvent.keyboard(' ')
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
    expect(document.activeElement).toBe(getTriggerEl('a'))
  })
})
