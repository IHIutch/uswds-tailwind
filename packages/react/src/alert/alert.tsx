import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'
import { Icon } from '../icon'

export type AlertRootProps = React.HTMLAttributes<HTMLElement> & VariantProps<typeof alertVariants>

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
      className={cx(
        'pr-5 relative',
        slim ? 'py-2' : 'py-4',
        noIcon ? 'pl-4' : 'pl-13',
        !slim && !noIcon ? 'pl-15' : '',
        className,
      )}
    />
  )
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <div {...props} className={cx('text-2xl font-bold mb-2 leading-none', className)} />
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
      className={cx(
        'absolute left-4.5',
        slim ? '' : 'top-3',
        className,
      )}
    >
      {children || (IconComponent ? IconComponent({ className: slim ? 'size-6' : 'size-8' }) : null)}
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
