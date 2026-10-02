import { expect, it } from 'vitest'
import { createDisposableTooltips, TOOLTIP } from './_utils.js'

function render(...ids: string[]) {
  return createDisposableTooltips(ids.map(id => TOOLTIP(id)).join(''))
}

async function flush() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

async function show(trigger: HTMLElement) {
  trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  await flush()
}

async function hide(root: HTMLElement) {
  root.dispatchEvent(new MouseEvent('mouseleave'))
  await flush()
}

it('renders the trigger, description link, and hidden content', { tags: ['parity'] }, async () => {
  await using fixture = render('rest')
  const trigger = fixture.elements.getTriggerEl('rest')
  const content = fixture.elements.getContentEl('rest')
  expect(trigger.getAttribute('tabindex')).toBe('0')
  expect(trigger.getAttribute('aria-describedby')).toBe(content.id)
  expect(trigger.getAttribute('data-placement')).toBe('top')
  expect(content.getAttribute('role')).toBe('tooltip')
  expect(content.getAttribute('aria-hidden')).toBe('true')
  expect(content.getAttribute('data-state')).toBe('closed')
  expect(content.textContent).toBe('Tooltip rest')
})

it('reveals after opening and removes visibility on leave', { tags: ['parity'] }, async () => {
  await using fixture = render('reveal')
  const root = fixture.elements.getRootEl('reveal')
  const trigger = fixture.elements.getTriggerEl('reveal')
  const content = fixture.elements.getContentEl('reveal')
  await show(trigger)
  expect(content.getAttribute('data-state')).toBe('open')
  expect(content.getAttribute('aria-hidden')).toBe('false')
  await expect.poll(() => content.hasAttribute('data-visible')).toBe(true)
  await hide(root)
  expect(content.getAttribute('data-state')).toBe('closed')
  expect(content.getAttribute('aria-hidden')).toBe('true')
  expect(content.hasAttribute('data-visible')).toBe(false)
})

it('closes all open tooltips on Escape', { tags: ['parity'] }, async () => {
  await using fixture = render('first', 'second')
  const first = { trigger: fixture.elements.getTriggerEl('first'), content: fixture.elements.getContentEl('first') }
  const second = { trigger: fixture.elements.getTriggerEl('second'), content: fixture.elements.getContentEl('second') }
  await show(first.trigger)
  await show(second.trigger)
  first.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await flush()
  expect(first.content.getAttribute('data-state')).toBe('closed')
  expect(second.content.getAttribute('data-state')).toBe('closed')
})

for (const { name, modifiers, closes } of [
  { name: 'Control', modifiers: { ctrlKey: true }, closes: true },
  { name: 'Shift', modifiers: { shiftKey: true }, closes: false },
  { name: 'Alt', modifiers: { altKey: true }, closes: false },
  { name: 'Meta', modifiers: { metaKey: true }, closes: false },
]) {
  it(`${name}+Escape ${closes ? 'closes' : 'keeps'} the tooltip`, { tags: ['parity'] }, async () => {
    await using fixture = render(name)
    const trigger = fixture.elements.getTriggerEl(name)
    const content = fixture.elements.getContentEl(name)
    await show(trigger)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, ...modifiers }))
    await flush()
    expect(content.getAttribute('data-state')).toBe(closes ? 'closed' : 'open')
  })
}

it('repositions on another mouseover and keeps the last position after closing', { tags: ['parity'] }, async () => {
  await using fixture = render('repeat')
  const root = fixture.elements.getRootEl('repeat')
  const trigger = fixture.elements.getTriggerEl('repeat')
  const content = fixture.elements.getContentEl('repeat')
  await show(trigger)
  const firstMargin = content.style.getPropertyValue('--tooltip-margin')
  expect(firstMargin).not.toBe('')
  trigger.style.margin = '30px'
  await show(trigger)
  const secondMargin = content.style.getPropertyValue('--tooltip-margin')
  expect(secondMargin).not.toBe(firstMargin)
  const placement = content.getAttribute('data-placement')
  await hide(root)
  expect(content.getAttribute('data-placement')).toBe(placement)
  expect(content.style.getPropertyValue('--tooltip-margin')).toBe(secondMargin)
})

it('drops the wrap marker on close after every placement is clipped', { tags: ['parity'] }, async () => {
  await using fixture = render('clipped')
  const root = fixture.elements.getRootEl('clipped')
  const trigger = fixture.elements.getTriggerEl('clipped')
  const content = fixture.elements.getContentEl('clipped')
  let probes = 0
  content.getBoundingClientRect = () => {
    probes++
    return DOMRect.fromRect({ x: -9999, y: -9999, width: 0, height: 0 })
  }
  await show(trigger)
  expect(probes).toBe(13)
  expect(content.hasAttribute('data-wrap')).toBe(true)
  expect(content.getAttribute('data-placement')).toBe('left')
  await hide(root)
  expect(content.hasAttribute('data-wrap')).toBe(false)
  expect(content.getAttribute('data-placement')).toBe('left')
})
