import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { StepIndicator } from './step-indicator'

const steps = [
  { label: 'Personal information' },
  { label: 'Household status' },
  { label: 'Supporting documents' },
]

it('current step heading is visible', async () => {
  const screen = await render(
    <StepIndicator.Root steps={steps} currentStep={2}>
      <StepIndicator.List>
        <StepIndicator.Segments />
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>,
  )

  await expect.element(screen.getByRole('list')).toBeVisible()
  await expect.element(screen.getByText('Step')).toBeVisible()
})
