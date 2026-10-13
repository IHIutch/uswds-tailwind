import { Nav } from '@uswds-tailwind/react/nav'

export default function NavDemo() {
  return (
    <Nav.Root className="@container min-h-16">
      <Nav.Trigger type="button">Menu</Nav.Trigger>
      <Nav.Backdrop />
      <Nav.Positioner>
        <Nav.Content aria-label="Primary navigation">
          <Nav.CloseTrigger />
          <Nav.List>
            <Nav.ListItem><Nav.Link href="#services">Services</Nav.Link></Nav.ListItem>
            <Nav.ListItem>
              <Nav.Dropdown>
                <Nav.DropdownTrigger type="button">About <Nav.DropdownIndicator /></Nav.DropdownTrigger>
                <Nav.DropdownContent>
                  <Nav.DropdownItem value="mission"><Nav.DropdownLink href="#mission">Our mission</Nav.DropdownLink></Nav.DropdownItem>
                  <Nav.DropdownItem value="team"><Nav.DropdownLink href="#team">Our team</Nav.DropdownLink></Nav.DropdownItem>
                </Nav.DropdownContent>
              </Nav.Dropdown>
            </Nav.ListItem>
          </Nav.List>
        </Nav.Content>
      </Nav.Positioner>
    </Nav.Root>
  )
}
