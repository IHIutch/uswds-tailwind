import preview from '../../.storybook/preview'
import { StepIndicator } from './step-indicator'

const meta = preview.meta({
  title: 'Components/StepIndicator',
  component: StepIndicator.Root,
  argTypes: {
    variant: {
      control: 'select',
      options: ['centered', 'counters', 'countersSmall', 'noLabels'],
      table: {
        defaultValue: undefined,
      },
    },
    counters: {
      control: 'select',
      options: ['sm', 'lg'],
      table: {
        defaultValue: undefined,
      },
    },
  },
})

const steps = [
  { label: 'Personal information' },
  { label: 'Household status' },
  { label: 'Supporting documents' },
  { label: 'Signature' },
  { label: 'Review and submit' },
]

export const Default = meta.story({
  args: { variant: undefined, counters: undefined, currentStep: 3 },
  render: ({ variant, counters, currentStep }) => (
    <StepIndicator.Root variant={variant} counters={counters} steps={steps} currentStep={currentStep}>
      <StepIndicator.List>
        {({ steps }) => steps.map(step => (
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
  ),
})

export const Centered = meta.story({
  render: () => (
    <StepIndicator.Root variant="centered" steps={steps} currentStep={3}>
      <StepIndicator.List>
        <StepIndicator.Segments />
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  ),
})

export const Counters = meta.story({
  render: () => (
    <StepIndicator.Root counters="lg" steps={steps} currentStep={3}>
      <StepIndicator.List>
        <StepIndicator.Segments />
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  ),
})

export const CountersSmall = meta.story({
  render: () => (
    <StepIndicator.Root counters="sm" steps={steps} currentStep={3}>
      <StepIndicator.List>
        <StepIndicator.Segments />
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  ),
})

export const NoLabels = meta.story({
  render: () => (
    <StepIndicator.Root variant="noLabels" steps={steps} currentStep={3}>
      <StepIndicator.List>
        <StepIndicator.Segments />
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter />
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  ),
})

export const CustomCounter = meta.story({
  render: () => (
    <StepIndicator.Root variant="noLabels" steps={steps} currentStep={3}>
      <StepIndicator.List>
        <StepIndicator.Segments />
      </StepIndicator.List>
      <StepIndicator.Summary>
        <StepIndicator.Counter>
          {({ currentStep, steps }) => (
            <span style={{ color: 'red ' }}>
              {currentStep}
              {' '}
              of
              {' '}
              {steps.length}
            </span>
          )}
        </StepIndicator.Counter>
        <StepIndicator.Heading />
      </StepIndicator.Summary>
    </StepIndicator.Root>
  ),
})
