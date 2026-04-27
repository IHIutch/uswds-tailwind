import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Tag } from './tag'

it('renders tag text content', async () => {
  const screen = await render(<Tag>New</Tag>)

  await expect.element(screen.getByText('New')).toBeVisible()
})
