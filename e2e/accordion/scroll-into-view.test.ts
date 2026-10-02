import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <ul data-scope="accordion" data-part="root" id="${rootId}">
    <li data-part="item" data-value="a">
      <button data-part="item-trigger">Section A</button>
      <div data-part="item-content"></div>
    </li>
    <li data-part="item" data-value="b">
      <button data-part="item-trigger">Section B</button>
      <div data-part="item-content"></div>
    </li>
  </ul>
`

// Records which elements were asked to scroll, without moving the page.
function spyOnScrollIntoView() {
  const scrolled: Element[] = []
  const spy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(function (this: Element) {
    scrolled.push(this)
  })
  // Scroll anchoring would keep a trigger in place when the content above it collapses.
  const style = document.createElement('style')
  style.textContent = 'html,body{margin:0;padding:0} *{overflow-anchor:none}'
  document.head.appendChild(style)

  return {
    scrolled,
    [Symbol.dispose]: () => {
      spy.mockRestore()
      style.remove()
      window.scrollTo(0, 0)
    },
  }
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L74-L79 (an expanded button outside the viewport is scrolled into view)
describe('scroll into view', { tags: ['parity'] }, () => {
  it('scrolls a trigger that ends up off screen after it expands', async () => {
    using scroll = spyOnScrollIntoView()
    await using component = createDisposableAccordion(rootId, TEMPLATE)
    const { getTriggerEl, getContentEl } = component.elements
    getContentEl('a')!.style.height = '3000px'
    getContentEl('b')!.style.height = '3000px'
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    // Collapsing A pulls B up past the top of the viewport.
    await userEvent.click(getTriggerEl('b')!)
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')

    await vi.waitFor(() => expect(scroll.scrolled).toEqual([getTriggerEl('b')]))
  })

  it('never scrolls a trigger that collapses', async () => {
    using scroll = spyOnScrollIntoView()
    await using component = createDisposableAccordion(rootId, TEMPLATE)
    const { getTriggerEl, getContentEl } = component.elements
    getContentEl('a')!.style.height = '3000px'
    getContentEl('b')!.style.height = '3000px'
    await userEvent.click(getTriggerEl('a')!)
    await userEvent.click(getTriggerEl('b')!)
    await vi.waitFor(() => expect(scroll.scrolled).toEqual([getTriggerEl('b')]))
    scroll.scrolled.length = 0

    await userEvent.click(getTriggerEl('b')!)
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('false')
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    // The next off screen expand is the only scroll since the reset.
    await userEvent.click(getTriggerEl('b')!)
    await vi.waitFor(() => expect(scroll.scrolled).toEqual([getTriggerEl('b')]))
  })

  it('does not scroll a trigger that is already on screen', async () => {
    using scroll = spyOnScrollIntoView()
    await using component = createDisposableAccordion(rootId, TEMPLATE)
    const { getTriggerEl, getContentEl } = component.elements
    getContentEl('b')!.style.height = '3000px'

    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    // Bounded by a later off screen expand: only B may have scrolled.
    getContentEl('a')!.style.height = '3000px'
    await userEvent.click(getTriggerEl('b')!)
    await vi.waitFor(() => expect(scroll.scrolled).toEqual([getTriggerEl('b')]))
  })
})
