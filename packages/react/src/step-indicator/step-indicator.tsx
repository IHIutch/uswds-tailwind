import * as React from 'react'
import { cva, cx } from '../cva.config'

export interface StepIndicatorStep {
  label: string
  status: 'complete' | 'current' | 'incomplete'
}

interface StepIndicatorContextProps {
  variant?: 'default' | 'centered' | 'counters' | 'countersSmall' | 'noLabels'
  steps: StepIndicatorStep[]
  currentStep: number
}

const StepIndicatorContext = React.createContext<StepIndicatorContextProps | null>(null)

function useStepIndicatorContext() {
  const context = React.useContext(StepIndicatorContext)
  if (!context) {
    throw new Error('StepIndicator components must be used within a StepIndicator.Root')
  }
  return context
}

type StepIndicatorRootProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: StepIndicatorContextProps['variant']
  steps?: Omit<StepIndicatorStep, 'status'>[]
  currentStep: number
}

function StepIndicatorRoot({ variant, steps = [], currentStep, className, ...props }: StepIndicatorRootProps) {
  const activeIdx = currentStep - 1
  const computedSteps = steps.map((step, idx) => ({
    label: step.label,
    status: idx < activeIdx ? 'complete' : idx > activeIdx ? 'incomplete' : 'current',
  })) satisfies StepIndicatorStep[]

  return (
    <StepIndicatorContext.Provider value={{ variant, steps: computedSteps, currentStep }}>
      <div
        aria-label="Progress"
        {...props}
        className={cx('@container')}
      />
    </StepIndicatorContext.Provider>
  )
}

type StepIndicatorListProps = Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children'> & {
  children: ((context: StepIndicatorContextProps) => React.ReactNode) | React.ReactNode
}

function StepIndicatorList({ className, children, ...props }: StepIndicatorListProps) {
  const context = useStepIndicatorContext()
  return (
    <ol
      {...props}
      className={cx('flex space-x-0.5 [counter-reset:usa-step-indicator]', className)}
    >
      {typeof children === 'function' ? children(context) : children}
    </ol>
  )
}

const stepSegmentLabelVariants = cva({
  base: 'hidden @tablet:block leading-none',
  variants: {
    variant: {
      default: '',
      centered: 'text-center',
      counters: '',
      countersSmall: '',
      noLabels: '',
    },
    status: {
      complete: 'text-blue-warm-80v',
      current: 'text-blue-60v font-bold',
      incomplete: 'text-gray-cool-60',
    },
  },
})

const stepCounterVariant = cva({
  base: 'hidden @tablet:flex rounded-full items-center justify-center absolute outline-white outline-4 before:[content:counter(usa-step-indicator)] font-bold',
  variants: {
    status: {
      complete: 'bg-blue-warm-80v text-white',
      current: 'bg-blue-60v text-white',
      incomplete: 'bg-white border-4 border-gray-40 text-gray-60',
    },
    size: {
      md: 'size-10 -top-6',
      sm: 'size-6 -top-4',
    },
  },
})

type StepIndicatorSegmentProps = React.LiHTMLAttributes<HTMLLIElement> & {
  status: StepIndicatorStep['status']
}

function StepIndicatorSegment({ status, className, ...props }: StepIndicatorSegmentProps) {
  const { variant } = useStepIndicatorContext()
  return (
    <>
      {variant === 'counters' || variant === 'countersSmall'
        ? (
            <div className={stepCounterVariant({
              size: variant === 'counters' ? 'md' : 'sm',
              status,
            })}
            />
          )
        : null}
      <span className={cx(
        stepSegmentLabelVariants({ status, variant }),
        className,
      )}
      >
        {props.children}
      </span>
      <span className="sr-only">{status}</span>
    </>

  )
}

const stepSegmentIndicatorVariants = cva({
  base: '[counter-increment:usa-step-indicator] border-t-8 pr-8 pt-2 w-full',
  variants: {
    variant: {
      default: '',
      centered: '',
      counters: 'relative @tablet:pt-6 @tablet:mt-4 @tablet:last:border-t-transparent',
      countersSmall: 'relative',
      noLabels: '',
    },
    status: {
      complete: 'border-t-blue-warm-80v',
      current: 'border-t-blue-60v',
      incomplete: 'border-t-gray-40',
    },
  },
})

type StepIndicatorListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  status?: StepIndicatorStep['status']
}

function StepIndicatorListItem({ status = 'incomplete', className, ...props }: StepIndicatorListItemProps) {
  const { variant } = useStepIndicatorContext()

  return (
    <li
      aria-current={status === 'current' ? 'step' : undefined}
      {...props}
      className={cx(
        stepSegmentIndicatorVariants({ status, variant }),
        className,
      )}
    />
  )
}

type StepIndicatorLabelProps = React.HTMLAttributes<HTMLSpanElement>

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

type StepIndicatorSummaryProps = React.HTMLAttributes<HTMLDivElement>

function StepIndicatorSummary({ className, ...props }: StepIndicatorSummaryProps) {
  return (
    <div
      {...props}
      className={cx('mt-4', className)}
    />
  )
}

type StepIndicatorCounterProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & {
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

type StepIndicatorHeadingProps = React.HTMLAttributes<HTMLSpanElement> & {
  label?: string
}

function StepIndicatorHeading({ label, className, ...props }: StepIndicatorHeadingProps) {
  const { steps, currentStep } = useStepIndicatorContext()

  const headingLabel = label || steps[currentStep - 1]?.label

  return (
    <span {...props} className={cx('font-bold pl-2 text-2xl', className)}>{headingLabel}</span>
  )
}

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
