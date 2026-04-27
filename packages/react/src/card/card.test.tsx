import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Card } from './card'

it('renders title, body, footer content visible', async () => {
  const screen = await render(
    <Card.Root>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
      </Card.Header>
      <Card.Body>Card body content</Card.Body>
      <Card.Footer>Card footer content</Card.Footer>
    </Card.Root>,
  )

  await expect.element(screen.getByText('Card Title')).toBeVisible()
  await expect.element(screen.getByText('Card body content')).toBeVisible()
  await expect.element(screen.getByText('Card footer content')).toBeVisible()
})
