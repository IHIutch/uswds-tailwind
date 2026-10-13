import { Header, Nav, Search } from '@uswds-tailwind/react'

export default function HeaderExtendedDemo() {
  return (
    <Header.Root variant="extended">
      <Nav.Root>
        <Header.Primary>
          <Header.Container>
            <Header.Branding size="lg">
              <em className="font-bold not-italic">
                <a className="text-gray-90 focus:outline-4 focus:outline-blue-40v" href="/">Project Title</a>
              </em>
            </Header.Branding>
            <Nav.Trigger>Menu</Nav.Trigger>
          </Header.Container>
        </Header.Primary>
        <Header.Extended>
          <Nav.Backdrop />
          <Nav.Positioner>
            <Nav.Content>
              <Nav.CloseTrigger />
              <Nav.List>
                <Nav.ListItem>
                  <Nav.Dropdown>
                    <Nav.DropdownTrigger isCurrent>Current section <Nav.DropdownIndicator /></Nav.DropdownTrigger>
                    <Nav.DropdownContent>
                      <Nav.DropdownItem value="current-one"><Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink></Nav.DropdownItem>
                      <Nav.DropdownItem value="current-two"><Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink></Nav.DropdownItem>
                    </Nav.DropdownContent>
                  </Nav.Dropdown>
                </Nav.ListItem>
                <Nav.ListItem>
                  <Nav.Dropdown>
                    <Nav.DropdownTrigger>Section <Nav.DropdownIndicator /></Nav.DropdownTrigger>
                    <Nav.DropdownContent>
                      <Nav.DropdownItem value="section-one"><Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink></Nav.DropdownItem>
                      <Nav.DropdownItem value="section-two"><Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink></Nav.DropdownItem>
                    </Nav.DropdownContent>
                  </Nav.Dropdown>
                </Nav.ListItem>
                <Nav.ListItem><Nav.Link href="#">Simple link</Nav.Link></Nav.ListItem>
              </Nav.List>
              <Header.SecondaryNav>
                <Header.SecondaryList>
                  <Header.SecondaryItem><Header.SecondaryLink href="#">Secondary link</Header.SecondaryLink></Header.SecondaryItem>
                  <Header.SecondaryItem><Header.SecondaryLink href="#">Another secondary link</Header.SecondaryLink></Header.SecondaryItem>
                </Header.SecondaryList>
                <section aria-label="Site search">
                  <form role="search" className="w-full @desktop:max-w-64">
                    <Search.Root size="sm">
                      <Search.Label>Search</Search.Label>
                      <Search.Input />
                      <Search.Button />
                    </Search.Root>
                  </form>
                </section>
              </Header.SecondaryNav>
            </Nav.Content>
          </Nav.Positioner>
        </Header.Extended>
      </Nav.Root>
    </Header.Root>
  )
}
