import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from '../button'
import { Tooltip } from './tooltip'

function renderTooltip() {
  return render(
    <Tooltip content="This is a tooltip" position="top">
      <Button>Hover me</Button>
    </Tooltip>,
  )
}

it('tooltip content is not visible by default', async () => {
  const screen = await renderTooltip()

  // Playwright's headless mouse starts at (0,0); if the trigger renders near
  // there, it counts as hovered and the tooltip opens immediately. Unhover
  // explicitly so we're testing the actual closed-by-default state.
  const trigger = screen.getByRole('button', { name: 'Hover me' })
  await userEvent.unhover(trigger.element())

  const content = screen.getByText('This is a tooltip')
  await expect.element(content).toHaveAttribute('data-state', 'closed')
})

it('hovering trigger shows tooltip content', async () => {
  const screen = await renderTooltip()

  const trigger = screen.getByRole('button', { name: 'Hover me' })
  await userEvent.hover(trigger.element())

  const content = screen.getByText('This is a tooltip')
  await expect.element(content).toHaveAttribute('data-state', 'open')

  await userEvent.unhover(trigger.element())
  await expect.element(content).toHaveAttribute('data-state', 'closed')
})

it('focusing trigger via keyboard shows tooltip', async () => {
  const screen = await renderTooltip()

  const trigger = screen.getByRole('button', { name: 'Hover me' })
  await trigger.element().focus()

  const content = screen.getByText('This is a tooltip')
  await expect.element(content).toHaveAttribute('data-state', 'open')
})
