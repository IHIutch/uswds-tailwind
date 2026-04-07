import * as React from 'react'
import { cx } from '../cva.config'

// Root

export type HeaderRootProps = React.ComponentPropsWithoutRef<'header'>

const HeaderRoot = React.forwardRef<HTMLElement, HeaderRootProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <header
        {...props}
        className={cx('@container', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Container

export type HeaderContainerProps = React.ComponentPropsWithoutRef<'div'>

function HeaderContainer({ className, ...props }: HeaderContainerProps) {
  return (
    <div
      {...props}
      className={cx('max-w-5xl flex mx-auto justify-between items-center @desktop:items-end border-b @desktop:border-b-0 border-b-gray-cool-10', className)}
    />
  )
}

// Branding

export type HeaderBrandingProps = React.ComponentPropsWithoutRef<'div'>

function HeaderBranding({ className, ...props }: HeaderBrandingProps) {
  return (
    <div
      {...props}
      className={cx('@desktop:text-2xl @desktop:mt-8 @desktop:mb-4 ml-4 @desktop:ml-0 @desktop:w-1/3 w-full', className)}
    />
  )
}

// Display names

HeaderRoot.displayName = 'Header.Root'
HeaderContainer.displayName = 'Header.Container'
HeaderBranding.displayName = 'Header.Branding'

export const Header = {
  Root: HeaderRoot,
  Container: HeaderContainer,
  Branding: HeaderBranding,
}
