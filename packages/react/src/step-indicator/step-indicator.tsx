import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

// ============================================================================
// Types
// ============================================================================

// export type StepIndicatorStatus = 'complete' | 'current' | 'incomplete'
// export type StepIndicatorVariant = 'default' | 'centered' | 'noLabels'
const stepSegmentIndicatorVariants = cva({
  base: '[counter-increment:usa-step-indicator] border-t-8 pt-2 w-full',
  variants: {
    variant: {
      default: 'pr-8',
      centered: 'px-2',
      noLabels: '',
    },
    counters: {
      unset: null,
      lg: 'relative @tablet:pt-6 @tablet:mt-4 @tablet:last:border-t-transparent',
      sm: 'relative @tablet:pt-4 @tablet:mt-2 @tablet:last:border-t-transparent',
    },
    status: {
      complete: 'border-t-blue-warm-80v',
      current: 'border-t-blue-60v',
      incomplete: 'border-t-gray-40',
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
  status: VariantProps<typeof stepSegmentIndicatorVariants>['status']
}

interface StepIndicatorContextProps extends VariantProps<typeof stepSegmentIndicatorVariants> {
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
  & VariantProps<typeof stepSegmentIndicatorVariants>
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
        className={cx('@container')}
      />
    </StepIndicatorContext.Provider>
  )
}

// ============================================================================
// List
// ============================================================================

export type StepIndicatorListProps = Omit<React.ComponentPropsWithoutRef<'ol'>, 'children'> & {
  children: ((context: { steps: StepIndicatorComputedStep[] }) => React.ReactNode) | React.ReactNode
}

function StepIndicatorList({ className, children, ...props }: StepIndicatorListProps) {
  const { steps } = useStepIndicatorContext()
  return (
    <ol
      {...props}
      className={cx('flex space-x-0.5 [counter-reset:usa-step-indicator]', className)}
    >
      {typeof children === 'function' ? children({ steps }) : children}
    </ol>
  )
}

// ============================================================================
// ListItem
// ============================================================================

export type StepIndicatorListItemProps = React.ComponentPropsWithoutRef<'li'> & {
  status?: VariantProps<typeof stepSegmentIndicatorVariants>['status']
}

function StepIndicatorListItem({ status = 'incomplete', className, ...props }: StepIndicatorListItemProps) {
  const { variant, counters } = useStepIndicatorContext()

  return (
    <li
      aria-current={status === 'current' ? 'step' : undefined}
      {...props}
      className={cx(
        stepSegmentIndicatorVariants({ status, variant, counters }),
        className,
      )}
    />
  )
}

// ============================================================================
// Segment
// ============================================================================

const stepSegmentLabelVariants = cva({
  base: 'hidden leading-none',
  variants: {
    variant: {
      default: '@tablet:block',
      centered: 'text-center @tablet:block',
      noLabels: '@tablet:hidden',
    },
    status: {
      complete: 'text-blue-warm-80v',
      current: 'text-blue-60v font-bold',
      incomplete: 'text-gray-cool-60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const stepCounterVariant = cva({
  base: 'hidden @tablet:flex rounded-full items-center justify-center absolute outline-white outline-4 before:[content:counter(usa-step-indicator)] font-bold',
  variants: {
    counters: {
      unset: null,
      lg: 'size-10 -top-6',
      sm: 'size-6 -top-4',
    },
    status: {
      complete: 'bg-blue-warm-80v text-white',
      current: 'bg-blue-60v text-white',
      incomplete: 'bg-white border-4 border-gray-40 text-gray-60',
    },
  },
  defaultVariants: {
    counters: 'unset',
  },
})

export type StepIndicatorSegmentProps = React.ComponentPropsWithoutRef<'span'> & {
  status: VariantProps<typeof stepSegmentIndicatorVariants>['status']
}

function StepIndicatorSegment({ status, className, children, ...props }: StepIndicatorSegmentProps) {
  const { variant, counters } = useStepIndicatorContext()
  return (
    <>
      {counters
        ? <div className={stepCounterVariant({ counters, status })} />
        : null}
      <span
        {...props}
        className={cx(
          stepSegmentLabelVariants({ status, variant }),
          className,
        )}
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
      className={cx('block text-sm mt-1', className)}
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
      className={cx('mt-4', className)}
    />
  )
}

// ============================================================================
// Counter
// ============================================================================

export type StepIndicatorCounterProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
  children?: ((context: StepIndicatorContextProps) => React.ReactNode) | React.ReactNode
}

function StepIndicatorCounter({ className, children, ...props }: StepIndicatorCounterProps) {
  const context = useStepIndicatorContext()

  return (
    <span {...props} className={cx('text-xl', className)}>
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
    <span {...props} className={cx('font-bold pl-2 text-2xl', className)}>{headingLabel}</span>
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
