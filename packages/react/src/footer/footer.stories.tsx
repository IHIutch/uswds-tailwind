import preview from '../../.storybook/preview'
import { Button } from '../button'
import { Field } from '../field'
import { Input } from '../input'
import { Link } from '../link'
import { Footer } from './footer'

const meta = preview.meta({
  title: 'Components/Footer',
  component: Footer.Root,
})

const primaryLinks = [
  { label: 'Primary link', href: '#' },
  { label: 'Primary link', href: '#' },
  { label: 'Primary link', href: '#' },
  { label: 'Primary link', href: '#' },
]

const socialLinks = [
  { label: 'Facebook', icon: 'icon-[fa6-brands--facebook]' },
  { label: 'Twitter', icon: 'icon-[fa6-brands--twitter]' },
  { label: 'YouTube', icon: 'icon-[fa6-brands--youtube]' },
  { label: 'Instagram', icon: 'icon-[fa6-brands--instagram]' },
  { label: 'RSS', icon: 'icon-[material-symbols--rss-feed]' },
]

export const Default = meta.story({
  args: {
    variant: 'default',
  },
  render: args => (
    <Footer.Root {...args}>
      <Footer.ReturnToTop>
        <Link href="#">Return to top</Link>
      </Footer.ReturnToTop>
      <Footer.Primary aria-label="Footer navigation">
        <Footer.PrimaryInner>
          <Footer.PrimaryList>
            {primaryLinks.map((link, i) => (
              <Footer.PrimaryItem key={i}>
                <Footer.PrimaryLink href={link.href}>{link.label}</Footer.PrimaryLink>
              </Footer.PrimaryItem>
            ))}
          </Footer.PrimaryList>
        </Footer.PrimaryInner>
      </Footer.Primary>
      <Footer.Secondary>
        <Footer.SecondaryInner>
          <Footer.Logo>
            <img src="" alt="" className="bg-white size-20 rounded-full object-cover" />
            <Footer.LogoHeading>Name of agency</Footer.LogoHeading>
          </Footer.Logo>
          <Footer.Contact>
            <Footer.SocialLinks>
              {socialLinks.map(social => (
                <div key={social.label}>
                  <Footer.SocialLink href="#">
                    <div className={`${social.icon} size-full`} />
                    <span className="sr-only">{social.label}</span>
                  </Footer.SocialLink>
                </div>
              ))}
            </Footer.SocialLinks>
            <Footer.ContactHeading>Agency Contact Center</Footer.ContactHeading>
            <Footer.Address>
              <Footer.ContactInfo>
                <Footer.ContactLink href="tel:1-800-555-5555">(800) 555-GOVT</Footer.ContactLink>
              </Footer.ContactInfo>
              <Footer.ContactInfo>
                <Footer.ContactLink href="mailto:info@agency.gov">info@agency.gov</Footer.ContactLink>
              </Footer.ContactInfo>
            </Footer.Address>
          </Footer.Contact>
        </Footer.SecondaryInner>
      </Footer.Secondary>
    </Footer.Root>
  ),
})

const bigSections = [
  {
    heading: 'Topic',
    links: ['Secondary link', 'Secondary link', 'Secondary link', 'Secondary link'],
  },
  {
    heading: 'Topic',
    links: ['Secondary link', 'Secondary link', 'Secondary link', 'Secondary link'],
  },
  {
    heading: 'Topic',
    links: ['Secondary link', 'Secondary link', 'Secondary link', 'Secondary link'],
  },
  {
    heading: 'Topic',
    links: ['Secondary link', 'Secondary link', 'Secondary link', 'Secondary link'],
  },
]

export const Big = meta.story({
  render: () => (
    <Footer.Root variant="big">
      <Footer.ReturnToTop>
        <Link href="#">Return to top</Link>
      </Footer.ReturnToTop>
      <Footer.Primary aria-label="Footer navigation">
        <Footer.PrimaryInner>
          <Footer.Nav>
            {bigSections.map((section, i) => (
              <Footer.Section key={i}>
                <Footer.SectionHeading>
                  <h4>{section.heading}</h4>
                </Footer.SectionHeading>
                <Footer.SectionList>
                  {section.links.map((label, j) => (
                    <Footer.SectionItem key={j}>
                      <Footer.SectionLink href="#">{label}</Footer.SectionLink>
                    </Footer.SectionItem>
                  ))}
                </Footer.SectionList>
              </Footer.Section>
            ))}
          </Footer.Nav>
          <div className="border-t @tablet:border-t-0 border-t-gray-cool-30 pt-8 px-4 @tablet:p-0">
            <h3 className="text-xl font-bold font-merriweather">Sign Up</h3>
            <Field.Root className="@mobile-lg:max-w-xs mt-3">
              <Field.Label>Your email address</Field.Label>
              <Input type="email" />
            </Field.Root>
            <Button className="mt-2 @mobile-lg:mt-6 w-full @mobile-lg:w-auto">Sign Up</Button>
          </div>
        </Footer.PrimaryInner>
      </Footer.Primary>
      <Footer.Secondary>
        <Footer.SecondaryInner>
          <Footer.Logo>
            <img src="" alt="" className="bg-white size-20 rounded-full object-cover" />
            <Footer.LogoHeading>Name of agency</Footer.LogoHeading>
          </Footer.Logo>
          <Footer.Contact>
            <Footer.SocialLinks>
              {socialLinks.map(social => (
                <Footer.SocialLink key={social.label} href="#">
                  <div className={`${social.icon} size-full`} />
                  <span className="sr-only">{social.label}</span>
                </Footer.SocialLink>
              ))}
            </Footer.SocialLinks>
            <Footer.ContactHeading>Agency Contact Center</Footer.ContactHeading>
            <Footer.Address>
              <Footer.ContactInfo>
                <Footer.ContactLink href="tel:1-800-555-5555">(800) 555-GOVT</Footer.ContactLink>
              </Footer.ContactInfo>
              <Footer.ContactInfo>
                <Footer.ContactLink href="mailto:info@agency.gov">info@agency.gov</Footer.ContactLink>
              </Footer.ContactInfo>
            </Footer.Address>
          </Footer.Contact>
        </Footer.SecondaryInner>
      </Footer.Secondary>
    </Footer.Root>
  ),
})

export const Slim = meta.story({
  render: () => (
    <Footer.Root variant="slim">
      <Footer.ReturnToTop>
        <Link href="#">Return to top</Link>
      </Footer.ReturnToTop>
      <Footer.Primary aria-label="Footer navigation">
        <Footer.PrimaryInner>
          <Footer.PrimaryList>
            {primaryLinks.map((link, i) => (
              <Footer.PrimaryItem key={i}>
                <Footer.PrimaryLink href={link.href}>{link.label}</Footer.PrimaryLink>
              </Footer.PrimaryItem>
            ))}
          </Footer.PrimaryList>
          <Footer.Address>
            <Footer.ContactInfo>
              <Footer.ContactLink href="tel:1-800-555-5555">(800) 555-GOVT</Footer.ContactLink>
            </Footer.ContactInfo>
            <Footer.ContactInfo>
              <Footer.ContactLink href="mailto:info@agency.gov">information@agency.gov</Footer.ContactLink>
            </Footer.ContactInfo>
          </Footer.Address>
        </Footer.PrimaryInner>
      </Footer.Primary>
      <Footer.Secondary>
        <Footer.SecondaryInner>
          <img src="" alt="" className="bg-white size-12 rounded-full object-cover" />
          <Footer.ContactHeading>Agency Contact Center</Footer.ContactHeading>
        </Footer.SecondaryInner>
      </Footer.Secondary>
    </Footer.Root>
  ),
})
