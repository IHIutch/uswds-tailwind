import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { MemorableDate } from './memorable-date'

it('renders month select, day input, and year input', async () => {
  const screen = await render(
    <MemorableDate.Root>
      <MemorableDate.Legend>Date of birth</MemorableDate.Legend>
      <MemorableDate.Control>
        <MemorableDate.Month />
        <MemorableDate.Day />
        <MemorableDate.Year />
      </MemorableDate.Control>
    </MemorableDate.Root>,
  )

  await expect.element(screen.getByLabelText('Month')).toBeVisible()
  await expect.element(screen.getByLabelText('Day')).toBeVisible()
  await expect.element(screen.getByLabelText('Year')).toBeVisible()
})

it('legend text is visible', async () => {
  const screen = await render(
    <MemorableDate.Root>
      <MemorableDate.Legend>Date of birth</MemorableDate.Legend>
      <MemorableDate.Control>
        <MemorableDate.Month />
        <MemorableDate.Day />
        <MemorableDate.Year />
      </MemorableDate.Control>
    </MemorableDate.Root>,
  )

  await expect.element(screen.getByText('Date of birth')).toBeVisible()
})
