import preview from '../../.storybook/preview'
import { Nav } from '../nav'
import { Header } from './header'

const meta = preview.meta({
  title: 'Components/Header',
  component: Header.Root,
})

export const Default = meta.story({
  render: () => (
    <Header.Root>
      <Header.Container>
        <Header.Branding>
          <em className="font-bold not-italic">
            <a className="text-gray-90 focus:outline-4 focus:outline-blue-40v" href="/">Project Title</a>
          </em>
        </Header.Branding>

        <Nav.Root>
          <Nav.Trigger>Menu</Nav.Trigger>
          <Nav.Backdrop />
          <Nav.Positioner>
            <Nav.Content>
              <Nav.CloseTrigger />
              <Nav.List>
                <Nav.ListItem>
                  <Nav.Dropdown>
                    <Nav.DropdownTrigger isCurrent>
                      Dropdown
                      <Nav.DropdownIndicator />
                    </Nav.DropdownTrigger>
                    <Nav.DropdownContent>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Sub-link one</Nav.DropdownLink>
                      </Nav.DropdownItem>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Sub-link two</Nav.DropdownLink>
                      </Nav.DropdownItem>
                    </Nav.DropdownContent>
                  </Nav.Dropdown>
                </Nav.ListItem>
                <Nav.ListItem>
                  <Nav.Dropdown>
                    <Nav.DropdownTrigger>
                      Dropdown
                      <Nav.DropdownIndicator />
                    </Nav.DropdownTrigger>
                    <Nav.DropdownContent>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Sub-link one</Nav.DropdownLink>
                      </Nav.DropdownItem>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Sub-link two</Nav.DropdownLink>
                      </Nav.DropdownItem>
                    </Nav.DropdownContent>
                  </Nav.Dropdown>
                </Nav.ListItem>
                <Nav.ListItem>
                  <Nav.Link href="#">Link</Nav.Link>
                </Nav.ListItem>
              </Nav.List>
            </Nav.Content>
          </Nav.Positioner>
        </Nav.Root>
      </Header.Container>
    </Header.Root>
  ),
})
