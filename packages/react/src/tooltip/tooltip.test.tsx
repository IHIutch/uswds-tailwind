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

// Match the wrapping content element by anatomy (data-scope/data-part) rather
// than getByText, which can resolve to a text node or different ancestor in
// some browsers — the assertion target is the div that owns `data-state`.
function getContent() {
  return document.querySelector<HTMLElement>('[data-scope="tooltip"][data-part="content"]')
}

it('tooltip content is not visible by default', async () => {
  const screen = await renderTooltip()

  // Playwright's headless mouse starts at (0,0); if the trigger renders near
  // there, it counts as hovered and the tooltip opens immediately. Unhover
  // explicitly so we're testing the actual closed-by-default state.
  const trigger = screen.getByRole('button', { name: 'Hover me' })
  await userEvent.unhover(trigger.element())

  await expect.poll(() => getContent()?.getAttribute('data-state')).toBe('closed')
})

it('hovering trigger shows tooltip content', async () => {
  const screen = await renderTooltip()

  const trigger = screen.getByRole('button', { name: 'Hover me' })
  await userEvent.hover(trigger.element())
  await expect.poll(() => getContent()?.getAttribute('data-state')).toBe('open')

  await userEvent.unhover(trigger.element())
  await expect.poll(() => getContent()?.getAttribute('data-state')).toBe('closed')
})

it('focusing trigger via keyboard shows tooltip', async () => {
  const screen = await renderTooltip()

  const trigger = screen.getByRole('button', { name: 'Hover me' })
  await trigger.element().focus()
  await expect.poll(() => getContent()?.getAttribute('data-state')).toBe('open')
})
