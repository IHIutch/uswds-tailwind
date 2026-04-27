import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { SideNavigation } from './side-navigation'

it('renders navigation element', async () => {
  const screen = await render(
    <SideNavigation.Root aria-label="Side navigation">
      <SideNavigation.List>
        <SideNavigation.ListItem>
          <SideNavigation.Link href="/one">Page One</SideNavigation.Link>
        </SideNavigation.ListItem>
      </SideNavigation.List>
    </SideNavigation.Root>,
  )

  await expect.element(screen.getByRole('navigation')).toBeVisible()
})

it('current link has aria-current="page"', async () => {
  const screen = await render(
    <SideNavigation.Root aria-label="Side navigation">
      <SideNavigation.List>
        <SideNavigation.ListItem>
          <SideNavigation.Link href="/one" isCurrent>Current Page</SideNavigation.Link>
        </SideNavigation.ListItem>
      </SideNavigation.List>
    </SideNavigation.Root>,
  )

  await expect.element(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page')
})
