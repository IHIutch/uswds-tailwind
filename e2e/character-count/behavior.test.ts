import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { CharacterCount } from '../../packages/compat/src/character-count'
import { createDisposableCharacterCount, createDisposableCharacterCounts } from './_utils.js'

const rootId = 'behavior'

function template({ id = rootId, tag = 'input', value = '', maxLength = 5 }: { id?: string, tag?: 'input' | 'textarea', value?: string, maxLength?: number } = {}) {
  const field = tag === 'textarea'
    ? `<textarea data-part="input" id="${id}-input" name="${id}" maxlength="${maxLength}">${value}</textarea>`
    : `<input data-part="input" id="${id}-input" name="${id}" maxlength="${maxLength}" value="${value}" />`
  return `<form>
    <div data-scope="character-count" data-part="root" id="${id}">
      <div data-part="control">
        <label for="${id}-input">Message</label>
        ${field}
        <span data-part="description"></span>
      </div>
      <div data-part="status"></div>
      <div data-part="sr-status"></div>
    </div>
  </form>`
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L121-L130 (count text for input and textarea)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L41-L43 (the label targets the field)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L205-L239 (over-limit status; v3.14 delays validity recovery by 100 ms)
it.each(['input', 'textarea'] as const)('%s reports the limit, recovers from an over-limit value, and submits the edited text', { tags: ['parity'] }, async (tag) => {
  await using component = createDisposableCharacterCount(rootId, template({ tag }))
  const input = component.elements.getInputEl()
  const status = component.elements.getStatusEl()!
  const label = component.elements.getLabelEl() as HTMLLabelElement
  const form = input.closest('form')!

  expect(status.textContent).toBe('5 characters allowed')
  expect(label.control).toBe(input)

  await userEvent.fill(input, 'abcdef')
  expect(status.textContent).toBe('1 character over limit')
  expect(input.validationMessage).toBe('The content is too long.')
  expect(new FormData(form).get(input.name)).toBe('abcdef')

  await userEvent.fill(input, 'abcd')
  expect(status.textContent).toBe('1 character left')
  expect(input.validationMessage).toBe('')
  expect(new FormData(form).get(input.name)).toBe('abcd')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L165-L183 (only the component's own validity message is set or cleared)
it('keeps an existing field validation error while counting characters', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const input = component.elements.getInputEl()
  input.setCustomValidity('Please correct this field.')
  await userEvent.fill(input, 'abcdef')
  expect(component.elements.getStatusEl()?.textContent).toBe('1 character over limit')
  expect(input.validationMessage).toBe('Please correct this field.')
  await userEvent.fill(input, 'abc')
  expect(input.validationMessage).toBe('Please correct this field.')
})

it('updates its own validation message when errorText changes', { tags: ['new'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template({ value: 'abcdef' }), {
    maxLength: 5,
    errorText: 'Too many characters.',
  })
  const input = component.elements.getInputEl()
  expect(input.validationMessage).toBe('Too many characters.')
  component.elements.getInstance()?.machine.updateProps({ errorText: 'Please shorten this text.' })
  await vi.waitFor(() => expect(input.validationMessage).toBe('Please shorten this text.'))
  await userEvent.fill(input, 'abcd')
  expect(input.validationMessage).toBe('')
})

it('does not replace a different validator after its own error is overridden', { tags: ['new'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template({ value: 'abcdef' }), {
    maxLength: 5,
    errorText: 'Too many characters.',
  })
  const input = component.elements.getInputEl()
  expect(input.validationMessage).toBe('Too many characters.')
  input.setCustomValidity('Please correct this field.')
  component.elements.getInstance()?.machine.updateProps({ errorText: 'Please shorten this text.' })
  await userEvent.fill(input, 'abcdefg')
  expect(input.validationMessage).toBe('Please correct this field.')
  await userEvent.fill(input, 'abcd')
  expect(input.validationMessage).toBe('Please correct this field.')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L90-L103 (USWDS starts with the default status; deriving the prefill immediately is a port addition)
it('shows the count and validity for a prefilled field on first render', { tags: ['new'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template({ value: 'abcdef' }))
  const input = component.elements.getInputEl()
  expect(input.value).toBe('abcdef')
  expect(component.elements.getStatusEl()?.textContent).toBe('1 character over limit')
  expect(input.validationMessage).toBe('The content is too long.')
  expect(new FormData(input.closest('form')!).get(input.name)).toBe('abcdef')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L270-L281 (USWDS handles native input; controlled value ownership is a port addition)
it('waits for the owner to accept a controlled edit before changing the count', { tags: ['new'] }, async () => {
  const onValueChange = vi.fn()
  await using component = createDisposableCharacterCount(rootId, template({ value: 'abc' }), {
    maxLength: 5,
    value: 'abc',
    onValueChange,
  })
  const input = component.elements.getInputEl()
  const status = component.elements.getStatusEl()!
  expect(status.textContent).toBe('2 characters left')
  await userEvent.fill(input, 'abcdef')
  await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith({ value: 'abcdef' }))
  expect(component.elements.getInstance()?.api.value).toBe('abc')
  expect(status.textContent).toBe('2 characters left')

  component.elements.getInstance()?.machine.updateProps({ value: 'abcdef' })
  await vi.waitFor(() => expect(status.textContent).toBe('1 character over limit'))
  expect(input.validationMessage).toBe('The content is too long.')
  expect(onValueChange).toHaveBeenCalledTimes(1)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L270-L281 (USWDS handles native input; the setter is a port addition)
it('a programmatic setter updates an uncontrolled field and its validation', { tags: ['new'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const input = component.elements.getInputEl()
  const status = component.elements.getStatusEl()!
  component.elements.getInstance()?.api.setValue('abcdef')
  await vi.waitFor(() => expect(status.textContent).toBe('1 character over limit'))
  expect(input.value).toBe('abcdef')
  expect(input.validationMessage).toBe('The content is too long.')
  expect(new FormData(input.closest('form')!).get(input.name)).toBe('abcdef')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L201-L205 (a falsy limit returns before any count or validity update)
it('a zero limit leaves counting and validation inert while the field stays editable', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template({ maxLength: 0 }))
  const input = component.elements.getInputEl()
  const status = component.elements.getStatusEl()!
  const srStatus = component.elements.getSrStatusEl()!
  expect(status.textContent).toBe('')
  await userEvent.fill(input, 'abc')
  expect(input.value).toBe('abc')
  expect(status.textContent).toBe('')
  expect(srStatus.textContent).toBe('')
  expect(input.validationMessage).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L152-L154 (the shared trailing debounce; v3.14 waits 1200 ms)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L209-L224 (visual status updates before the screen reader status)
it('updates the visible count immediately and announces only the latest edit after the quiet period', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const input = component.elements.getInputEl()
  const status = component.elements.getStatusEl()!
  const srStatus = component.elements.getSrStatusEl()!
  await userEvent.fill(input, 'ab')
  await userEvent.fill(input, 'abcd')
  expect(status.textContent).toBe('1 character left')
  expect(srStatus.textContent).toBe('5 characters allowed')
  await vi.waitFor(() => expect(srStatus.textContent).toBe('1 character left'), { timeout: 1700 })
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L214-L220 (assertive over-limit warning)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L23-L25 (1200 ms debounce)
it('announces an exceeded limit assertively after typing pauses', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const input = component.elements.getInputEl()
  const srStatus = component.elements.getSrStatusEl()!
  await userEvent.fill(input, 'abcdef')
  expect(srStatus.textContent).toBe('5 characters allowed')
  await vi.waitFor(() => {
    expect(srStatus.textContent).toBe('Character limit exceeded. 1 character over limit')
    expect(srStatus.getAttribute('aria-live')).toBe('assertive')
  }, { timeout: 1900 })
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L205-L213 (quick recovery cancels a pending warning)
it('announces recovery promptly and politely after returning under the limit', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const input = component.elements.getInputEl()
  const srStatus = component.elements.getSrStatusEl()!
  await userEvent.fill(input, 'abcdef')
  await userEvent.fill(input, 'abcd')
  await vi.waitFor(() => {
    expect(srStatus.textContent).toBe('1 character left')
    expect(srStatus.getAttribute('aria-live')).toBe('polite')
  }, { timeout: 500 })
  await new Promise(resolve => setTimeout(resolve, 1250))
  expect(srStatus.textContent).toBe('1 character left')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L103-L111 (aria-live starts after insertion)
it('activates the screen-reader live region after mount', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const srStatus = component.elements.getSrStatusEl()!
  expect(srStatus.hasAttribute('aria-live')).toBe(false)
  await vi.waitFor(() => expect(srStatus.getAttribute('aria-live')).toBe('polite'), { timeout: 500 })
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L23-L25 (1200 ms quiet period)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L145-L154 (debounced announcement)
it('waits the USWDS 1200 ms quiet period before a normal announcement', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template())
  const status = component.elements.getStatusEl()!
  const srStatus = component.elements.getSrStatusEl()!
  await vi.waitFor(() => expect(srStatus.getAttribute('aria-live')).toBe('polite'))
  vi.useFakeTimers()
  try {
    component.elements.getInstance()?.api.setValue('ab')
    await vi.advanceTimersByTimeAsync(0)
    expect(status.textContent).toBe('3 characters left')
    await vi.advanceTimersByTimeAsync(1199)
    expect(srStatus.textContent).toBe('5 characters allowed')
    await vi.advanceTimersByTimeAsync(1)
    expect(srStatus.textContent).toBe('3 characters left')
  }
  finally {
    vi.useRealTimers()
  }
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L152-L154 (the debounce is shared by every counter in the module)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L221-L224 (each edit schedules its counter's status)
it('announces the most recently edited counter when two counters share a page', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCounts(template({ id: 'first' }) + template({ id: 'second' }))
  const firstInput = component.elements.getInputEl('first')!
  const firstStatus = component.elements.getStatusEl('first')!
  const firstSrStatus = component.elements.getSrStatusEl('first')!
  const secondInput = component.elements.getInputEl('second')!
  const secondStatus = component.elements.getStatusEl('second')!
  const secondSrStatus = component.elements.getSrStatusEl('second')!

  await userEvent.fill(firstInput, 'abc')
  await userEvent.fill(secondInput, 'a')
  expect(firstStatus.textContent).toBe('2 characters left')
  expect(secondStatus.textContent).toBe('4 characters left')
  await vi.waitFor(() => expect(secondSrStatus.textContent).toBe('4 characters left'), { timeout: 2500 })
  expect(firstSrStatus.textContent).toBe('5 characters allowed')
})

it('removing another counter preserves the latest pending announcement', { tags: ['new'] }, async () => {
  await using component = createDisposableCharacterCounts(template({ id: 'first' }) + template({ id: 'second' }))
  const firstRoot = component.elements.getRootEl('first')!
  const secondSrStatus = component.elements.getSrStatusEl('second')!

  await userEvent.fill(component.elements.getInputEl('first')!, 'abc')
  await userEvent.fill(component.elements.getInputEl('second')!, 'a')
  CharacterCount.getInstance(firstRoot)!.destroy()
  firstRoot.remove()

  await vi.waitFor(() => expect(secondSrStatus.textContent).toBe('4 characters left'), { timeout: 1700 })
})
