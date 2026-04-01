import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

export type CardGroupProps = React.ComponentPropsWithoutRef<'ul'>

function CardGroup({ className, ...props }: CardGroupProps) {
  return (
    <ul
      {...props}
      className={cx('grid gap-4', className)}
    />
  )
}

const cardRootVariants = cva({
  base: 'bg-white border-2 border-gray-10 rounded grid',
  variants: {
    variant: {
      indent: '',
      flush: '',
      exdent: '',
    },
    layout: {
      vertical: '',
      ltr: 'md:grid-cols-[auto_1fr]',
      rtl: 'md:grid-cols-[1fr_auto]',
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
})

export type CardContextProps = VariantProps<typeof cardRootVariants>

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
    return (
      <CardContext.Provider value={{ layout }}>
        <div
          {...props}
          className={cx(cardRootVariants({ layout, className }))}
          ref={forwardedRef}
        />
      </CardContext.Provider>
    )
  },
)

const cardMediaVariants = cva({
  base: '',
  variants: {
    variant: {
      indent: '',
      flush: 'overflow-hidden',
      exdent: 'overflow-hidden',
    },
    layout: {
      ltr: 'row-span-3 md:col-start-1 md:w-60',
      rtl: 'row-span-3 row-start-1 md:col-start-2 md:w-60',
      vertical: '',
    },
  },
  compoundVariants: [
    {
      layout: ['ltr'],
      variant: 'exdent',
      className: '-my-0.5 -ml-0.5 rounded-l',
    },
    {
      layout: ['rtl'],
      variant: 'exdent',
      className: '-my-0.5 -mr-0.5 rounded-r',
    },
    {
      layout: 'vertical',
      variant: 'exdent',
      className: '-mx-0.5 -mt-0.5 rounded-t',
    },
    {
      layout: ['rtl'],
      variant: 'flush',
      className: 'rounded-r-xs',
    },
    {
      layout: ['ltr'],
      variant: 'flush',
      className: 'rounded-l-xs',
    },
    {
      layout: ['vertical'],
      variant: 'flush',
      className: 'rounded-t-xs',
    },
    {
      layout: ['ltr'],
      variant: 'indent',
      className: 'p-6 md:pr-0',
    },
    {
      layout: ['rtl'],
      variant: 'indent',
      className: 'p-6 md:pl-0',
    },
    {
      layout: 'vertical',
      variant: 'indent',
      className: 'px-6 pt-6',
    },
  ],
  defaultVariants: {
    variant: 'indent',
    layout: 'vertical',
  },
})

export type CardMediaProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof cardMediaVariants>

function CardMedia({ className, variant, ...props }: CardMediaProps) {
  const { layout } = useCardContext()
  return (
    <div
      {...props}
      className={cx(cardMediaVariants({ layout, variant, className }))}
    />
  )
}

const cardHeaderVariants = cva({
  base: 'pb-2',
  variants: {
    variant: {
      indent: 'px-6 pt-6',
      flush: 'rounded-t-xs  overflow-hidden',
      exdent: '-mx-0.5 -mt-0.5 rounded-t overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'indent',
  },
})

export type CardHeaderProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof cardHeaderVariants>

function CardHeader({ className, variant, ...props }: CardHeaderProps) {
  return (
    <div
      {...props}
      className={cx(
        cardHeaderVariants({ variant }),
        className,
      )}
    />
  )
}

const cardBodyVariants = cva({
  base: 'grow py-2',
  variants: {
    variant: {
      indent: 'px-6',
      flush: 'overflow-hidden',
      exdent: '-mx-0.5 overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'indent',
  },
})

export type CardBodyProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof cardBodyVariants>

function CardBody({ className, variant, ...props }: CardBodyProps) {
  return (
    <div
      {...props}
      className={cx(cardBodyVariants({
        variant,
      }), className)}
    />
  )
}

export type CardFooterProps = React.ComponentPropsWithoutRef<'div'>

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      {...props}
      className={cx('px-6 pb-6 pt-2', className)}
    />
  )
}

export type CardTitleProps = React.ComponentPropsWithoutRef<'div'>

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      {...props}
      className={cx('text-xl font-bold', className)}
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
