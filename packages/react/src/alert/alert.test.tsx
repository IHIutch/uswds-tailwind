import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Alert } from './alert'

it('renders alert title and description text', async () => {
  const screen = await render(
    <Alert.Root variant="info">
      <Alert.Content>
        <Alert.Title>Alert Title</Alert.Title>
        <Alert.Description>Alert description text</Alert.Description>
      </Alert.Content>
    </Alert.Root>,
  )

  await expect.element(screen.getByText('Alert Title')).toBeVisible()
  await expect.element(screen.getByText('Alert description text')).toBeVisible()
})
