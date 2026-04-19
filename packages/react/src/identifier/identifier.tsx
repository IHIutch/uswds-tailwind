import * as React from 'react'
import { cx } from '../cva.config'

// Root

export type IdentifierRootProps = React.ComponentPropsWithoutRef<'div'>

function IdentifierRoot({ className, ...props }: IdentifierRootProps) {
  return (
    <div
      {...props}
      className={cx('@container bg-gray-90 text-white pb-4 font-public-sans', className)}
    />
  )
}

// Container

export type IdentifierContainerProps = React.ComponentPropsWithoutRef<'div'>

function IdentifierContainer({ className, ...props }: IdentifierContainerProps) {
  return (
    <div
      {...props}
      className={cx('max-w-desktop mx-auto px-4 desktop:px-8', className)}
    />
  )
}

// Masthead

export type IdentifierMastheadProps = React.ComponentPropsWithoutRef<'section'>

function IdentifierMasthead({ className, ...props }: IdentifierMastheadProps) {
  return (
    <section
      {...props}
      className={cx('py-4 flex flex-col @tablet:flex-row gap-4', className)}
    />
  )
}

// LogoGroup

export type IdentifierLogoGroupProps = React.ComponentPropsWithoutRef<'div'>

function IdentifierLogoGroup({ className, ...props }: IdentifierLogoGroupProps) {
  return (
    <div
      {...props}
      className={cx('flex gap-2', className)}
    />
  )
}

// Logo

export type IdentifierLogoProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const IdentifierLogo = React.forwardRef<HTMLAnchorElement, IdentifierLogoProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx('block focus:outline-4 focus:outline-blue-40v h-12 rounded-full overflow-hidden', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Identity

export type IdentifierIdentityProps = React.ComponentPropsWithoutRef<'section'>

function IdentifierIdentity({ className, ...props }: IdentifierIdentityProps) {
  return (
    <section
      {...props}
      className={cx(className)}
    />
  )
}

// Domain

export type IdentifierDomainProps = React.ComponentPropsWithoutRef<'p'>

function IdentifierDomain({ className, ...props }: IdentifierDomainProps) {
  return (
    <p
      {...props}
      className={cx('text-gray-30', className)}
    />
  )
}

// Disclaimer

export type IdentifierDisclaimerProps = React.ComponentPropsWithoutRef<'p'>

function IdentifierDisclaimer({ className, ...props }: IdentifierDisclaimerProps) {
  return (
    <p
      {...props}
      className={cx('font-bold', className)}
    />
  )
}

// RequiredLinks

export type IdentifierRequiredLinksProps = React.ComponentPropsWithoutRef<'nav'>

function IdentifierRequiredLinks({ className, ...props }: IdentifierRequiredLinksProps) {
  return (
    <nav
      {...props}
      className={cx('py-2', className)}
    />
  )
}

// RequiredLinksList

export type IdentifierRequiredLinksListProps = React.ComponentPropsWithoutRef<'ul'>

function IdentifierRequiredLinksList({ className, ...props }: IdentifierRequiredLinksListProps) {
  return (
    <ul
      {...props}
      className={cx('columns-1 @tablet:columns-2 @desktop:columns-4 space-y-2', className)}
    />
  )
}

// LinkItem

export type IdentifierLinkItemProps = React.ComponentPropsWithoutRef<'li'>

function IdentifierLinkItem({ className, ...props }: IdentifierLinkItemProps) {
  return (
    <li
      {...props}
      className={cx(className)}
    />
  )
}

// Link

export type IdentifierLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const IdentifierLink = React.forwardRef<HTMLAnchorElement, IdentifierLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx('text-gray-cool-30 hover:text-gray-cool-10 focus:outline-4 focus:outline-blue-40v underline', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Tagline

export type IdentifierTaglineProps = React.ComponentPropsWithoutRef<'section'>

function IdentifierTagline({ className, children, ...props }: IdentifierTaglineProps) {
  return (
    <section
      {...props}
      className={cx('py-4', className)}
    >
      {children}
    </section>
  )
}

// Display names

IdentifierRoot.displayName = 'Identifier.Root'
IdentifierContainer.displayName = 'Identifier.Container'
IdentifierMasthead.displayName = 'Identifier.Masthead'
IdentifierLogoGroup.displayName = 'Identifier.LogoGroup'
IdentifierLogo.displayName = 'Identifier.Logo'
IdentifierIdentity.displayName = 'Identifier.Identity'
IdentifierDomain.displayName = 'Identifier.Domain'
IdentifierDisclaimer.displayName = 'Identifier.Disclaimer'
IdentifierRequiredLinks.displayName = 'Identifier.RequiredLinks'
IdentifierRequiredLinksList.displayName = 'Identifier.RequiredLinksList'
IdentifierLinkItem.displayName = 'Identifier.LinkItem'
IdentifierLink.displayName = 'Identifier.Link'
IdentifierTagline.displayName = 'Identifier.Tagline'

export const Identifier = {
  Root: IdentifierRoot,
  Container: IdentifierContainer,
  Masthead: IdentifierMasthead,
  LogoGroup: IdentifierLogoGroup,
  Logo: IdentifierLogo,
  Identity: IdentifierIdentity,
  Domain: IdentifierDomain,
  Disclaimer: IdentifierDisclaimer,
  RequiredLinks: IdentifierRequiredLinks,
  RequiredLinksList: IdentifierRequiredLinksList,
  LinkItem: IdentifierLinkItem,
  Link: IdentifierLink,
  Tagline: IdentifierTagline,
}
