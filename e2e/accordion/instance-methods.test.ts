import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Accordion } from '../../packages/compat/src/accordion.js'
import { destroyAllComponents } from '../../packages/compat/src/lib/component.js'
import { createDisposableAccordion } from './_utils.js'

const rootId = 'test'

function TEMPLATE({ multiple = false }: { multiple?: boolean } = {}) {
  return `
  <ul data-scope="accordion" data-part="root" id="${rootId}"${multiple ? ' data-multiple' : ''}>
    <li data-part="item" data-value="a">
      <button data-part="item-trigger">Section A</button>
      <div data-part="item-content"></div>
    </li>
    <li data-part="item" data-value="b">
      <button data-part="item-trigger">Section B</button>
      <div data-part="item-content"></div>
    </li>
    <li data-part="item" data-value="c">
      <button data-part="item-trigger">Section C</button>
      <div data-part="item-content"></div>
    </li>
  </ul>
`
}

// open(), close() and toggle() stand in for the USWDS accordion.show(), accordion.hide() and accordion.toggle().
// Every test opens A with a click first, so it starts from a known open item.
describe('instance methods', { tags: ['parity'] }, () => {
  it('global teardown clears lookup and allows a fresh instance on the same root', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE())
    const root = component.elements.getRootEl()!
    const trigger = component.elements.getTriggerEl('a')!
    destroyAllComponents()
    expect(Accordion.getInstance(root)).toBeNull()

    let changes = 0
    const fresh = Accordion.getOrCreateInstance(root, {
      id: rootId,
      onValueChange() {
        changes++
      },
    })
    try {
      await userEvent.click(trigger)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(changes).toBe(1)
      destroyAllComponents()
      expect(Accordion.getInstance(root)).toBeNull()
    }
    finally {
      fresh.destroy()
    }
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L60 (show)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L47-L53 (expanding one item collapses the others)
  it('open() opens the item and collapses the others', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE())
    const { getRootEl, getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    await Accordion.getInstance(getRootEl())?.open('b')

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('c')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('c')?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L66 (hide)
  it('close() closes an open item', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE())
    const { getRootEl, getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    await Accordion.getInstance(getRootEl())?.close('a')

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L35-L54 (toggle)
  it('toggle() opens a closed item and collapses the others', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE())
    const { getRootEl, getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    await Accordion.getInstance(getRootEl())?.toggle('b')

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/toggle.js#L8-L10 (no target state inverts the current one)
  it('toggle() closes an open item', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE())
    const { getRootEl, getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    await Accordion.getInstance(getRootEl())?.toggle('a')

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L44-L47 (data-allow-multiple skips the collapse of other buttons)
  it('open() keeps the other items open with data-multiple', async () => {
    await using component = createDisposableAccordion(rootId, TEMPLATE({ multiple: true }))
    const { getRootEl, getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl('a')!)
    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')

    await Accordion.getInstance(getRootEl())?.open('b')

    expect(getTriggerEl('a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('a')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('b')?.hasAttribute('hidden')).toBeFalsy()
  })
})
