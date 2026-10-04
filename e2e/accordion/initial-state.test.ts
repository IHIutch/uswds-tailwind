import { describe, expect, it } from 'vitest'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

function ITEM(value: string, expanded: boolean) {
  return `
    <li data-part="item" data-value="${value}" data-state="${expanded ? 'open' : 'closed'}">
      <button data-part="item-trigger">Section ${value}</button>
      <div data-part="item-content"></div>
    </li>
  `
}

// Authored data-state is the styling and initialization source. The machine derives
// aria-expanded and hidden from that state rather than treating ARIA as an input.
describe('authored initial state', { tags: ['parity'] }, () => {
  it('one authored-open item stays open while the others are hidden', async () => {
    await using component = createDisposableAccordion(rootId, `
      <ul data-scope="accordion" data-part="root" id="${rootId}">
        ${ITEM('a', false)}${ITEM('b', true)}${ITEM('c', false)}
      </ul>
    `)
    const { getTriggerEl, getContentEl } = component.elements

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('c')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('c')?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L47-L53 (the first open button collapses the rest before init reaches them)
  it('two authored-open items keep only the first open', async () => {
    await using component = createDisposableAccordion(rootId, `
      <ul data-scope="accordion" data-part="root" id="${rootId}">
        ${ITEM('a', true)}${ITEM('b', true)}
      </ul>
    `)
    const { getTriggerEl, getContentEl } = component.elements

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L44-L47 (data-allow-multiple skips the collapse of other buttons)
  it('two authored-open items both stay open with data-multiple', async () => {
    await using component = createDisposableAccordion(rootId, `
      <ul data-scope="accordion" data-part="root" id="${rootId}" data-multiple>
        ${ITEM('a', true)}${ITEM('b', true)}
      </ul>
    `)
    const { getTriggerEl, getContentEl } = component.elements

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()
  })
})
