import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Button } from '../button'
import { Tooltip } from './tooltip'

// Behavioral parity tests mirroring e2e/tooltip/tooltips.test.ts.
//
// SUGGESTION (review): every assertion below pins to our Zag convention
// `data-state="open|closed"`. That's our internal contract, not user
// behavior — if the attribute name ever changes (e.g. Radix-style
// `data-open` / `data-state` -> something else) these tests all fail without
// the user-visible behavior having changed. Safer rewrite: use
// `.toBeVisible()` / `.not.toBeVisible()` since the tooltip uses opacity
// transitions (`data-[state=open]:opacity-100 opacity-0`), so visibility
// tracks state exactly. Example replacement:
//   await expect.element(content).toHaveAttribute('data-state', 'open')
//   →  await expect.element(content).toBeVisible()
//   await expect.element(content).toHaveAttribute('data-state', 'closed')
//   →  await expect.element(content).not.toBeVisible()

function renderTooltip() {
  return render(
    <Tooltip content="This is a tooltip" position="top">
      <Button>Button</Button>
    </Tooltip>,
  )
}

it('content element has role="tooltip"', async () => {
  const screen = await renderTooltip()
  const content = screen.getByText('This is a tooltip')
  await expect.element(content).toHaveAttribute('role', 'tooltip')
})

it('tooltip is closed by default', async () => {
  const screen = await renderTooltip()
  const content = screen.getByText('This is a tooltip')
  await expect.element(content).toHaveAttribute('data-state', 'closed')
})

it('tooltip opens on hover', async () => {
  const screen = await renderTooltip()
  const trigger = screen.getByRole('button', { name: 'Button' })
  const content = screen.getByText('This is a tooltip')

  await userEvent.hover(trigger)
  await expect.element(content).toHaveAttribute('data-state', 'open')
})

it('tooltip opens on focus (keyboard Tab)', async () => {
  const screen = await renderTooltip()
  const content = screen.getByText('This is a tooltip')

  await userEvent.keyboard('{Tab}')
  await expect.element(content).toHaveAttribute('data-state', 'open')
})

// The tooltip machine's close on pointerleave currently doesn't propagate to
// `data-state=closed` — known issue. Leaving as-is; this test fails loud as
// the signal. Do not skip to hide the gap.
it('tooltip closes on mouseleave', async () => {
  const screen = await renderTooltip()
  const trigger = screen.getByRole('button', { name: 'Button' })
  const content = screen.getByText('This is a tooltip')

  await userEvent.hover(trigger)
  await expect.element(content).toHaveAttribute('data-state', 'open')

  await userEvent.unhover(trigger)
  await expect.element(content).toHaveAttribute('data-state', 'closed')
})

// Same machine-level gap as above; fails until fixed.
it('tooltip closes on blur', async () => {
  const screen = await renderTooltip()
  const content = screen.getByText('This is a tooltip')

  await userEvent.keyboard('{Tab}')
  await expect.element(content).toHaveAttribute('data-state', 'open')

  await userEvent.keyboard('{Tab}')
  await expect.element(content).toHaveAttribute('data-state', 'closed')
})

it('tooltip closes on Escape', async () => {
  const screen = await renderTooltip()
  const content = screen.getByText('This is a tooltip')

  await userEvent.keyboard('{Tab}')
  await expect.element(content).toHaveAttribute('data-state', 'open')

  await userEvent.keyboard('{Escape}')
  await expect.element(content).toHaveAttribute('data-state', 'closed')
})
