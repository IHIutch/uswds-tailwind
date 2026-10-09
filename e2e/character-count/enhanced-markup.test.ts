import { expect, it } from 'vitest'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'markup'

const template = `<div data-scope="character-count" data-part="root" id="${rootId}">
  <label for="markup-input">Message</label>
  <input data-part="input" id="markup-input" maxlength="5" />
  <span data-part="description" aria-live="polite">You can enter up to 5 characters</span>
  <div data-part="status"></div>
  <div data-part="sr-status"></div>
</div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L67-L76 (maxlength moves to the root's data-maxlength)
it('moves the input maxlength to the root', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  await expect.element(component.elements.getRootEl()).toHaveAttribute('data-maxlength', '5')
  await expect.element(component.elements.getInputEl()).not.toHaveAttribute('maxlength')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L98 (the visual status is hidden from screen readers)
it('hides the visual status from screen readers', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  await expect.element(component.elements.getStatusEl()).toHaveAttribute('aria-hidden', 'true')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L254-L256 (the requirements hint stops being a live region)
it('stops the requirements hint from being a live region', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  await expect.element(component.elements.getDescriptionEl()).not.toHaveAttribute('aria-live', 'polite')
})
