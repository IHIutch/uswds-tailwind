import preview from '../../.storybook/preview'
import { Link } from '../link'
import { Identifier } from './identifier'

const meta = preview.meta({
  title: 'Components/Identifier',
  component: Identifier.Root,
})

const requiredLinks = [
  { label: 'About Your Agency', href: '#' },
  { label: 'Accessibility statement', href: '#' },
  { label: 'FOIA requests', href: '#' },
  { label: 'No FEAR Act data', href: '#' },
  { label: 'Office of the Inspector General', href: '#' },
  { label: 'Performance reports', href: '#' },
  { label: 'Privacy policy', href: '#' },
]

export const Default = meta.story({
  render: () => (
    <Identifier.Root>
      <Identifier.Container>
        <Identifier.Masthead aria-label="Agency identifier">
          <Identifier.LogoGroup>
            <Identifier.Logo href="#">
              <img
                src=""
                alt="Agency name"
                className="size-12 bg-gray-30 object-cover"
              />
            </Identifier.Logo>
            <Identifier.Logo href="#">
              <img
                src=""
                alt="Agency name"
                className="size-12 bg-gray-30 object-cover"
              />
            </Identifier.Logo>
          </Identifier.LogoGroup>
          <Identifier.Identity aria-label="Agency description">
            <Identifier.Domain>domain.gov</Identifier.Domain>
            <Identifier.Disclaimer>
              An official website of the
              {' '}
              <Link
                href="#"
                className="text-gray-cool-10 hover:text-gray-5 focus:outline-4 focus:outline-blue-40v underline"
              >
                Your Agency
              </Link>
            </Identifier.Disclaimer>
          </Identifier.Identity>
        </Identifier.Masthead>
        <Identifier.RequiredLinks aria-label="Important links">
          <Identifier.RequiredLinksList>
            {requiredLinks.map(link => (
              <Identifier.LinkItem key={link.label}>
                <Identifier.Link href={link.href}>{link.label}</Identifier.Link>
              </Identifier.LinkItem>
            ))}
          </Identifier.RequiredLinksList>
        </Identifier.RequiredLinks>
        <Identifier.Tagline aria-label="U.S. government information and services">
          <p>
            Looking for U.S. government information and services?
            {' '}

            <Link
              isExternal
              href="https://www.usa.gov/"
              className="text-gray-cool-10 hover:text-gray-5 focus:outline-4 focus:outline-blue-40v underline after:icon-[material-symbols--open-in-new] after:size-4 after:align-middle after:ml-px font-bold block @desktop:inline"
            >
              Visit USA.gov
            </Link>
          </p>
        </Identifier.Tagline>
      </Identifier.Container>
    </Identifier.Root>
  ),
})
