import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

// Root
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

export type HeaderContextProps = & VariantProps<typeof headerContainerVariants>

const HeaderContext = React.createContext<HeaderContextProps | null>(null)

function useHeaderContext() {
  const context = React.useContext(HeaderContext)
  if (!context) {
    throw new Error('Header components must be used within a Header.Root')
  }
  return context
}

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

export type HeaderBrandingProps = React.ComponentPropsWithoutRef<'div'> & {
  size?: 'md' | 'lg'
}

function HeaderBranding({ className, size, ...props }: HeaderBrandingProps) {
  return (
    <div
      {...props}
      className={cx(
        size === 'lg' ? '@desktop:text-3xl @desktop:mb-6' : '@desktop:text-2xl @desktop:mb-4',
        '@desktop:mt-8 ml-4 @desktop:ml-0 @desktop:w-1/3 w-full',
        className,
      )}
    />
  )
}

// Primary (slot)

export type HeaderPrimaryProps = React.ComponentPropsWithoutRef<'div'>

function HeaderPrimary({ className, ...props }: HeaderPrimaryProps) {
  const { variant } = useHeaderContext()

  return (
    <div
      {...props}
      className={cx(
        variant !== 'extended' ? '@desktop:border-b-0' : '',
        'border-b border-b-gray-cool-10',
        className,
      )}
    />
  )
}

// Extended (slot)

export type HeaderExtendedProps = React.ComponentPropsWithoutRef<'div'>

function HeaderExtended({ className, ...props }: HeaderExtendedProps) {
  const { variant } = useHeaderContext()

  return (
    <div
      {...props}
      className={cx(
        headerContainerVariants({ variant }),
        '@desktop:px-4 relative',
        // 'desktop:border-t border-t-gray-cool-10 @desktop:px-4 relative',
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

export type HeaderSecondaryLinkProps = React.ComponentPropsWithoutRef<'a'>

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
