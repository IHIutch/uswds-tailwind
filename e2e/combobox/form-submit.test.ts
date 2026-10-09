import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const template = `<form>
  <div data-scope="combobox" data-part="root" id="fruit" data-default-value="apple">
    <label data-part="label">Fruit</label>
    <select data-part="hidden-select" name="fruit">
      <option value="">Choose a fruit</option>
      <option value="apple">Apple</option><option value="banana">Banana</option>
    </select>
    <input data-part="input">
    <button data-part="trigger" type="button"></button>
    <ul data-part="list"></ul>
  </div>
  <button type="submit">Submit</button>
</form>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L705-L716 (Enter in the input completes the selection and prevents the default form submission)
it('does not submit the surrounding form when Enter is pressed in the input', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const submittedValues: Array<FormDataEntryValue | null> = []
  component.elements.getRootEl().closest('form')!.addEventListener('submit', (event) => {
    event.preventDefault()
    submittedValues.push(new FormData(event.target as HTMLFormElement).get('fruit'))
  })

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{Escape}')
  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await userEvent.keyboard('{Enter}')
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveValue('Apple')
  // The same form does submit from its submit button.
  await userEvent.click(page.getByRole('button', { name: 'Submit' }))

  expect(submittedValues).toEqual(['apple'])
})
