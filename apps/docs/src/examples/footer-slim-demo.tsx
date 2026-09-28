import { Footer, Link } from '@uswds-tailwind/react'

export default function FooterSlimDemo() {
  return (
    <Footer.Root variant="slim">
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
          <Footer.Address>
            <Footer.ContactInfo><Footer.ContactLink href="tel:1-800-555-5555">(800) 555-GOVT</Footer.ContactLink></Footer.ContactInfo>
            <Footer.ContactInfo><Footer.ContactLink href="mailto:info@agency.gov">info@agency.gov</Footer.ContactLink></Footer.ContactInfo>
          </Footer.Address>
        </Footer.PrimaryInner>
      </Footer.Primary>
      <Footer.Secondary>
        <Footer.SecondaryInner>
          <div aria-hidden="true" className="bg-white size-12 rounded-full" />
          <Footer.ContactHeading>Agency Contact Center</Footer.ContactHeading>
        </Footer.SecondaryInner>
      </Footer.Secondary>
    </Footer.Root>
  )
}
