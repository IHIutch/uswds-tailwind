import type { VariantProps } from 'cva'
import * as React from 'react'
import { cva, cx } from '../cva.config'

// Variants

const footerContainer = cva({
  base: '@desktop:px-8 max-w-desktop mx-auto px-4',
})

const footerPrimaryVariants = cva({
  base: 'bg-gray-5',
  variants: {
    variant: {
      default: '',
      slim: '@desktop:px-4',
      big: 'py-8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerPrimaryListVariants = cva({
  base: 'grid gap-x-4 @desktop:gap-8 @mobile-lg:flex-row divide-y @mobile-lg:divide-y-0 divide-gray-cool-30 border-y @mobile-lg:border-y-0 border-y-gray-cool-30 ',
  variants: {
    variant: {
      default: 'grid-cols-1 @mobile-lg:grid-cols-3 @mobile-lg:col-span-2 @desktop:flex @tablet:flex-wrap',
      slim: 'grid-cols-1 @mobile-lg:grid-cols-2 @mobile-lg:col-span-2 @tablet:w-2/3 @desktop:flex @tablet:flex-wrap @desktop:w-auto @desktop:grow @desktop:max-w-5xl',
      big: 'grid-cols-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerPrimaryItemVariants = cva({
  base: '',
  variants: {
    variant: {
      default: '',
      slim: '',
      big: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerPrimaryInnerVariants = cva({
  base: 'px-0 @mobile-lg:px-4',
  variants: {
    variant: {
      default: '',
      slim: '@mobile-lg:flex',
      big: 'grid @tablet:grid-cols-3 gap-y-8 gap-x-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerSecondaryInnerVariants = cva({
  variants: {
    variant: {
      default: 'grid @mobile-lg:grid-cols-2 gap-y-8 gap-x-4',
      slim: 'flex flex-wrap items-center justify-between gap-4',
      big: 'grid @mobile-lg:grid-cols-2 gap-y-8 gap-x-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerAddressVariants = cva({
  base: 'flex flex-wrap not-italic',
  variants: {
    variant: {
      default: '@mobile-lg:justify-end gap-x-4 @desktop:gap-x-8',
      slim: 'p-4 @mobile-lg:p-0 gap-x-8 @mobile-lg:gap-x-4',
      big: '@mobile-lg:justify-end gap-x-4 @desktop:gap-x-8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerContactInfoVariants = cva({
  base: 'leading-tighter',
  variants: {
    variant: {
      default: '',
      slim: 'w-auto @desktop:py-4',
      big: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const footerContactLinkVariants = cva({
  base: 'text-gray-90 focus:outline-4 focus:outline-blue-40v underline',
  variants: {
    variant: {
      default: '',
      slim: '@mobile-lg:block @mobile-lg:p-4 @desktop:p-0 @desktop:inline',
      big: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Context

export type FooterContextProps = VariantProps<typeof footerPrimaryVariants>

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
          className={cx('@container', className)}
          ref={forwardedRef}
        />
      </FooterContext.Provider>
    )
  },
)

// ReturnToTop

export type FooterReturnToTopProps = React.ComponentPropsWithoutRef<'div'>

function FooterReturnToTop({ className, ...props }: FooterReturnToTopProps) {
  return (
    <div
      {...props}
      className={cx(footerContainer(), 'py-5', className)}
    />
  )
}

// Primary

export type FooterPrimaryProps = React.ComponentPropsWithoutRef<'nav'>

function FooterPrimary({ className, ...props }: FooterPrimaryProps) {
  const { variant } = useFooterContext()

  return (
    <nav
      aria-label="Footer navigation"
      {...props}
      className={cx(footerPrimaryVariants({ variant }), className)}
    />
  )
}

function FooterPrimaryInner({ className, children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { variant } = useFooterContext()
  return (
    <div
      {...props}
      className={cx(
        footerContainer(),
        footerPrimaryInnerVariants({ variant }),
        className,
      )}
    >
      {children}
    </div>
  )
}

// PrimaryList

export type FooterPrimaryListProps = React.ComponentPropsWithoutRef<'ul'>

function FooterPrimaryList({ className, ...props }: FooterPrimaryListProps) {
  const { variant } = useFooterContext()

  return (
    <ul
      {...props}
      className={cx(footerPrimaryListVariants({ variant }), className)}
    />
  )
}

// PrimaryItem

export type FooterPrimaryItemProps = React.ComponentPropsWithoutRef<'li'>

function FooterPrimaryItem({ className, ...props }: FooterPrimaryItemProps) {
  const { variant } = useFooterContext()

  return (
    <li
      {...props}
      className={cx(footerPrimaryItemVariants({ variant }), className)}
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
        className={cx('block p-4 tablet:px-0 font-bold text-gray-90 focus:outline-4 focus:outline-blue-40v underline', className)}
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
      className={cx('bg-gray-cool-10 py-5', className)}
    />
  )
}

// Footer Secondary Inner

function FooterSecondaryInner({ className, children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { variant } = useFooterContext()

  return (
    <div
      {...props}
      className={cx(
        footerContainer(),
        footerSecondaryInnerVariants({ variant }),
        className,
      )}
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
      className={cx('flex flex-wrap flex-col @mobile-lg:flex-row @mobile-lg:items-center gap-4', className)}
    />
  )
}

// Logo Heading

export type FooterLogoHeadingProps = React.ComponentPropsWithoutRef<'div'>

function FooterLogoHeading({ className, ...props }: FooterLogoHeadingProps) {
  return (
    <div
      {...props}
      className={cx('text-2xl font-bold @mobile-lg:mb-1', className)}
    />
  )
}

// Contact Heading

const footerContactHeadingVariants = cva({
  base: 'text-2xl font-bold',
  variants: {
    variant: {
      default: 'mb-6 @mobile-lg:mb-1',
      slim: 'mb-0',
      big: 'mb-6 @mobile-lg:mb-1',
    },
  },
})

export type FooterContactHeadingProps = React.ComponentPropsWithoutRef<'div'>

function FooterContactHeading({ className, ...props }: FooterContactHeadingProps) {
  const { variant } = useFooterContext()
  return (
    <div
      {...props}
      className={cx(footerContactHeadingVariants({ variant }), className)}
    />
  )
}

// Contact

export type FooterContactProps = React.ComponentPropsWithoutRef<'div'>

function FooterContact({ className, ...props }: FooterContactProps) {
  return (
    <div
      {...props}
      className={cx('@mobile-lg:text-right grow', className)}
    />
  )
}

// SocialLinks

export type FooterSocialLinksProps = React.ComponentPropsWithoutRef<'div'>

function FooterSocialLinks({ className, ...props }: FooterSocialLinksProps) {
  return (
    <div
      {...props}
      className={cx('flex flex-wrap @mobile-lg:justify-end gap-2 mb-2', className)}
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
        className={cx('block text-black size-12 p-2 bg-black/10 hover:bg-white focus:outline-4 focus:outline-blue-40v', className)}
        ref={forwardedRef}
      />
    )
  },
)

// Address

export type FooterAddressProps = React.ComponentPropsWithoutRef<'address'>

function FooterAddress({ className, ...props }: FooterAddressProps) {
  const { variant } = useFooterContext()

  return (
    <address
      {...props}
      className={cx(footerAddressVariants({ variant }), className)}
    />
  )
}

// ContactInfo

export type FooterContactInfoProps = React.ComponentPropsWithoutRef<'div'>

function FooterContactInfo({ className, ...props }: FooterContactInfoProps) {
  const { variant } = useFooterContext()

  return (
    <div
      {...props}
      className={cx(footerContactInfoVariants({ variant }), className)}
    />
  )
}

// ContactLink

export type FooterContactLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const FooterContactLink = React.forwardRef<HTMLAnchorElement, FooterContactLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    const { variant } = useFooterContext()

    return (
      <a
        {...props}
        className={cx(footerContactLinkVariants({ variant }), className)}
        ref={forwardedRef}
      />
    )
  },
)

const footerNavVariants = cva({
  base: 'px-4 @tablet:px-0 @tablet:pb-0',
  variants: {
    variant: {
      default: '@tablet:col-span-2',
      slim: '',
      big: '@tablet:col-span-2 grid @mobile-lg:grid-cols-2 @desktop:grid-cols-4 gap-x-4 gap-y-8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Nav (big variant)

export type FooterNavProps = React.ComponentPropsWithoutRef<'nav'>

function FooterNav({ className, children, ...props }: FooterNavProps) {
  const { variant } = useFooterContext()

  return (
    <nav
      aria-label="Footer navigation"
      {...props}
      className={cx(footerNavVariants({ variant }), className)}
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
  return <section {...props} className={cx(className)} />
}

// SectionHeading (big variant)

export type FooterSectionHeadingProps = React.ComponentPropsWithoutRef<'div'>

function FooterSectionHeading({ className, ...props }: FooterSectionHeadingProps) {
  return (
    <div
      {...props}
      className={cx('font-bold font-merriweather mb-4', className)}
    />
  )
}

// SectionList (big variant)

export type FooterSectionListProps = React.ComponentPropsWithoutRef<'ul'>

function FooterSectionList({ className, ...props }: FooterSectionListProps) {
  return (
    <ul
      {...props}
      className={cx('space-y-4', className)}
    />
  )
}

// SectionItem (big variant)

export type FooterSectionItemProps = React.ComponentPropsWithoutRef<'li'>

function FooterSectionItem({ className, ...props }: FooterSectionItemProps) {
  return <li {...props} className={cx(className)} />
}

// SectionLink (big variant)

export type FooterSectionLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const FooterSectionLink = React.forwardRef<HTMLAnchorElement, FooterSectionLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx('text-blue-60v visited:text-violet-70v hover:text-blue-70v focus:outline-4 focus:outline-blue-40v underline', className)}
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
