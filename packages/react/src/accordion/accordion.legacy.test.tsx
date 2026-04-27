import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Accordion } from './accordion'

// Behavioral parity tests mirroring e2e/accordion/accordion.test.ts.
// Assertions focus on USWDS-compliant ARIA attributes rather than mere visibility.

function renderAccordion({ multiple }: { multiple?: boolean } = {}) {
  return render(
    <Accordion.Root multiple={multiple}>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>Section one</Accordion.ItemTrigger>
        <Accordion.ItemContent>Content one</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>Section two</Accordion.ItemTrigger>
        <Accordion.ItemContent>Content two</Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>,
  )
}

it('trigger has an aria-expanded attribute', async () => {
  const screen = await renderAccordion()
  const trigger = screen.getByRole('button', { name: 'Section one' })
  await expect.element(trigger).toHaveAttribute('aria-expanded')
})

it('trigger has an aria-controls attribute', async () => {
  const screen = await renderAccordion()
  const trigger = screen.getByRole('button', { name: 'Section one' })
  await expect.element(trigger).toHaveAttribute('aria-controls')
})

it('clicking a trigger toggles aria-expanded and the content hidden attribute', async () => {
  const screen = await renderAccordion()
  const trigger = screen.getByRole('button', { name: 'Section one' })
  // role=region is removed from the a11y tree when content is hidden;
  // getByText works on hidden content too.
  const content = screen.getByText('Content one')

  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect.element(content).toHaveAttribute('hidden')

  await userEvent.click(trigger)

  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect.element(content).not.toHaveAttribute('hidden')
})

it('clicking an expanded trigger collapses it again', async () => {
  const screen = await renderAccordion()
  const trigger = screen.getByRole('button', { name: 'Section one' })
  const content = screen.getByText('Content one')

  await userEvent.click(trigger)
  await userEvent.click(trigger)

  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect.element(content).toHaveAttribute('hidden')
})

it('single mode: opening one item collapses the other', async () => {
  const screen = await renderAccordion()
  const firstTrigger = screen.getByRole('button', { name: 'Section one' })
  const secondTrigger = screen.getByRole('button', { name: 'Section two' })

  await userEvent.click(firstTrigger)
  await expect.element(firstTrigger).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(secondTrigger)

  await expect.element(firstTrigger).toHaveAttribute('aria-expanded', 'false')
  await expect.element(secondTrigger).toHaveAttribute('aria-expanded', 'true')
})

it('multiple mode: both items can stay expanded', async () => {
  const screen = await renderAccordion({ multiple: true })
  const firstTrigger = screen.getByRole('button', { name: 'Section one' })
  const secondTrigger = screen.getByRole('button', { name: 'Section two' })

  await userEvent.click(firstTrigger)
  await userEvent.click(secondTrigger)

  await expect.element(firstTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect.element(secondTrigger).toHaveAttribute('aria-expanded', 'true')

  await expect.element(screen.getByText('Content one')).not.toHaveAttribute('hidden')
  await expect.element(screen.getByText('Content two')).not.toHaveAttribute('hidden')
})

it('defaultValue pre-expands the matching item', async () => {
  const screen = await render(
    <Accordion.Root defaultValue={['item-1']}>
      <Accordion.Item value="item-1">
        <Accordion.ItemTrigger>Section one</Accordion.ItemTrigger>
        <Accordion.ItemContent>Content one</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.ItemTrigger>Section two</Accordion.ItemTrigger>
        <Accordion.ItemContent>Content two</Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>,
  )
  await expect.element(screen.getByRole('button', { name: 'Section one' }))
    .toHaveAttribute('aria-expanded', 'true')
  await expect.element(screen.getByText('Content one')).not.toHaveAttribute('hidden')
})
