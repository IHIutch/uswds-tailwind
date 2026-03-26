import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

export const alertVariants = cva({
  variants: {
    variant: {
      info: 'bg-cyan-5 border-l-8 border-l-cyan-30v',
      warning: 'bg-yellow-5 border-l-8 border-l-gold-20v',
      success: 'bg-green-cool-5 border-l-8 border-l-green-cool-40v',
      error: 'bg-red-warm-10 border-l-8 border-l-red-warm-50v',
      emergency: 'bg-red-warm-60v border-l-8 border-l-red-warm-60v text-white',
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
    noIcon: {
      true: 'hidden',
    },
  },
  defaultVariants: {
    slim: false,
    noIcon: false,
  },
})

const alertIconVariants = cva({
  variants: {
    variant: {
      info: 'icon-[material-symbols--info]',
      warning: 'icon-[material-symbols--warning]',
      success: 'icon-[material-symbols--check-circle]',
      error: 'icon-[material-symbols--error]',
      emergency: 'icon-[material-symbols--info]',
    },
    slim: {
      true: 'size-6',
      false: 'size-8',
    },
  },
  defaultVariants: {
    slim: false,
    variant: 'info',
  },
})

export type AlertRootProps = React.HTMLAttributes<HTMLElement> & VariantProps<typeof alertVariants>
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
    return (
      <AlertContext.Provider value={{ variant, slim, noIcon }}>
        <div {...props} className={alertVariants({ variant, slim, noIcon, className })} ref={forwardedRef} />
      </AlertContext.Provider>
    )
  },
)

const AlertContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { slim, noIcon } = useAlertContext()
    return (
      <div
        {...props}
        className={alertContentVariants({ slim, noIcon, className })}
        ref={forwardedRef}
      />
    )
  },
)

const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        {...props}
        className={cx('text-2xl font-bold mb-2 leading-none', className)}
        ref={forwardedRef}
      />
    )
  },
)

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={className} ref={forwardedRef} />
  },
)

const AlertIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { variant, slim, noIcon } = useAlertContext()
    return (
      <div
        {...props}
        className={alertIndicatorVariants({ slim, className, noIcon })}
        ref={forwardedRef}
      >
        {children || <div className={alertIconVariants({ variant, slim })} />}
      </div>
    )
  },
)

export const Alert = {
  Root: AlertRoot,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Indicator: AlertIndicator,
}
