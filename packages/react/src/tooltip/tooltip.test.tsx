import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
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

for (const margin of [0, 30]) {
  for (const position of ['top', 'bottom', 'left', 'right'] as const) {
    it(`positions the ${position} tooltip with ${margin}px trigger margins and points its arrow toward the trigger`, async () => {
      const screen = await render(
        <div style={{ position: 'fixed', top: 150, left: 300 }}>
          <Tooltip content="Description" position={position}>
            <Button style={{ margin }}>Trigger</Button>
          </Tooltip>
        </div>,
      )
      screen.getByRole('button', { name: 'Trigger' }).element().focus()
      const contentLocator = screen.getByRole('tooltip')
      await expect.element(contentLocator).toHaveAttribute('data-visible')
      await expect.element(contentLocator).toHaveAttribute('data-placement', position)
      const content = contentLocator.element() as HTMLElement
      const arrow = getComputedStyle(content, '::after')
      const expectedTop = position === 'top' ? content.offsetHeight : position === 'bottom' ? 0 : content.offsetHeight / 2
      const expectedLeft = position === 'left' ? content.offsetWidth : position === 'right' ? 0 : content.offsetWidth / 2
      const width = Number.parseFloat(arrow.width)
      const height = Number.parseFloat(arrow.height)
      const [x = '0', y = x] = arrow.translate.split(' ')
      const offset = (value: string, size: number) => Number.parseFloat(value) * (value.endsWith('%') ? size / 100 : 1)
      expect(Number.parseFloat(arrow.top) + height / 2 + offset(y, height)).toBeCloseTo(expectedTop, 0)
      expect(Number.parseFloat(arrow.left) + width / 2 + offset(x, width)).toBeCloseTo(expectedLeft, 0)
      const triggerRect = screen.getByRole('button', { name: 'Trigger' }).element().getBoundingClientRect()
      const rect = content.getBoundingClientRect()
      if (position === 'top')
        expect(rect.bottom).toBeLessThanOrEqual(triggerRect.top)
      else if (position === 'bottom')
        expect(rect.top).toBeGreaterThanOrEqual(triggerRect.bottom)
      else if (position === 'left')
        expect(rect.right).toBeLessThanOrEqual(triggerRect.left)
      else
        expect(rect.left).toBeGreaterThanOrEqual(triggerRect.right)

      // Changing inherited CSS alone adjusts the gap without another machine event.
      content.parentElement!.style.setProperty('--tooltip-offset', '12px')
      const adjustedRect = content.getBoundingClientRect()
      const vertical = position === 'top' || position === 'bottom'
      const change = vertical ? adjustedRect.top - rect.top : adjustedRect.left - rect.left
      expect(change).toBeCloseTo(position === 'top' || position === 'left' ? -7 : 7, 0)
    })
  }
}
