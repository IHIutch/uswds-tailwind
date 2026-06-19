import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { cn, tv } from '../tv.config'

// ============================================================================
// Types
// ============================================================================

// export type StepIndicatorStatus = 'complete' | 'current' | 'incomplete'
// export type StepIndicatorVariant = 'default' | 'centered' | 'noLabels'
const stepIndicatorVariants = tv({
  slots: {
    indicator: '[counter-increment:usa-step-indicator] border-t-8 pt-2 w-full',
    label: 'hidden leading-none',
    counter: 'hidden @tablet:flex rounded-full items-center justify-center absolute outline-white outline-4 before:[content:counter(usa-step-indicator)] font-bold',
  },
  variants: {
    variant: {
      default: {
        indicator: 'pr-8',
        label: '@tablet:block',
      },
      centered: {
        indicator: 'px-2',
        label: 'text-center @tablet:block',
      },
      noLabels: {
        label: '@tablet:hidden',
      },
    },
    counters: {
      unset: '',
      lg: {
        indicator: 'relative @tablet:pt-6 @tablet:mt-4 @tablet:last:border-t-transparent',
        counter: 'size-10 -top-6',
      },
      sm: {
        indicator: 'relative @tablet:pt-4 @tablet:mt-2 @tablet:last:border-t-transparent',
        counter: 'size-6 -top-4',
      },
    },
    status: {
      complete: {
        indicator: 'border-t-blue-warm-80v',
        label: 'text-blue-warm-80v',
        counter: 'bg-blue-warm-80v text-white',
      },
      current: {
        indicator: 'border-t-blue-60v',
        label: 'text-blue-60v font-bold',
        counter: 'bg-blue-60v text-white',
      },
      incomplete: {
        indicator: 'border-t-gray-40',
        label: 'text-gray-cool-60',
        counter: 'bg-white border-4 border-gray-40 text-gray-60',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    counters: 'unset',
  },
})

export interface StepIndicatorStep {
  label: string
}

interface StepIndicatorComputedStep extends StepIndicatorStep {
  status: VariantProps<typeof stepIndicatorVariants>['status']
}

interface StepIndicatorContextProps extends VariantProps<typeof stepIndicatorVariants> {
  steps: StepIndicatorComputedStep[]
  currentStep: number
}

// ============================================================================
// Context
// ============================================================================

const StepIndicatorContext = React.createContext<StepIndicatorContextProps | null>(null)

function useStepIndicatorContext() {
  const context = React.useContext(StepIndicatorContext)
  if (!context) {
    throw new Error('StepIndicator components must be used within a StepIndicator.Root')
  }
  return context
}

// ============================================================================
// Root
// ============================================================================

export type StepIndicatorRootProps = React.ComponentPropsWithoutRef<'div'>
  & VariantProps<typeof stepIndicatorVariants>
  & {
    steps?: StepIndicatorStep[]
    currentStep: number
  }

function StepIndicatorRoot({ variant, counters, steps = [], currentStep, className, ...props }: StepIndicatorRootProps) {
  const activeIdx = currentStep - 1
  const computedSteps = steps.map((step, idx) => ({
    ...step,
    status: idx < activeIdx ? 'complete' : idx > activeIdx ? 'incomplete' : 'current',
  })) satisfies StepIndicatorComputedStep[]

  return (
    <StepIndicatorContext.Provider value={{ variant, counters, steps: computedSteps, currentStep }}>
      <div
        aria-label="Progress"
        {...props}
        className={cn('@container', className)}
      />
    </StepIndicatorContext.Provider>
  )
}

// ============================================================================
// List
// ============================================================================

export type StepIndicatorListProps = Omit<React.ComponentPropsWithoutRef<'ol'>, 'children'> & {
  children: React.ReactNode | ((context: { steps: StepIndicatorComputedStep[] }) => React.ReactNode)
}

function StepIndicatorList({ className, children, ...props }: StepIndicatorListProps) {
  const { steps } = useStepIndicatorContext()
  return (
    <ol
      {...props}
      className={cn('flex space-x-0.5 [counter-reset:usa-step-indicator]', className)}
    >
      {typeof children === 'function' ? children({ steps }) : children}
    </ol>
  )
}

// ============================================================================
// ListItem
// ============================================================================

export type StepIndicatorListItemProps = React.ComponentPropsWithoutRef<'li'> & {
  status?: VariantProps<typeof stepIndicatorVariants>['status']
}

function StepIndicatorListItem({ status = 'incomplete', className, ...props }: StepIndicatorListItemProps) {
  const { variant, counters } = useStepIndicatorContext()
  const { indicator } = stepIndicatorVariants({ status, variant, counters })

  return (
    <li
      aria-current={status === 'current' ? 'step' : undefined}
      {...props}
      className={indicator({ className })}
    />
  )
}

// ============================================================================
// Segment
// ============================================================================

export type StepIndicatorSegmentProps = React.ComponentPropsWithoutRef<'span'> & {
  status: VariantProps<typeof stepIndicatorVariants>['status']
}

function StepIndicatorSegment({ status, className, children, ...props }: StepIndicatorSegmentProps) {
  const { variant, counters } = useStepIndicatorContext()
  const { counter, label } = stepIndicatorVariants({ variant, counters, status })
  return (
    <>
      {counters
        ? <div className={counter()} />
        : null}
      <span
        {...props}
        className={label({ className })}
      >
        {children}
      </span>
      <span className="sr-only">{status}</span>
    </>
  )
}

// ============================================================================
// Label
// ============================================================================

export type StepIndicatorLabelProps = React.ComponentPropsWithoutRef<'span'>

function StepIndicatorLabel({ className, ...props }: StepIndicatorLabelProps) {
  const { variant } = useStepIndicatorContext()
  if (variant === 'noLabels')
    return null
  return (
    <span
      {...props}
      className={cn('block text-sm mt-1', className)}
    />
  )
}

// ============================================================================
// Summary
// ============================================================================

export type StepIndicatorSummaryProps = React.ComponentPropsWithoutRef<'div'>

function StepIndicatorSummary({ className, ...props }: StepIndicatorSummaryProps) {
  return (
    <div
      {...props}
      className={cn('mt-4', className)}
    />
  )
}

// ============================================================================
// Counter
// ============================================================================

export type StepIndicatorCounterProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
  children?: React.ReactNode | ((context: StepIndicatorContextProps) => React.ReactNode)
}

function StepIndicatorCounter({ className, children, ...props }: StepIndicatorCounterProps) {
  const context = useStepIndicatorContext()

  return (
    <span {...props} className={cn('text-xl', className)}>
      {typeof children === 'function'
        ? children(context)
        : (
            <>
              <span className="sr-only">Step</span>
              {' '}
              <span className="size-10 rounded-full bg-blue-60v text-white inline-flex items-center justify-center">{context.currentStep}</span>
              {' '}
              <span className="text-blue-60v">
                of
                {' '}
                {context.steps.length}
              </span>
            </>
          )}
    </span>
  )
}

// ============================================================================
// Heading
// ============================================================================

export type StepIndicatorHeadingProps = React.ComponentPropsWithoutRef<'span'> & {
  label?: string
}

function StepIndicatorHeading({ label, className, ...props }: StepIndicatorHeadingProps) {
  const { steps, currentStep } = useStepIndicatorContext()
  const headingLabel = label || steps[currentStep - 1]?.label

  return (
    <span {...props} className={cn('font-bold pl-2 text-2xl', className)}>{headingLabel}</span>
  )
}

// ============================================================================
// Segments (convenience)
// ============================================================================

function StepIndicatorSegments() {
  const { steps } = useStepIndicatorContext()
  return steps.map(step => (
    <StepIndicatorListItem key={step.label} status={step.status}>
      <StepIndicatorSegment status={step.status}>
        {step.label}
      </StepIndicatorSegment>
    </StepIndicatorListItem>
  ))
}

// ============================================================================
// Export
// ============================================================================

StepIndicatorRoot.displayName = 'StepIndicator.Root'
StepIndicatorList.displayName = 'StepIndicator.List'
StepIndicatorListItem.displayName = 'StepIndicator.ListItem'
StepIndicatorSegment.displayName = 'StepIndicator.Segment'
StepIndicatorLabel.displayName = 'StepIndicator.Label'
StepIndicatorSummary.displayName = 'StepIndicator.Summary'
StepIndicatorCounter.displayName = 'StepIndicator.Counter'
StepIndicatorHeading.displayName = 'StepIndicator.Heading'
StepIndicatorSegments.displayName = 'StepIndicator.Segments'

export const StepIndicator = {
  Root: StepIndicatorRoot,
  List: StepIndicatorList,
  ListItem: StepIndicatorListItem,
  Segment: StepIndicatorSegment,
  Label: StepIndicatorLabel,
  Summary: StepIndicatorSummary,
  Counter: StepIndicatorCounter,
  Heading: StepIndicatorHeading,
  Segments: StepIndicatorSegments,
}
