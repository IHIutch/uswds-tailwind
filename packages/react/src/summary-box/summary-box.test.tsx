import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { SummaryBox } from './summary-box'

it('renders with role="complementary"', async () => {
  const screen = await render(
    <SummaryBox.Root>
      <SummaryBox.Heading>Key Information</SummaryBox.Heading>
      <SummaryBox.Content>Summary content here</SummaryBox.Content>
    </SummaryBox.Root>,
  )

  await expect.element(screen.getByRole('complementary')).toBeVisible()
})

it('heading text is visible', async () => {
  const screen = await render(
    <SummaryBox.Root>
      <SummaryBox.Heading>Key Information</SummaryBox.Heading>
      <SummaryBox.Content>Summary content here</SummaryBox.Content>
    </SummaryBox.Root>,
  )

  await expect.element(screen.getByText('Key Information')).toBeVisible()
})
