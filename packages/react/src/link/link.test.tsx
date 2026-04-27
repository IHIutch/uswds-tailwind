import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Link } from './link'

it('renders link with href attribute', async () => {
  const screen = await render(<Link href="https://example.com">Example</Link>)

  await expect.element(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com')
})
