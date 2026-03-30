import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Breadcrumb } from './breadcrumb'

it('renders navigation landmark', async () => {
  const screen = await render(
    <Breadcrumb.Root aria-label="Breadcrumb" wrap={false}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item isCurrent>
          <Breadcrumb.Link href="/current">Current</Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>,
  )

  await expect.element(screen.getByRole('navigation')).toBeVisible()
})

it('current page link has aria-current="page"', async () => {
  const screen = await render(
    <Breadcrumb.Root aria-label="Breadcrumb" wrap={false}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item isCurrent>
          <Breadcrumb.Link href="/current">Current</Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>,
  )

  await expect.element(screen.getByText('Current')).toHaveAttribute('aria-current', 'page')
})
