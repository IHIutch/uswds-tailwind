import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCollapses } from './_utils.js'

function COLLAPSE(id: string, content = '<p>Official websites use .gov</p>') {
  return `
  <section data-scope="collapse" data-part="root" id="${id}">
    <button data-part="trigger">
      Here's how you know
    </button>
    <div data-part="content">
      ${content}
    </div>
  </section>
`
}

type Collapses = ReturnType<typeof createDisposableCollapses>['elements']

function expectOpen(elements: Collapses, id: string) {
  expect(elements.getRootEl(id)?.getAttribute('data-state')).toBe('open')
  expect(elements.getTriggerEl(id)?.getAttribute('aria-expanded')).toBe('true')
  expect(elements.getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
}

function expectClosed(elements: Collapses, id: string) {
  expect(elements.getRootEl(id)?.getAttribute('data-state')).toBe('closed')
  expect(elements.getTriggerEl(id)?.getAttribute('aria-expanded')).toBe('false')
  expect(elements.getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
}

// Every collapse has its own root, trigger and content, and each trigger's aria-controls points at its own content.
function expectOwnParts(elements: Collapses, ids: string[]) {
  const els = ids.flatMap(id => [elements.getRootEl(id), elements.getTriggerEl(id), elements.getContentEl(id)])
  expect(els.every(el => el !== null)).toBe(true)
  expect(new Set(els).size).toBe(els.length)

  for (const id of ids) {
    expect(elements.getRootEl(id)?.contains(elements.getTriggerEl(id))).toBe(true)
    expect(elements.getRootEl(id)?.contains(elements.getContentEl(id))).toBe(true)
    expect(elements.getTriggerEl(id)?.getAttribute('aria-controls')).toBe(elements.getContentEl(id)?.id)
  }
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-banner/src/index.js#L15-L21 (toggleBanner toggles only the clicked trigger)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/toggle.js#L14-L20 (content is resolved from the trigger's own aria-controls)
it('sibling collapses stay isolated through alternating clicks', { tags: ['parity'] }, async () => {
  await using component = createDisposableCollapses(`${COLLAPSE('one')}${COLLAPSE('two')}`)
  const { elements } = component

  expectOwnParts(elements, ['one', 'two'])
  expectClosed(elements, 'one')
  expectClosed(elements, 'two')

  await userEvent.click(elements.getTriggerEl('one')!)
  expectOpen(elements, 'one')
  expectClosed(elements, 'two')

  await userEvent.click(elements.getTriggerEl('two')!)
  expectOpen(elements, 'one')
  expectOpen(elements, 'two')

  await userEvent.click(elements.getTriggerEl('one')!)
  expectClosed(elements, 'one')
  expectOpen(elements, 'two')

  await userEvent.click(elements.getTriggerEl('two')!)
  expectClosed(elements, 'one')
  expectClosed(elements, 'two')

  expectOwnParts(elements, ['one', 'two'])
})

it('nested collapses stay scoped through alternating clicks', { tags: ['parity'] }, async () => {
  await using component = createDisposableCollapses(COLLAPSE('outer', COLLAPSE('inner')))
  const { elements } = component

  expectOwnParts(elements, ['outer', 'inner'])
  expect(elements.getContentEl('outer')?.contains(elements.getRootEl('inner'))).toBe(true)
  expectClosed(elements, 'outer')
  expectClosed(elements, 'inner')

  await userEvent.click(elements.getTriggerEl('outer')!)
  expectOpen(elements, 'outer')
  expectClosed(elements, 'inner')

  await userEvent.click(elements.getTriggerEl('inner')!)
  expectOpen(elements, 'outer')
  expectOpen(elements, 'inner')

  await userEvent.click(elements.getTriggerEl('inner')!)
  expectOpen(elements, 'outer')
  expectClosed(elements, 'inner')

  await userEvent.click(elements.getTriggerEl('outer')!)
  expectClosed(elements, 'outer')
  expectClosed(elements, 'inner')

  expectOwnParts(elements, ['outer', 'inner'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/behavior.js#L108-L114 (off() removes one target's listeners, leaving peers bound)
it.each([
  { removed: 'first', survivor: 'second' },
  { removed: 'second', survivor: 'first' },
])('removal of the $removed peer retains the opened survivor', { tags: ['parity'] }, async ({ removed, survivor }) => {
  await using component = createDisposableCollapses(`${COLLAPSE('first')}${COLLAPSE('second')}`)
  const { elements } = component
  const removedRootEl = elements.getRootEl(removed)!
  const removedTriggerEl = elements.getTriggerEl(removed)!

  await userEvent.click(elements.getTriggerEl(survivor)!)
  expectOpen(elements, survivor)
  expectClosed(elements, removed)

  elements.getInstance(removed)!.destroy()
  removedRootEl.remove()

  expect(elements.getInstance(survivor)).not.toBeNull()
  expectOwnParts(elements, [survivor])
  expectOpen(elements, survivor)

  await userEvent.click(elements.getTriggerEl(survivor)!)
  expectClosed(elements, survivor)

  // A click on the removed, detached trigger must not reach the survivor.
  removedTriggerEl.click()
  await userEvent.click(elements.getTriggerEl(survivor)!)
  expectOpen(elements, survivor)
})
