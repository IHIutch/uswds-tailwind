import type { VariantProps } from '../tv.config'
import * as React from 'react'
import { cn, tv } from '../tv.config'

// Variants

const footerVariants = tv({
  slots: {
    container: '@desktop:px-8 max-w-desktop mx-auto px-4',
    primary: 'bg-gray-5',
    primaryList: 'grid gap-x-4 @desktop:gap-8 @mobile-lg:flex-row divide-y @mobile-lg:divide-y-0 divide-gray-cool-30 border-y @mobile-lg:border-y-0 border-y-gray-cool-30 ',
    primaryInner: 'px-0 @mobile-lg:px-4',
    secondaryInner: '',
    address: 'flex flex-wrap not-italic',
    contactInfo: 'leading-tighter',
    contactLink: 'text-gray-90 focus:outline-4 focus:outline-blue-40v underline',
    contactHeading: 'text-2xl font-bold',
    nav: 'px-4 @tablet:px-0 @tablet:pb-0',
  },
  variants: {
    variant: {
      default: {
        primaryList: 'grid-cols-1 @mobile-lg:grid-cols-3 @mobile-lg:col-span-2 @desktop:flex @tablet:flex-wrap',
        secondaryInner: 'grid @mobile-lg:grid-cols-2 gap-y-8 gap-x-4',
        address: '@mobile-lg:justify-end gap-x-4 @desktop:gap-x-8',
        contactHeading: 'mb-6 @mobile-lg:mb-1',
        nav: '@tablet:col-span-2',
      },
      slim: {
        primary: '@desktop:px-4',
        primaryList: 'grid-cols-1 @mobile-lg:grid-cols-2 @mobile-lg:col-span-2 @tablet:w-2/3 @desktop:flex @tablet:flex-wrap @desktop:w-auto @desktop:grow @desktop:max-w-5xl',
        primaryInner: '@mobile-lg:flex',
        secondaryInner: 'flex flex-wrap items-center justify-between gap-4',
        address: 'p-4 @mobile-lg:p-0 gap-x-8 @mobile-lg:gap-x-4',
        contactInfo: 'w-auto @desktop:py-4',
        contactLink: '@mobile-lg:block @mobile-lg:p-4 @desktop:p-0 @desktop:inline',
        contactHeading: 'mb-0',
      },
      big: {
        primary: 'py-8',
        primaryList: 'grid-cols-2',
        primaryInner: 'grid @tablet:grid-cols-3 gap-y-8 gap-x-4',
        secondaryInner: 'grid @mobile-lg:grid-cols-2 gap-y-8 gap-x-4',
        address: '@mobile-lg:justify-end gap-x-4 @desktop:gap-x-8',
        contactHeading: 'mb-6 @mobile-lg:mb-1',
        nav: '@tablet:col-span-2 grid @mobile-lg:grid-cols-2 @desktop:grid-cols-4 gap-x-4 gap-y-8',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Context

export type FooterContextProps = VariantProps<typeof footerVariants>

const FooterContext = React.createContext<FooterContextProps | null>(null)

function useFooterContext() {
  const context = React.useContext(FooterContext)
  if (!context) {
    throw new Error('Footer components must be used within a Footer.Root')
  }
  return context
}

// Root

export type FooterRootProps = React.ComponentPropsWithoutRef<'footer'> & FooterContextProps

const FooterRoot = React.forwardRef<HTMLElement, FooterRootProps>(
  ({ className, variant, ...props }, forwardedRef) => {
    return (
      <FooterContext.Provider value={{ variant }}>
        <footer
          {...props}
          className={cn('@container', className)}
          ref={forwardedRef}
        />
      </FooterContext.Provider>
    )
  },
)

// ReturnToTop

export type FooterReturnToTopProps = React.ComponentPropsWithoutRef<'div'>

function FooterReturnToTop({ className, ...props }: FooterReturnToTopProps) {
  const { container } = footerVariants()
  return (
    <div
      {...props}
      className={cn(container(), 'py-5', className)}
    />
  )
}

// Primary

export type FooterPrimaryProps = React.ComponentPropsWithoutRef<'nav'>

function FooterPrimary({ className, ...props }: FooterPrimaryProps) {
  const { variant } = useFooterContext()
  const { primary } = footerVariants({ variant })

  return (
    <nav
      aria-label="Footer navigation"
      {...props}
      className={primary({ className })}
    />
  )
}

function FooterPrimaryInner({ className, children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { variant } = useFooterContext()
  const { container, primaryInner } = footerVariants({ variant })
  return (
    <div
      {...props}
      className={cn(container(), primaryInner({ className }))}
    >
      {children}
    </div>
  )
}

// PrimaryList

export type FooterPrimaryListProps = React.ComponentPropsWithoutRef<'ul'>

function FooterPrimaryList({ className, ...props }: FooterPrimaryListProps) {
  const { variant } = useFooterContext()
  const { primaryList } = footerVariants({ variant })

  return (
    <ul
      {...props}
      className={primaryList({ className })}
    />
  )
}

// PrimaryItem

export type FooterPrimaryItemProps = React.ComponentPropsWithoutRef<'li'>

function FooterPrimaryItem({ className, ...props }: FooterPrimaryItemProps) {
  return (
    <li
      {...props}
      className={cn(className)}
    />
  )
}

// PrimaryLink

export type FooterPrimaryLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const FooterPrimaryLink = React.forwardRef<HTMLAnchorElement, FooterPrimaryLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cn('block p-4 tablet:px-0 font-bold text-gray-90 focus:outline-4 focus:outline-blue-40v underline', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Secondary

export type FooterSecondaryProps = React.ComponentPropsWithoutRef<'div'>

function FooterSecondary({ className, ...props }: FooterSecondaryProps) {
  return (
    <div
      {...props}
      className={cn('bg-gray-cool-10 py-5', className)}
    />
  )
}

// Footer Secondary Inner

function FooterSecondaryInner({ className, children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { variant } = useFooterContext()
  const { container, secondaryInner } = footerVariants({ variant })

  return (
    <div
      {...props}
      className={cn(container(), secondaryInner({ className }))}
    >
      {children}
    </div>
  )
}

// Logo

export type FooterLogoProps = React.ComponentPropsWithoutRef<'div'>

function FooterLogo({ className, ...props }: FooterLogoProps) {
  return (
    <div
      {...props}
      className={cn('flex flex-wrap flex-col @mobile-lg:flex-row @mobile-lg:items-center gap-4', className)}
    />
  )
}

// Logo Heading

export type FooterLogoHeadingProps = React.ComponentPropsWithoutRef<'div'>

function FooterLogoHeading({ className, ...props }: FooterLogoHeadingProps) {
  return (
    <div
      {...props}
      className={cn('text-2xl font-bold @mobile-lg:mb-1', className)}
    />
  )
}

// Contact Heading

export type FooterContactHeadingProps = React.ComponentPropsWithoutRef<'div'>

function FooterContactHeading({ className, ...props }: FooterContactHeadingProps) {
  const { variant } = useFooterContext()
  const { contactHeading } = footerVariants({ variant })
  return (
    <div
      {...props}
      className={contactHeading({ className })}
    />
  )
}

// Contact

export type FooterContactProps = React.ComponentPropsWithoutRef<'div'>

function FooterContact({ className, ...props }: FooterContactProps) {
  return (
    <div
      {...props}
      className={cn('@mobile-lg:text-right grow', className)}
    />
  )
}

// SocialLinks

export type FooterSocialLinksProps = React.ComponentPropsWithoutRef<'div'>

function FooterSocialLinks({ className, ...props }: FooterSocialLinksProps) {
  return (
    <div
      {...props}
      className={cn('flex flex-wrap @mobile-lg:justify-end gap-2 mb-2', className)}
    />
  )
}

// SocialLink

export type FooterSocialLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const FooterSocialLink = React.forwardRef<HTMLAnchorElement, FooterSocialLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cn('block text-black size-12 p-2 bg-black/10 hover:bg-white focus:outline-4 focus:outline-blue-40v', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Address

export type FooterAddressProps = React.ComponentPropsWithoutRef<'address'>

function FooterAddress({ className, ...props }: FooterAddressProps) {
  const { variant } = useFooterContext()
  const { address } = footerVariants({ variant })

  return (
    <address
      {...props}
      className={address({ className })}
    />
  )
}

// ContactInfo

export type FooterContactInfoProps = React.ComponentPropsWithoutRef<'div'>

function FooterContactInfo({ className, ...props }: FooterContactInfoProps) {
  const { variant } = useFooterContext()
  const { contactInfo } = footerVariants({ variant })

  return (
    <div
      {...props}
      className={contactInfo({ className })}
    />
  )
}

// ContactLink

export type FooterContactLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const FooterContactLink = React.forwardRef<HTMLAnchorElement, FooterContactLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    const { variant } = useFooterContext()
    const { contactLink } = footerVariants({ variant })

    return (
      <a
        {...props}
        className={contactLink({ className })}
        ref={forwardedRef}
      />
    )
  },
)

// Nav (big variant)

export type FooterNavProps = React.ComponentPropsWithoutRef<'nav'>

function FooterNav({ className, children, ...props }: FooterNavProps) {
  const { variant } = useFooterContext()
  const { nav } = footerVariants({ variant })

  return (
    <nav
      aria-label="Footer navigation"
      {...props}
      className={nav({ className })}
    >
      {/* <div className="grid "> */}
      {children}
      {/* </div> */}
    </nav>
  )
}

// Section (big variant)

export type FooterSectionProps = React.ComponentPropsWithoutRef<'section'>

function FooterSection({ className, ...props }: FooterSectionProps) {
  return <section {...props} className={cn(className)} />
}

// SectionHeading (big variant)

export type FooterSectionHeadingProps = React.ComponentPropsWithoutRef<'div'>

function FooterSectionHeading({ className, ...props }: FooterSectionHeadingProps) {
  return (
    <div
      {...props}
      className={cn('font-bold font-merriweather mb-4', className)}
    />
  )
}

// SectionList (big variant)

export type FooterSectionListProps = React.ComponentPropsWithoutRef<'ul'>

function FooterSectionList({ className, ...props }: FooterSectionListProps) {
  return (
    <ul
      {...props}
      className={cn('space-y-4', className)}
    />
  )
}

// SectionItem (big variant)

export type FooterSectionItemProps = React.ComponentPropsWithoutRef<'li'>

function FooterSectionItem({ className, ...props }: FooterSectionItemProps) {
  return <li {...props} className={cn(className)} />
}

// SectionLink (big variant)

export type FooterSectionLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const FooterSectionLink = React.forwardRef<HTMLAnchorElement, FooterSectionLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cn('text-blue-60v visited:text-violet-70v hover:text-blue-70v focus:outline-4 focus:outline-blue-40v underline', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Display names

FooterRoot.displayName = 'Footer.Root'
FooterReturnToTop.displayName = 'Footer.ReturnToTop'
FooterPrimary.displayName = 'Footer.Primary'
FooterPrimaryInner.displayName = 'Footer.PrimaryInner'
FooterPrimaryList.displayName = 'Footer.PrimaryList'
FooterPrimaryItem.displayName = 'Footer.PrimaryItem'
FooterPrimaryLink.displayName = 'Footer.PrimaryLink'
FooterSecondary.displayName = 'Footer.Secondary'
FooterSecondaryInner.displayName = 'Footer.SecondaryInner'
FooterLogo.displayName = 'Footer.Logo'
FooterLogoHeading.displayName = 'Footer.LogoHeading'
FooterContact.displayName = 'Footer.Contact'
FooterContactHeading.displayName = 'Footer.ContactHeading'
FooterSocialLinks.displayName = 'Footer.SocialLinks'
FooterSocialLink.displayName = 'Footer.SocialLink'
FooterAddress.displayName = 'Footer.Address'
FooterContactInfo.displayName = 'Footer.ContactInfo'
FooterContactLink.displayName = 'Footer.ContactLink'
FooterNav.displayName = 'Footer.Nav'
FooterSection.displayName = 'Footer.Section'
FooterSectionHeading.displayName = 'Footer.SectionHeading'
FooterSectionList.displayName = 'Footer.SectionList'
FooterSectionItem.displayName = 'Footer.SectionItem'
FooterSectionLink.displayName = 'Footer.SectionLink'

export const Footer = {
  Root: FooterRoot,
  ReturnToTop: FooterReturnToTop,
  Primary: FooterPrimary,
  PrimaryInner: FooterPrimaryInner,
  PrimaryList: FooterPrimaryList,
  PrimaryItem: FooterPrimaryItem,
  PrimaryLink: FooterPrimaryLink,
  Secondary: FooterSecondary,
  SecondaryInner: FooterSecondaryInner,
  Logo: FooterLogo,
  LogoHeading: FooterLogoHeading,
  Contact: FooterContact,
  SocialLinks: FooterSocialLinks,
  SocialLink: FooterSocialLink,
  Address: FooterAddress,
  ContactHeading: FooterContactHeading,
  ContactInfo: FooterContactInfo,
  ContactLink: FooterContactLink,
  Nav: FooterNav,
  Section: FooterSection,
  SectionHeading: FooterSectionHeading,
  SectionList: FooterSectionList,
  SectionItem: FooterSectionItem,
  SectionLink: FooterSectionLink,
}
