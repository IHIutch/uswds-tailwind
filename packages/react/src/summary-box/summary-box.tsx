import * as React from 'react'
import { cx } from '../cva.config'

interface SummaryBoxContextProps {
  headingId: string
}

const SummaryBoxContext = React.createContext<SummaryBoxContextProps | null>(null)

function useSummaryBoxContext() {
  const context = React.useContext(SummaryBoxContext)
  if (!context) {
    throw new Error('SummaryBox components must be used within a SummaryBox.Root')
  }
  return context
}

export type SummaryBoxRootProps = React.HTMLAttributes<HTMLDivElement>

function SummaryBoxRoot({ className, ...props }: SummaryBoxRootProps) {
  const headingId = React.useId()
  return (
    <SummaryBoxContext.Provider value={{ headingId }}>
      <div
        role="complementary"
        aria-labelledby={headingId}
        {...props}
        className={cx('border border-cyan-20 bg-cyan-5 rounded-sm p-6', className)}
      />
    </SummaryBoxContext.Provider>
  )
}

export type SummaryBoxHeadingProps = React.HTMLAttributes<HTMLHeadingElement>

function SummaryBoxHeading({ className, ...props }: SummaryBoxHeadingProps) {
  const { headingId } = useSummaryBoxContext()
  return (
    <div
      id={headingId}
      {...props}
      className={cx('text-xl font-bold', className)}
    />
  )
}

export type SummaryBoxContentProps = React.HTMLAttributes<HTMLDivElement>

function SummaryBoxContent({ className, ...props }: SummaryBoxContentProps) {
  return (
    <div
      {...props}
      className={cx('mt-4', className)}
    />
  )
}

SummaryBoxRoot.displayName = 'SummaryBox.Root'
SummaryBoxHeading.displayName = 'SummaryBox.Heading'
SummaryBoxContent.displayName = 'SummaryBox.Content'

export const SummaryBox = {
  Root: SummaryBoxRoot,
  Heading: SummaryBoxHeading,
  Content: SummaryBoxContent,
}
