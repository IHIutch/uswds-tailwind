import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Input } from '../input/input'
import { InputGroup } from './input-group'

it('renders input within the group', async () => {
  const screen = await render(
    <InputGroup>
      <Input />
    </InputGroup>,
  )

  await expect.element(screen.getByRole('textbox')).toBeVisible()
})

it('renders with start and end elements visible', async () => {
  const screen = await render(
    <InputGroup
      startElement={<span>start</span>}
      endElement={<span>end</span>}
    >
      <Input />
    </InputGroup>,
  )

  await expect.element(screen.getByText('start')).toBeVisible()
  await expect.element(screen.getByText('end')).toBeVisible()
})
