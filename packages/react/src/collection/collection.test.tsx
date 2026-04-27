import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Collection } from './collection'

it('renders collection item heading visible', async () => {
  const screen = await render(
    <Collection.Root>
      <Collection.List>
        <Collection.Item>
          <Collection.Heading>Item Heading</Collection.Heading>
          <Collection.Description>Item description</Collection.Description>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>,
  )

  await expect.element(screen.getByText('Item Heading')).toBeVisible()
})
