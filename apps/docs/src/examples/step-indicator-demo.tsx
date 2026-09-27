import { StepIndicator } from '@uswds-tailwind/react/step-indicator'

const steps = [
  { label: 'Personal information' },
  { label: 'Household status' },
  { label: 'Supporting documents' },
  { label: 'Signature' },
  { label: 'Review and submit' },
]

export default function StepIndicatorDemo() {
  return (
    <StepIndicator.Root steps={steps} currentStep={3}>
      <StepIndicator.List>
        {({ steps }) =>
          steps.map(step => (
            <StepIndicator.ListItem key={step.label} status={step.status}>
              <StepIndicator.Segment status={step.status}>
                {step.label}
              </StepIndicator.Segment>
            </StepIndicator.ListItem>
          ))}
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  )
}
