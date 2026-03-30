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

it('fieldset renders as role="group"', async () => {
  const screen = await render(
    <Fieldset.Root>
      <Fieldset.Legend>Contact Info</Fieldset.Legend>
    </Fieldset.Root>,
  )

  await expect.element(screen.getByRole('group')).toBeVisible()
})
