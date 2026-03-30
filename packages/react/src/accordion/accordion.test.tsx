import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
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

  await trigger.click()
  await expect.element(content).toBeVisible()

  await trigger.click()
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

  await trigger.click()
  await expect.element(content).toBeVisible()

  await trigger.keyboard('{Enter}')
  await expect.element(content).not.toBeVisible()

  await trigger.keyboard('{Enter}')
  await expect.element(content).toBeVisible()
})

// TODO: Keyboard interaction tests need investigation
it.skip('keyboard: Space toggles panel', async () => {
  const screen = await renderAccordion()

  const trigger = screen.getByRole('button', { name: 'First' })
  const content = screen.getByText('First content')

  await trigger.click()
  await expect.element(content).toBeVisible()

  await trigger.keyboard(' ')
  await expect.element(content).not.toBeVisible()

  await trigger.keyboard(' ')
  await expect.element(content).toBeVisible()
})
