import { Identifier } from '@uswds-tailwind/react/identifier'
import { Link } from '@uswds-tailwind/react/link'

export default function IdentifierMultipleLogosDemo() {
  return (
    <Identifier.Root>
      <Identifier.Container>
        <Identifier.Masthead aria-label="Agency identifier">
          <Identifier.LogoGroup>
            <Identifier.Logo href="#" aria-label="Parent agency homepage">
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-gray-30 font-bold text-gray-90">A</span>
            </Identifier.Logo>
            <Identifier.Logo href="#" aria-label="Partner agency homepage">
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-gray-30 font-bold text-gray-90">B</span>
            </Identifier.Logo>
          </Identifier.LogoGroup>
          <Identifier.Identity aria-label="Agency description">
            <Identifier.Domain>domain.gov</Identifier.Domain>
            <Identifier.Disclaimer>
              An official website of the
              {' '}
              <Link href="#" variant="light">Parent Agency</Link>
              {' '}
              and the
              {' '}
              <Link href="#" variant="light">Partner Agency</Link>
            </Identifier.Disclaimer>
          </Identifier.Identity>
        </Identifier.Masthead>
        <Identifier.RequiredLinks aria-label="Important links">
          <Identifier.RequiredLinksList>
            <Identifier.LinkItem><Identifier.Link href="#">About Parent Agency</Identifier.Link></Identifier.LinkItem>
            <Identifier.LinkItem><Identifier.Link href="#">Accessibility statement</Identifier.Link></Identifier.LinkItem>
            <Identifier.LinkItem><Identifier.Link href="#">FOIA requests</Identifier.Link></Identifier.LinkItem>
            <Identifier.LinkItem><Identifier.Link href="#">No FEAR Act data</Identifier.Link></Identifier.LinkItem>
            <Identifier.LinkItem><Identifier.Link href="#">Office of the Inspector General</Identifier.Link></Identifier.LinkItem>
            <Identifier.LinkItem><Identifier.Link href="#">Performance reports</Identifier.Link></Identifier.LinkItem>
            <Identifier.LinkItem><Identifier.Link href="#">Privacy policy</Identifier.Link></Identifier.LinkItem>
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
