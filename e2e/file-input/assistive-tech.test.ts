import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableFileInput, file, fileInputTemplate } from './_utils'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L236 (instructions are aria-hidden; the input's aria-label carries them)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L463-L464 (previews are aria-hidden with an empty alt)
it('hides instructions and previews from assistive tech', { tags: ['parity'] }, async () => {
  await using component = createDisposableFileInput('a11y', fileInputTemplate({ id: 'a11y' }))
  const { getInputEl, getInstructionsEl, getItemEl, getItemPreviewImageEl } = component.elements

  await expect.element(getInstructionsEl()!).toHaveAttribute('aria-hidden', 'true')

  await userEvent.upload(getInputEl()!, [file('photo.png', 'image/png')])
  await expect.poll(() => getItemEl('photo.png')?.getAttribute('aria-hidden')).toBe('true')
  await expect.element(getItemPreviewImageEl('photo.png')!).toHaveAttribute('alt', '')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-file-input/src/index.js#L554 (the visible error is aria-hidden; the input's aria-label carries it)
it('hides the visible error from assistive tech', { tags: ['parity'] }, async () => {
  await using component = createDisposableFileInput('a11y', fileInputTemplate({ id: 'a11y', accept: '.png' }))
  const { getErrorMessageEl, getInputEl } = component.elements

  await userEvent.upload(getInputEl()!, [file('bad.pdf', 'application/pdf')])
  await expect.element(getErrorMessageEl()!).toBeVisible()
  await expect.element(getErrorMessageEl()!).toHaveAttribute('aria-hidden', 'true')
})
