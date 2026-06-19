import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { cn, tv } from '../tv.config'

export type CardGroupProps = React.ComponentPropsWithoutRef<'ul'>

function CardGroup({ className, ...props }: CardGroupProps) {
  return (
    <ul
      {...props}
      className={cn('grid gap-4', className)}
    />
  )
}

const cardVariants = tv({
  slots: {
    root: 'bg-white border-2 border-gray-10 rounded grid',
    media: '',
  },
  variants: {
    layout: {
      vertical: '',
      ltr: {
        root: 'md:grid-cols-[auto_1fr]',
        media: 'row-span-3 md:col-start-1 md:w-60',
      },
      rtl: {
        root: 'md:grid-cols-[1fr_auto]',
        media: 'row-span-3 row-start-1 md:col-start-2 md:w-60',
      },
    },
    variant: {
      indent: '',
      flush: {
        media: 'overflow-hidden',
      },
      exdent: {
        media: 'overflow-hidden',
      },
    },
  },
  compoundVariants: [
    // exdent
    {
      layout: 'ltr',
      variant: 'exdent',
      className: {
        media: '-my-0.5 -ml-0.5 rounded-l',
      },
    },
    {
      layout: 'rtl',
      variant: 'exdent',
      className: {
        media: '-my-0.5 -mr-0.5 rounded-r',
      },
    },
    {
      layout: 'vertical',
      variant: 'exdent',
      className: {
        media: '-mx-0.5 -mt-0.5 rounded-t',
      },
    },
    // flush
    {
      layout: 'ltr',
      variant: 'flush',
      className: {
        media: 'rounded-l-xs',
      },
    },
    {
      layout: 'rtl',
      variant: 'flush',
      className: {
        media: 'rounded-r-xs',
      },
    },
    {
      layout: 'vertical',
      variant: 'flush',
      className: {
        media: 'rounded-t-xs',
      },
    },
    // indent
    {
      layout: 'ltr',
      variant: 'indent',
      className: {
        media: 'p-6 md:pr-0',
      },
    },
    {
      layout: 'rtl',
      variant: 'indent',
      className: {
        media: 'p-6 md:pl-0',
      },
    },
    {
      layout: 'vertical',
      variant: 'indent',
      className: {
        media: 'px-6 pt-6',
      },
    },
  ],
  defaultVariants: {
    layout: 'vertical',
    variant: 'indent',
  },
})

export type CardContextProps = Pick<VariantProps<typeof cardVariants>, 'layout'>

const CardContext = React.createContext<CardContextProps | null>(null)

function useCardContext() {
  const context = React.useContext(CardContext)
  if (!context) {
    throw new Error('Card components must be used within a Card.Root')
  }
  return context
}

export type CardRootProps = React.ComponentPropsWithoutRef<'div'> & CardContextProps

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({ layout, className, ...props }, forwardedRef) => {
    const { root } = cardVariants({ layout })
    return (
      <CardContext.Provider value={{ layout }}>
        <div
          {...props}
          className={root({ className })}
          ref={forwardedRef}
        />
      </CardContext.Provider>
    )
  },
)

export type CardMediaProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof cardVariants>

function CardMedia({ className, variant, ...props }: CardMediaProps) {
  const { layout } = useCardContext()
  const { media } = cardVariants({ layout, variant })
  return (
    <div
      {...props}
      className={media({ className })}
    />
  )
}

export type CardHeaderProps = React.ComponentPropsWithoutRef<'div'>

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      {...props}
      className={cn('pb-2 px-6 pt-6', className)}
    />
  )
}

export type CardBodyProps = React.ComponentPropsWithoutRef<'div'>

function CardBody({ className, ...props }: CardBodyProps) {
  return (
    <div
      {...props}
      className={cn('grow py-2 px-6', className)}
    />
  )
}

export type CardFooterProps = React.ComponentPropsWithoutRef<'div'>

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      {...props}
      className={cn('px-6 pb-6 pt-2', className)}
    />
  )
}

export type CardTitleProps = React.ComponentPropsWithoutRef<'div'>

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      {...props}
      className={cn('text-xl font-bold', className)}
    />
  )
}

CardGroup.displayName = 'Card.Group'
CardRoot.displayName = 'Card.Root'
CardHeader.displayName = 'Card.Header'
CardMedia.displayName = 'Card.Media'
CardTitle.displayName = 'Card.Title'
CardBody.displayName = 'Card.Body'
CardFooter.displayName = 'Card.Footer'

export const Card = {
  Group: CardGroup,
  Root: CardRoot,
  Header: CardHeader,
  Media: CardMedia,
  Title: CardTitle,
  Body: CardBody,
  Footer: CardFooter,
}
