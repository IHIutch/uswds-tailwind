import { StepIndicator } from '@uswds-tailwind/react/step-indicator'

const steps = [
  { label: 'Personal information' },
  { label: 'Household status' },
  { label: 'Supporting documents' },
  { label: 'Signature' },
  { label: 'Review and submit' },
]

export default function StepIndicatorCenteredDemo() {
  return (
    <StepIndicator.Root variant="centered" steps={steps} currentStep={3}>
      <StepIndicator.List><StepIndicator.Segments /></StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  )
}
