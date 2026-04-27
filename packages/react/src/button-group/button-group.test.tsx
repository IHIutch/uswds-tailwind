import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { ButtonGroup } from './button-group'

it('renders children buttons visible', async () => {
  const screen = await render(
    <ButtonGroup.Root>
      <ButtonGroup.Button>Save</ButtonGroup.Button>
      <ButtonGroup.Button variant="outline">Cancel</ButtonGroup.Button>
    </ButtonGroup.Root>,
  )

  await expect.element(screen.getByRole('button', { name: 'Save' })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Cancel' })).toBeVisible()
})
