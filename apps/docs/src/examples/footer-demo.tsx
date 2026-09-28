import { Footer, Link } from '@uswds-tailwind/react'

export default function FooterDemo() {
  return (
    <Footer.Root>
      <Footer.ReturnToTop>
        <Link href="#main-content">Return to top</Link>
      </Footer.ReturnToTop>
      <Footer.Primary>
        <Footer.PrimaryInner>
          <Footer.PrimaryList>
            <Footer.PrimaryItem><Footer.PrimaryLink href="#">About us</Footer.PrimaryLink></Footer.PrimaryItem>
            <Footer.PrimaryItem><Footer.PrimaryLink href="#">Resources</Footer.PrimaryLink></Footer.PrimaryItem>
            <Footer.PrimaryItem><Footer.PrimaryLink href="#">Contact us</Footer.PrimaryLink></Footer.PrimaryItem>
          </Footer.PrimaryList>
        </Footer.PrimaryInner>
      </Footer.Primary>
      <Footer.Secondary>
        <Footer.SecondaryInner>
          <Footer.Logo>
            <div aria-hidden="true" className="bg-white size-20 rounded-full" />
            <Footer.LogoHeading>Name of agency</Footer.LogoHeading>
          </Footer.Logo>
          <Footer.Contact>
            <Footer.SocialLinks>
              <Footer.SocialLink href="#"><span className="icon-[fa6-brands--facebook] size-full" /><span className="sr-only">Facebook</span></Footer.SocialLink>
              <Footer.SocialLink href="#"><span className="icon-[fa6-brands--youtube] size-full" /><span className="sr-only">YouTube</span></Footer.SocialLink>
            </Footer.SocialLinks>
            <Footer.ContactHeading>Agency Contact Center</Footer.ContactHeading>
            <Footer.Address>
              <Footer.ContactInfo><Footer.ContactLink href="tel:1-800-555-5555">(800) 555-GOVT</Footer.ContactLink></Footer.ContactInfo>
              <Footer.ContactInfo><Footer.ContactLink href="mailto:info@agency.gov">info@agency.gov</Footer.ContactLink></Footer.ContactInfo>
            </Footer.Address>
          </Footer.Contact>
        </Footer.SecondaryInner>
      </Footer.Secondary>
    </Footer.Root>
  )
}
