import preview from '../../.storybook/preview'
import { Link } from '../link'
import { Identifier } from './identifier'

const meta = preview.meta({
  title: 'Components/Identifier',
  component: Identifier.Root,
})

const requiredLinks = [
  { label: 'About Parent Agency', href: '#' },
  { label: 'Accessibility statement', href: '#' },
  { label: 'FOIA requests', href: '#' },
  { label: 'No FEAR Act data', href: '#' },
  { label: 'Office of the Inspector General', href: '#' },
  { label: 'Performance reports', href: '#' },
  { label: 'Privacy policy', href: '#' },
]

function IdentifierExample({ logoCount }: { logoCount: 0 | 1 | 2 }) {
  return (
    <Identifier.Root>
      <Identifier.Container>
        <Identifier.Masthead aria-label="Agency identifier">
          {logoCount > 0 && (
            <Identifier.LogoGroup>
              <Identifier.Logo href="#" aria-label="Parent agency homepage">
                <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-gray-30 font-bold text-gray-90">A</span>
              </Identifier.Logo>
              {logoCount === 2 && (
                <Identifier.Logo href="#" aria-label="Partner agency homepage">
                  <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-gray-30 font-bold text-gray-90">B</span>
                </Identifier.Logo>
              )}
            </Identifier.LogoGroup>
          )}
          <Identifier.Identity aria-label="Agency description">
            <Identifier.Domain>domain.gov</Identifier.Domain>
            <Identifier.Disclaimer>
              An official website of the
              {' '}
              <Link href="#" variant="light">Parent Agency</Link>
              {logoCount === 2 && (
                <>
                  {' '}
                  and the
                  {' '}
                  <Link href="#" variant="light">Partner Agency</Link>
                </>
              )}
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
            <Link href="https://www.usa.gov/" variant="light" isExternal className="font-bold block @desktop:inline">Visit USA.gov</Link>
          </p>
        </Identifier.Tagline>
      </Identifier.Container>
    </Identifier.Root>
  )
}

export const Default = meta.story({ render: () => <IdentifierExample logoCount={1} /> })
export const MultipleParentsAndLogos = meta.story({ render: () => <IdentifierExample logoCount={2} /> })
export const NoLogos = meta.story({ render: () => <IdentifierExample logoCount={0} /> })
