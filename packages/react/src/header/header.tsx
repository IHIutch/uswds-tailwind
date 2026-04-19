import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

// Variants

const headerContainerVariants = cva({
  base: 'max-w-5xl flex justify-between items-center @desktop:items-end @desktop:px-8 mx-auto',
  variants: {
    variant: {
      default: '',
      extended: '@desktop:block',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const headerBrandingVariants = cva({
  base: '@desktop:mt-8 ml-4 @desktop:ml-0 @desktop:w-1/3 w-full',
  variants: {
    size: {
      md: '@desktop:text-2xl @desktop:mb-4',
      lg: '@desktop:text-3xl @desktop:mb-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const headerPrimaryVariants = cva({
  base: 'border-b border-b-gray-cool-10',
  variants: {
    variant: {
      default: '@desktop:border-b-0',
      extended: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Context

export type HeaderContextProps = VariantProps<typeof headerContainerVariants>

const HeaderContext = React.createContext<HeaderContextProps | null>(null)

function useHeaderContext() {
  const context = React.useContext(HeaderContext)
  if (!context) {
    throw new Error('Header components must be used within a Header.Root')
  }
  return context
}

// Root

export type HeaderRootProps = React.ComponentPropsWithoutRef<'header'> & HeaderContextProps

const HeaderRoot = React.forwardRef<HTMLElement, HeaderRootProps>(
  ({ className, variant, ...props }, forwardedRef) => {
    return (
      <HeaderContext.Provider value={{ variant }}>
        <header
          {...props}
          className={cx('@container', className)}
          ref={forwardedRef}
        />
      </HeaderContext.Provider>
    )
  },
)

// Container

export type HeaderContainerProps = React.ComponentPropsWithoutRef<'div'>

function HeaderContainer({ className, ...props }: HeaderContainerProps) {
  const { variant } = useHeaderContext()

  return (
    <div
      {...props}
      className={cx(headerContainerVariants({ variant }), className)}
    />
  )
}

// Branding

export type HeaderBrandingProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof headerBrandingVariants>

function HeaderBranding({ className, size, ...props }: HeaderBrandingProps) {
  return (
    <div
      {...props}
      className={cx(headerBrandingVariants({ size }), className)}
    />
  )
}

// Primary

export type HeaderPrimaryProps = React.ComponentPropsWithoutRef<'div'>

function HeaderPrimary({ className, ...props }: HeaderPrimaryProps) {
  const { variant } = useHeaderContext()

  return (
    <div
      {...props}
      className={cx(headerPrimaryVariants({ variant }), className)}
    />
  )
}

// Extended

export type HeaderExtendedProps = React.ComponentPropsWithoutRef<'div'>

function HeaderExtended({ className, ...props }: HeaderExtendedProps) {
  const { variant } = useHeaderContext()

  return (
    <div
      {...props}
      className={cx(
        headerContainerVariants({ variant }),
        '@desktop:px-4 relative',
        className,
      )}
    />
  )
}

// SecondaryNav

export type HeaderSecondaryNavProps = React.ComponentPropsWithoutRef<'div'>

function HeaderSecondaryNav({ className, ...props }: HeaderSecondaryNavProps) {
  return (
    <div
      {...props}
      className={cx('@desktop:mt-2 right-8 bottom-16 @desktop:absolute @desktop:flex flex-col items-end', className)}
    />
  )
}

// SecondaryList

export type HeaderSecondaryListProps = React.ComponentPropsWithoutRef<'ul'>

function HeaderSecondaryList({ className, ...props }: HeaderSecondaryListProps) {
  return (
    <ul
      {...props}
      className={cx('@desktop:flex gap-2 mb-4 @desktop:mb-2 @desktop:*:not-first:border-l @desktop:*:not-first:border-gray-cool-10 @desktop:*:not-first:pl-2', className)}
    />
  )
}

// SecondaryItem

export type HeaderSecondaryItemProps = React.ComponentPropsWithoutRef<'li'>

function HeaderSecondaryItem({ className, ...props }: HeaderSecondaryItemProps) {
  return (
    <li
      {...props}
      className={cx('block @desktop:inline-flex', className)}
    />
  )
}

// SecondaryLink

export type HeaderSecondaryLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

function HeaderSecondaryLink({ className, ...props }: HeaderSecondaryLinkProps) {
  return (
    <a
      {...props}
      className={cx('text-gray-50 text-sm leading-none hover:underline hover:text-blue-60v focus:outline-4 focus:outline-blue-40v', className)}
    />
  )
}

// Display names

HeaderRoot.displayName = 'Header.Root'
HeaderContainer.displayName = 'Header.Container'
HeaderBranding.displayName = 'Header.Branding'
HeaderPrimary.displayName = 'Header.Primary'
HeaderExtended.displayName = 'Header.Extended'
HeaderSecondaryNav.displayName = 'Header.SecondaryNav'
HeaderSecondaryList.displayName = 'Header.SecondaryList'
HeaderSecondaryItem.displayName = 'Header.SecondaryItem'
HeaderSecondaryLink.displayName = 'Header.SecondaryLink'

export const Header = {
  Root: HeaderRoot,
  Container: HeaderContainer,
  Branding: HeaderBranding,
  Primary: HeaderPrimary,
  Extended: HeaderExtended,
  SecondaryNav: HeaderSecondaryNav,
  SecondaryList: HeaderSecondaryList,
  SecondaryItem: HeaderSecondaryItem,
  SecondaryLink: HeaderSecondaryLink,
}
