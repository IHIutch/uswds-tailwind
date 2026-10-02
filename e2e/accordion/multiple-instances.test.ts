import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableAccordions } from './_utils.js'

function ITEM(value: string, content = '') {
  return `
    <li data-part="item" data-value="${value}">
      <button data-part="item-trigger">Section ${value}</button>
      <div data-part="item-content">${content}</div>
    </li>
  `
}

function ACCORDION(id: string, items: string) {
  return `<ul data-scope="accordion" data-part="root" id="${id}">${items}</ul>`
}

it('renders wrapped item parts without borrowing parts from a nested accordion', { tags: ['new'] }, async () => {
  await using component = createDisposableAccordions(ACCORDION('outer', `
    <li data-part="item" data-value="outer-item">
      ${ACCORDION('inner', ITEM('a'))}
      <h2><span><button data-part="item-trigger">Outer section</button></span></h2>
      <section><div data-part="item-content">Outer content</div></section>
    </li>
  `))
  const { getItemEl, getTriggerEl, getContentEl } = component.elements
  const outerItem = getItemEl('outer', 'outer-item')!
  const outerTrigger = outerItem.querySelector<HTMLButtonElement>('h2 button')!
  const outerContent = outerItem.querySelector<HTMLElement>(':scope > section > [data-part="item-content"]')!
  const innerTrigger = getTriggerEl('inner', 'a')!
  const innerContent = getContentEl('inner', 'a')!

  expect(outerTrigger.getAttribute('aria-expanded')).toBe('false')
  expect(outerTrigger.getAttribute('aria-controls')).toBe(outerContent.id)
  expect(outerContent.hidden).toBe(true)

  await userEvent.click(outerTrigger)
  expect(outerTrigger.getAttribute('aria-expanded')).toBe('true')
  expect(outerContent.hidden).toBe(false)
  expect(innerTrigger.getAttribute('aria-expanded')).toBe('false')
  expect(innerTrigger.getAttribute('aria-controls')).toBe(innerContent.id)

  await userEvent.click(innerTrigger)
  expect(innerTrigger.getAttribute('aria-expanded')).toBe('true')
  expect(innerContent.hidden).toBe(false)
  expect(outerTrigger.getAttribute('aria-expanded')).toBe('true')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L20-L24 (an accordion only owns the buttons whose closest accordion is itself)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-accordion/src/index.js#L47-L53 (collapsing others is limited to that accordion's own buttons)
describe('multiple accordions', { tags: ['parity'] }, () => {
  it('sibling accordions with the same item values toggle independently', async () => {
    await using component = createDisposableAccordions(`${ACCORDION('one', ITEM('a') + ITEM('b'))}${ACCORDION('two', ITEM('a') + ITEM('b'))}`)
    const { getRootEl, getTriggerEl, getContentEl } = component.elements

    await userEvent.click(getTriggerEl('one', 'a')!)
    expect(getTriggerEl('one', 'a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('one', 'a')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('two', 'a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getContentEl('two', 'a')?.hasAttribute('hidden')).toBeTruthy()

    await userEvent.click(getTriggerEl('two', 'a')!)
    expect(getTriggerEl('two', 'a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('two', 'a')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('one', 'a')?.getAttribute('aria-expanded')).toBe('true')

    // aria-controls resolves to a panel inside the same accordion, never the sibling's.
    const controlled = document.getElementById(getTriggerEl('one', 'a')!.getAttribute('aria-controls')!)
    expect(controlled).toBe(getContentEl('one', 'a'))
    expect(getRootEl('two')?.contains(controlled)).toBe(false)
  })

  it('nested accordions never affect each other', async () => {
    await using component = createDisposableAccordions(ACCORDION('outer', ITEM('outer-item', ACCORDION('inner', ITEM('a') + ITEM('b')))))
    const { getTriggerEl, getContentEl } = component.elements

    await userEvent.click(getTriggerEl('outer', 'outer-item')!)
    expect(getTriggerEl('outer', 'outer-item')?.getAttribute('aria-expanded')).toBe('true')
    expect(getTriggerEl('inner', 'a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getTriggerEl('inner', 'b')?.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(getTriggerEl('inner', 'a')!)
    expect(getTriggerEl('inner', 'a')?.getAttribute('aria-expanded')).toBe('true')
    expect(getContentEl('inner', 'a')?.hasAttribute('hidden')).toBeFalsy()
    expect(getTriggerEl('outer', 'outer-item')?.getAttribute('aria-expanded')).toBe('true')

    await userEvent.click(getTriggerEl('inner', 'b')!)
    expect(getTriggerEl('inner', 'b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getTriggerEl('inner', 'a')?.getAttribute('aria-expanded')).toBe('false')
    expect(getTriggerEl('outer', 'outer-item')?.getAttribute('aria-expanded')).toBe('true')

    // Collapsing the outer item hides the inner accordion but leaves its own state alone.
    await userEvent.click(getTriggerEl('outer', 'outer-item')!)
    expect(getTriggerEl('outer', 'outer-item')?.getAttribute('aria-expanded')).toBe('false')
    expect(getTriggerEl('inner', 'b')?.getAttribute('aria-expanded')).toBe('true')
    expect(getTriggerEl('inner', 'a')?.getAttribute('aria-expanded')).toBe('false')
  })
})
