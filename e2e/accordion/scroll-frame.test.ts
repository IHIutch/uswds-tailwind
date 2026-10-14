import { describe, expect, it, vi } from 'vitest'
import { Accordion } from '../../packages/compat/src/accordion.js'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

// The spacer keeps every trigger below the fold, so any expand would scroll.
function TEMPLATE({ multiple = false }: { multiple?: boolean } = {}) {
  return `
  <div style="height:3000px"></div>
  <ul data-scope="accordion" data-part="root" id="${rootId}"${multiple ? ' data-multiple' : ''}>
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
}

// Records which elements were asked to scroll, without moving the page.
function spyOnScrollIntoView() {
  const scrolled: Element[] = []
  const spy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(function (this: Element) {
    scrolled.push(this)
  })

  return {
    scrolled,
    [Symbol.dispose]: () => spy.mockRestore(),
  }
}

function nextFrames() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

// The scroll waits a frame for the render, unlike the synchronous USWDS click handler.
describe('scroll frame', { tags: ['new'] }, () => {
  it('does not scroll an item that closes again before the frame', async () => {
    using scroll = spyOnScrollIntoView()
    await using component = createDisposableAccordion(rootId, TEMPLATE())
    const { getTriggerEl } = component.elements

    getTriggerEl('a')!.click()
    getTriggerEl('a')!.click()
    await nextFrames()

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(scroll.scrolled).toEqual([])
  })

  it('does not scroll items opened in the same frame after destroy', async () => {
    using scroll = spyOnScrollIntoView()
    await using component = createDisposableAccordion(rootId, TEMPLATE({ multiple: true }))
    const { getRootEl, getTriggerEl } = component.elements

    getTriggerEl('a')!.click()
    getTriggerEl('b')!.click()
    // Two microtasks: the machine transitions, then the render they trigger.
    await Promise.resolve()
    await Promise.resolve()
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
    Accordion.getInstance(getRootEl())?.destroy()
    await nextFrames()

    expect(scroll.scrolled).toEqual([])
  })
})
