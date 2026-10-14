import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { expectNever } from '../_utils'
import { createDisposableFileInput, file, fileInputTemplate } from './_utils'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L277 (status is screen reader only)
it('visually hides the status message', { tags: ['parity'] }, async () => {
  await using _component = createDisposableFileInput('status', fileInputTemplate({ id: 'status' }))

  await expect.element(page.getByRole('status')).toHaveTextContent('No file selected.')
  await expect.element(page.getByRole('status')).not.toBeInViewport()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L293-L304 (no status region for a disabled input)
it('has no status region when the input starts disabled', { tags: ['parity'] }, async () => {
  await using _component = createDisposableFileInput('status', fileInputTemplate({ id: 'status', disabled: true }))

  await expect.element(page.getByRole('status')).not.toBeInTheDocument()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L293-L304 (no status region for an aria-disabled input)
it('has no status region when the input starts aria-disabled', { tags: ['parity'] }, async () => {
  await using _component = createDisposableFileInput('status', fileInputTemplate({ id: 'status', ariaDisabled: true }))

  await expect.element(page.getByRole('status')).not.toBeInTheDocument()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L603-L607 (a rejected selection skips the status update)
it('does not announce a rejected selection', { tags: ['parity'] }, async () => {
  await using component = createDisposableFileInput('status', fileInputTemplate({ id: 'status', accept: '.png' }))
  const { getErrorMessageEl, getInputEl } = component.elements

  await userEvent.upload(getInputEl()!, [file('bad.pdf', 'application/pdf')])
  await expect.element(getErrorMessageEl()!).toBeVisible()
  await expectNever(() => expect(page.getByRole('status').query()?.textContent).not.toBe('No file selected.'), 1500)
})
