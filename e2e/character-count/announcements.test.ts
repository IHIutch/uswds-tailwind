import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCharacterCount, createDisposableCharacterCounts } from './_utils.js'

function template(id: string, { maxLength, value = '' }: { maxLength?: number, value?: string } = {}) {
  return `<div data-scope="character-count" data-part="root" id="${id}">
    <label for="${id}-input">Message</label>
    <input data-part="input" id="${id}-input" ${maxLength ? `maxlength="${maxLength}"` : ''} value="${value}" />
    <div data-part="status"></div>
    <div data-part="sr-status"></div>
  </div>`
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L261-L265 (init records a prefilled over-limit value)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L205-L213 (crossing under the limit announces after 100 ms)
it('announces recovery promptly for a field that starts over the limit', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount('prefilled', template('prefilled', { maxLength: 5, value: 'abcdef' }))
  await userEvent.fill(component.elements.getInputEl(), 'abcd')
  await expect.element(component.elements.getSrStatusEl(), { timeout: 500 }).toHaveTextContent('1 character left')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L152-L154 (counters share one announcement debounce)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L203 (a counter without a limit returns before announcing)
it('typing in a counter without a limit keeps another counter\'s pending announcement', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCounts(template('limited', { maxLength: 5 }) + template('unlimited'))
  await userEvent.fill(component.elements.getInputEl('limited')!, 'abc')
  await userEvent.fill(component.elements.getInputEl('unlimited')!, 'x')
  await expect.element(component.elements.getSrStatusEl('limited'), { timeout: 2000 }).toHaveTextContent('2 characters left')
})
