import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from './button'

it('click handler fires on click', async () => {
  const handleClick = vi.fn()
  const screen = await render(<Button onClick={handleClick}>Click me</Button>)

  await screen.getByRole('button').click()
  expect(handleClick).toHaveBeenCalledOnce()
})

it('disabled button is disabled', async () => {
  const screen = await render(<Button disabled>Click me</Button>)

  await expect.element(screen.getByRole('button')).toBeDisabled()
})

it('renders children as accessible name', async () => {
  const screen = await render(<Button>Submit Form</Button>)

  await expect.element(screen.getByRole('button')).toHaveAccessibleName('Submit Form')
})
