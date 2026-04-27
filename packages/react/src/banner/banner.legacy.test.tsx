import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Banner } from './banner'

// Behavioral parity tests mirroring legacy USWDS banner. The React banner
// is a layout wrapper around the collapse machine; the trigger button
// toggles the content's `hidden` attribute and its own aria-expanded.

function renderBanner() {
  return render(
    <Banner.Root>
      <Banner.Header>
        <Banner.HeaderText>
          <p>Official site</p>
          <Banner.Trigger>
            Here's how you know
          </Banner.Trigger>
        </Banner.HeaderText>
      </Banner.Header>
      <Banner.Content>
        <p>Banner content</p>
      </Banner.Content>
    </Banner.Root>,
  )
}

// USWDS toggles content via the `hidden` HTML attribute; our React banner
// uses Tailwind's `not-data-[state=open]:hidden` class instead. Both achieve
// the same user-visible result (content not rendered visibly), so we assert
// visibility rather than a specific attribute.

it('initializes collapsed: trigger aria-expanded=false, content not visible', async () => {
  const screen = await renderBanner()
  const trigger = screen.getByRole('button', { name: /here's how you know/i })
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect.element(screen.getByText('Banner content')).not.toBeVisible()
})

it('clicking the trigger expands the banner and reveals content', async () => {
  const screen = await renderBanner()
  const trigger = screen.getByRole('button', { name: /here's how you know/i })
  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect.element(screen.getByText('Banner content')).toBeVisible()
})

it('clicking again collapses the banner', async () => {
  const screen = await renderBanner()
  const trigger = screen.getByRole('button', { name: /here's how you know/i })
  await userEvent.click(trigger)
  await userEvent.click(trigger)
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect.element(screen.getByText('Banner content')).not.toBeVisible()
})
