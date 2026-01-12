import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'
import { Icon } from '../icon'

export const alertVariants = cva({
  variants: {
    variant: {
      info: 'bg-cyan-5 border-l-8 border-l-cyan-30v',
      warning: 'bg-yellow-5 border-l-8 border-l-gold-20v',
      success: 'bg-green-cool-5 border-l-8 border-l-green-cool-40v',
      error: 'bg-red-warm-10 border-l-8 border-l-red-warm-50v',
    },
    slim: {
      true: null,
    },
    noIcon: {
      true: null,
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const alertContentVariants = cva({
  base: 'pr-5 relative',
  variants: {
    slim: {
      true: 'py-2',
      false: 'py-4',
    },
    noIcon: {
      true: 'pl-4',
      false: 'pl-13',
    },
  },
  compoundVariants: [
    {
      slim: false,
      noIcon: false,
      className: 'pl-15',
    },
  ],
  defaultVariants: {
    slim: false,
    noIcon: false,
  },
})

const alertIndicatorVariants = cva({
  base: 'absolute left-4.5',
  variants: {
    slim: {
      true: null,
      false: 'top-3',
    },
  },
  defaultVariants: {
    slim: false,
  },
})

const alertIconVariants = cva({
  variants: {
    slim: {
      true: 'size-6',
      false: 'size-8',
    },
  },
  defaultVariants: {
    slim: false,
  },
})

export type AlertRootProps = React.HTMLAttributes<HTMLElement> & VariantProps<typeof alertVariants>
export type AlertContextProps = VariantProps<typeof alertVariants>

const AlertContext = React.createContext<AlertContextProps | null>(null)

function useAlertContext() {
  const context = React.useContext(AlertContext)
  if (!context) {
    throw new Error('Alert components must be used within a Alert.Root')
  }
  return context
}

function AlertRoot({ variant, slim, noIcon, className, ...props }: AlertRootProps) {
  return (
    <AlertContext.Provider value={{ variant, slim, noIcon }}>
      <div {...props} className={alertVariants({ variant, slim, noIcon, className })} />
    </AlertContext.Provider>
  )
}

function AlertContent({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { slim, noIcon } = useAlertContext()

  return (
    <div
      {...props}
      className={alertContentVariants({ slim, noIcon, className })}
    />
  )
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      {...props}
      className={cx(
        'text-2xl font-bold mb-2 leading-none',
        className,
      )}
    />
  )
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <div {...props} className={className} />
}

const iconMap: Record<string, ({ className }: { className?: string }) => React.ReactNode> = {
  info: ({ className }) => <Icon icon="info" className={className} />,
  warning: ({ className }) => <Icon icon="warning" className={className} />,
  success: ({ className }) => <Icon icon="check-circle" className={className} />,
  error: ({ className }) => <Icon icon="warning" className={className} />,
}

function AlertIndicator({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { variant, slim } = useAlertContext()
  const IconComponent = iconMap[variant || 'info']

  return (
    <div
      {...props}
      className={alertIndicatorVariants({ slim, className })}
    >
      {children || (IconComponent ? IconComponent({ className: alertIconVariants({ slim }) }) : null)}
    </div>
  )
}

export const Alert = {
  Root: AlertRoot,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Indicator: AlertIndicator,
}
