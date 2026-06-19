import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { cn, tv } from '../tv.config'

export const alertVariants = tv({
  slots: {
    root: '',
    content: 'pr-5 relative',
    indicator: 'absolute left-4.5',
    icon: '',
  },
  variants: {
    variant: {
      info: {
        root: 'bg-cyan-5 border-l-8 border-l-cyan-30v',
        icon: 'icon-[material-symbols--info]',
      },
      warning: {
        root: 'bg-yellow-5 border-l-8 border-l-gold-20v',
        icon: 'icon-[material-symbols--warning]',
      },
      success: {
        root: 'bg-green-cool-5 border-l-8 border-l-green-cool-40v',
        icon: 'icon-[material-symbols--check-circle]',
      },
      error: {
        root: 'bg-red-warm-10 border-l-8 border-l-red-warm-50v',
        icon: 'icon-[material-symbols--error]',
      },
      emergency: {
        root: 'bg-red-warm-60v border-l-8 border-l-red-warm-60v text-white',
        icon: 'icon-[material-symbols--info]',
      },
    },
    slim: {
      true: {
        content: 'py-2',
        icon: 'size-6',
      },
      false: {
        content: 'py-4',
        indicator: 'top-3',
        icon: 'size-8',
      },
    },
    noIcon: {
      true: {
        content: 'pl-4',
        indicator: 'hidden',
      },
      false: {
        content: 'pl-13',
      },
    },
  },
  compoundVariants: [
    {
      slim: false,
      noIcon: false,
      className: { content: 'pl-15' },
    },
  ],
  defaultVariants: {
    variant: 'info',
    slim: false,
    noIcon: false,
  },
})

export type AlertRootProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof alertVariants>
export type AlertContextProps = VariantProps<typeof alertVariants>

const AlertContext = React.createContext<AlertContextProps | null>(null)

function useAlertContext() {
  const context = React.useContext(AlertContext)
  if (!context) {
    throw new Error('Alert components must be used within an Alert.Root')
  }
  return context
}

const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(
  ({ variant, slim, noIcon, className, ...props }, forwardedRef) => {
    const { root } = alertVariants({ variant, slim, noIcon })
    return (
      <AlertContext.Provider value={{ variant, slim, noIcon }}>
        <div {...props} className={root({ className })} ref={forwardedRef} />
      </AlertContext.Provider>
    )
  },
)

function AlertContent({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { variant, slim, noIcon } = useAlertContext()
  const { content } = alertVariants({ variant, slim, noIcon })
  return (
    <div
      {...props}
      className={content({ className })}
    />
  )
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      {...props}
      className={cn('text-2xl font-bold mb-2 leading-none', className)}
    />
  )
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <div {...props} className={className} />
}

function AlertIndicator({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { variant, slim, noIcon } = useAlertContext()
  const { indicator, icon } = alertVariants({ variant, slim, noIcon })
  return (
    <div
      {...props}
      className={indicator({ className })}
    >
      {children || <div className={icon()} />}
    </div>
  )
}

AlertRoot.displayName = 'Alert.Root'
AlertContent.displayName = 'Alert.Content'
AlertTitle.displayName = 'Alert.Title'
AlertDescription.displayName = 'Alert.Description'
AlertIndicator.displayName = 'Alert.Indicator'

export const Alert = {
  Root: AlertRoot,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Indicator: AlertIndicator,
}
