import { Header, Nav } from '@uswds-tailwind/react'

export default function HeaderDemo() {
  return (
    <Header.Root>
      <Nav.Root>
        <Header.Primary>
          <Header.Container>
            <Header.Branding>
              <em className="font-bold not-italic">
                <a className="text-gray-90 focus:outline-4 focus:outline-blue-40v" href="/">Project Title</a>
              </em>
            </Header.Branding>
            <Nav.Trigger>Menu</Nav.Trigger>
            <Nav.Backdrop />
            <Nav.Positioner>
              <Nav.Content>
                <Nav.CloseTrigger />
                <Nav.List>
                  <Nav.ListItem>
                    <Nav.Dropdown>
                      <Nav.DropdownTrigger isCurrent>
                        Section one <Nav.DropdownIndicator />
                      </Nav.DropdownTrigger>
                      <Nav.DropdownContent>
                        <Nav.DropdownItem value="one-a"><Nav.DropdownLink href="#">Sub-link one</Nav.DropdownLink></Nav.DropdownItem>
                        <Nav.DropdownItem value="one-b"><Nav.DropdownLink href="#">Sub-link two</Nav.DropdownLink></Nav.DropdownItem>
                      </Nav.DropdownContent>
                    </Nav.Dropdown>
                  </Nav.ListItem>
                  <Nav.ListItem>
                    <Nav.Dropdown>
                      <Nav.DropdownTrigger>Section two <Nav.DropdownIndicator /></Nav.DropdownTrigger>
                      <Nav.DropdownContent>
                        <Nav.DropdownItem value="two-a"><Nav.DropdownLink href="#">Sub-link one</Nav.DropdownLink></Nav.DropdownItem>
                        <Nav.DropdownItem value="two-b"><Nav.DropdownLink href="#">Sub-link two</Nav.DropdownLink></Nav.DropdownItem>
                      </Nav.DropdownContent>
                    </Nav.Dropdown>
                  </Nav.ListItem>
                  <Nav.ListItem><Nav.Link href="#">Link</Nav.Link></Nav.ListItem>
                </Nav.List>
              </Nav.Content>
            </Nav.Positioner>
          </Header.Container>
        </Header.Primary>
      </Nav.Root>
    </Header.Root>
  )
}
