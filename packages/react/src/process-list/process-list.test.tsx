import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { ProcessList } from './process-list'

it('renders ordered list with item titles', async () => {
  const screen = await render(
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>First Step</ProcessList.Title>
          <ProcessList.Description>Do this first</ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Second Step</ProcessList.Title>
          <ProcessList.Description>Do this second</ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>,
  )

  await expect.element(screen.getByRole('list')).toBeVisible()
  await expect.element(screen.getByText('First Step')).toBeVisible()
  await expect.element(screen.getByText('Second Step')).toBeVisible()
})
