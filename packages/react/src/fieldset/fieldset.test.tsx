import * as React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Fieldset } from './fieldset'

it('renders fieldset with legend text visible', async () => {
  const screen = await render(
    <Fieldset.Root>
      <Fieldset.Legend>Contact Info</Fieldset.Legend>
    </Fieldset.Root>,
  )

  await expect.element(screen.getByText('Contact Info')).toBeVisible()
})

it('associates the fieldset with its legend', async () => {
  await render(
    <Fieldset.Root>
      <Fieldset.Legend>Contact Info</Fieldset.Legend>
    </Fieldset.Root>,
  )

  const fieldset = document.querySelector('fieldset')
  const legend = fieldset?.querySelector('legend')
  expect(legend?.id).toBeTruthy()
  expect(fieldset?.getAttribute('aria-labelledby')).toBe(legend?.id)
})

it('associates the fieldset with its description', async () => {
  await render(
    <Fieldset.Root>
      <Fieldset.Legend>Contact Info</Fieldset.Legend>
      <Fieldset.Description>Enter your contact details.</Fieldset.Description>
    </Fieldset.Root>,
  )

  const fieldset = document.querySelector('fieldset')
  const description = fieldset?.querySelector('[data-part="description"]')
  expect(description?.id).toBeTruthy()
  expect(fieldset?.getAttribute('aria-describedby')).toBe(description?.id)
})

it('fieldset renders as role="group"', async () => {
  const screen = await render(
    <Fieldset.Root>
      <Fieldset.Legend>Contact Info</Fieldset.Legend>
    </Fieldset.Root>,
  )

  await expect.element(screen.getByRole('group')).toBeVisible()
})

it('forwarded ref is set on root element', async () => {
  const ref = React.createRef<HTMLFieldSetElement>()
  await render(
    <Fieldset.Root ref={ref}>
      <Fieldset.Legend>Info</Fieldset.Legend>
    </Fieldset.Root>,
  )
  expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
})
