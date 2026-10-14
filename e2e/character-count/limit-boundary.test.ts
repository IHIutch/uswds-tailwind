import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCharacterCount } from './_utils.js'

const rootId = 'boundary'

const template = `<div data-scope="character-count" data-part="root" id="${rootId}">
  <label for="boundary-input">Message</label>
  <input data-part="input" id="boundary-input" maxlength="5" />
  <div data-part="status"></div>
  <div data-part="sr-status"></div>
</div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L121-L131 (zero difference reads "left", not "over limit")
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-character-count/src/index.js#L205 (only a longer value is over the limit)
it('treats a value exactly at the limit as within it', { tags: ['parity'] }, async () => {
  await using component = createDisposableCharacterCount(rootId, template)
  const input = component.elements.getInputEl()
  await userEvent.fill(input, 'abcde')
  await expect.element(component.elements.getStatusEl()).toHaveTextContent('0 characters left')
  await expect.element(input).toBeValid()
})
