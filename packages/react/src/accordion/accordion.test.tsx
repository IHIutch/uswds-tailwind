import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { Accordion } from './accordion'

const items = [
  { title: 'First', content: 'First content' },
  { title: 'Second', content: 'Second content' },
  { title: 'Third', content: 'Third content' },
]

function renderAccordion({ multiple = false } = {}) {
  return render(
    <Accordion.Root multiple={multiple}>
      {items.map(item => (
        <Accordion.Item key={item.title} value={item.title}>
          <Accordion.ItemTrigger>
            {item.title}
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            {item.content}
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>,
  )
}

it('clicking trigger expands panel content', async () => {
  const screen = await renderAccordion()

  const firstContent = screen.getByText('First content')
  await expect.element(firstContent).not.toBeVisible()

  await screen.getByRole('button', { name: 'First' }).click()
  await expect.element(firstContent).toBeVisible()
})

it('clicking expanded trigger collapses it', async () => {
  const screen = await renderAccordion()

  const trigger = screen.getByRole('button', { name: 'First' })
  const content = screen.getByText('First content')

  await userEvent.click(trigger)
  await expect.element(content).toBeVisible()

  await userEvent.click(trigger)
  await expect.element(content).not.toBeVisible()
})

it('single mode: opening one panel closes the other', async () => {
  const screen = await renderAccordion({ multiple: false })

  const firstContent = screen.getByText('First content')
  const secondContent = screen.getByText('Second content')

  await screen.getByRole('button', { name: 'First' }).click()
  await expect.element(firstContent).toBeVisible()

  await screen.getByRole('button', { name: 'Second' }).click()
  await expect.element(secondContent).toBeVisible()
  await expect.element(firstContent).not.toBeVisible()
})

it('multiple mode: multiple panels can be open simultaneously', async () => {
  const screen = await renderAccordion({ multiple: true })

  const firstContent = screen.getByText('First content')
  const secondContent = screen.getByText('Second content')

  await screen.getByRole('button', { name: 'First' }).click()
  await expect.element(firstContent).toBeVisible()

  await screen.getByRole('button', { name: 'Second' }).click()
  await expect.element(secondContent).toBeVisible()
  await expect.element(firstContent).toBeVisible()
})

// TODO: Keyboard interaction tests need investigation
it.skip('keyboard: Enter toggles panel', async () => {
  const screen = await renderAccordion()

  const trigger = screen.getByRole('button', { name: 'First' })
  const content = screen.getByText('First content')

  await userEvent.click(trigger)
  await expect.element(content).toBeVisible()

  await userEvent.keyboard('{Enter}')
  await expect.element(content).not.toBeVisible()

  await userEvent.keyboard('{Enter}')
  await expect.element(content).toBeVisible()
})

// TODO: Keyboard interaction tests need investigation
it.skip('keyboard: Space toggles panel', async () => {
  const screen = await renderAccordion()

  const trigger = screen.getByRole('button', { name: 'First' })
  const content = screen.getByText('First content')

  await userEvent.click(trigger)
  await expect.element(content).toBeVisible()

  await userEvent.keyboard(' ')
  await expect.element(content).not.toBeVisible()

  await userEvent.keyboard(' ')
  await expect.element(content).toBeVisible()
})

it('preserves HTML root ids without changing panel ids when the root id changes', async () => {
  const view = (id: string) => (
    <Accordion.Root id={id} ids={{ root: 'fallback-root', itemContent: () => 'panel-content' }}>
      <Accordion.Item value="first">
        <Accordion.ItemTrigger>First</Accordion.ItemTrigger>
        <Accordion.ItemContent>First content</Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
  const screen = await render(view('accordion-root'))
  const trigger = screen.getByRole('button', { name: 'First' })
  const triggerId = trigger.element().id
  expect(document.getElementById('accordion-root')).toContainElement(trigger.element())
  expect(trigger.element().getAttribute('aria-controls')).toBe('panel-content')
  await screen.rerender(view('renamed-accordion'))
  expect(document.getElementById('renamed-accordion')).toContainElement(trigger.element())
  expect(document.getElementById('accordion-root')).toBeNull()
  expect(trigger.element().id).toBe(triggerId)
  await trigger.click()
  await expect.element(screen.getByText('First content')).toBeVisible()
})

it('uses the root part override when no HTML id is supplied', async () => {
  const screen = await render(<Accordion.Root ids={{ root: 'accordion-part-root' }}>Content</Accordion.Root>)
  expect(document.getElementById('accordion-part-root')).toContainElement(screen.getByText('Content').element())
})
