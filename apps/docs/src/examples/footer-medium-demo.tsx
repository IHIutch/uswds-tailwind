import { Button, Footer, Input, Link } from '@uswds-tailwind/react'

export default function FooterMediumDemo() {
  return (
    <Footer.Root variant="big">
      <Footer.ReturnToTop>
        <Link href="#main-content">Return to top</Link>
      </Footer.ReturnToTop>
      <Footer.Primary>
        <Footer.PrimaryInner>
          <Footer.Nav>
            <Footer.Section>
              <Footer.SectionHeading><h4>About</h4></Footer.SectionHeading>
              <Footer.SectionList>
                <Footer.SectionItem><Footer.SectionLink href="#">Our agency</Footer.SectionLink></Footer.SectionItem>
                <Footer.SectionItem><Footer.SectionLink href="#">Leadership</Footer.SectionLink></Footer.SectionItem>
              </Footer.SectionList>
            </Footer.Section>
            <Footer.Section>
              <Footer.SectionHeading><h4>Resources</h4></Footer.SectionHeading>
              <Footer.SectionList>
                <Footer.SectionItem><Footer.SectionLink href="#">Services</Footer.SectionLink></Footer.SectionItem>
                <Footer.SectionItem><Footer.SectionLink href="#">Publications</Footer.SectionLink></Footer.SectionItem>
              </Footer.SectionList>
            </Footer.Section>
          </Footer.Nav>
          <div className="border-t @tablet:border-t-0 border-t-gray-cool-30 pt-8 px-4 @tablet:p-0">
            <h3 className="text-xl font-bold font-merriweather">Sign Up</h3>
            <label htmlFor="footer-email" className="block mt-3">Your email address</label>
            <Input id="footer-email" type="email" />
            <Button className="mt-2 @mobile-lg:mt-6">Sign Up</Button>
          </div>
        </Footer.PrimaryInner>
      </Footer.Primary>
      <Footer.Secondary>
        <Footer.SecondaryInner>
          <Footer.Logo>
            <div aria-hidden="true" className="bg-white size-20 rounded-full" />
            <Footer.LogoHeading>Name of agency</Footer.LogoHeading>
          </Footer.Logo>
          <Footer.Contact>
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
