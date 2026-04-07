import preview from '../../.storybook/preview'
import { Field } from '../field'
import { Nav } from '../nav'
import { Search } from '../search'
import { Header } from './header'

const meta = preview.meta({
  title: 'Components/Header',
  component: Header.Root,
})

export const Default = meta.story({
  render: () => (
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
          </Header.Container>
        </Header.Primary>
      </Nav.Root>
    </Header.Root>
  ),
})

export const Extended = meta.story({
  render: () => (
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
                    <Nav.DropdownTrigger isCurrent>
                      Current section
                      <Nav.DropdownIndicator />
                    </Nav.DropdownTrigger>
                    <Nav.DropdownContent>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink>
                      </Nav.DropdownItem>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink>
                      </Nav.DropdownItem>
                    </Nav.DropdownContent>
                  </Nav.Dropdown>
                </Nav.ListItem>
                <Nav.ListItem>
                  <Nav.Dropdown>
                    <Nav.DropdownTrigger>
                      Section
                      <Nav.DropdownIndicator />
                    </Nav.DropdownTrigger>
                    <Nav.DropdownContent>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink>
                      </Nav.DropdownItem>
                      <Nav.DropdownItem>
                        <Nav.DropdownLink href="#">Navigation link</Nav.DropdownLink>
                      </Nav.DropdownItem>
                    </Nav.DropdownContent>
                  </Nav.Dropdown>
                </Nav.ListItem>
                <Nav.ListItem>
                  <Nav.Link href="#">Simple link</Nav.Link>
                </Nav.ListItem>
              </Nav.List>
              <Header.SecondaryNav>
                <Header.SecondaryList>
                  <Header.SecondaryItem>
                    <Header.SecondaryLink href="#">Secondary link</Header.SecondaryLink>
                  </Header.SecondaryItem>
                  <Header.SecondaryItem>
                    <Header.SecondaryLink href="#">Another secondary link</Header.SecondaryLink>
                  </Header.SecondaryItem>
                </Header.SecondaryList>
                {/* Custom Children */}
                <section aria-label="search component">
                  <form role="search" className="w-full @desktop:max-w-64">
                    <Field.Root>
                      <Search.Root size="sm">
                        <Search.Label>Search</Search.Label>
                        <Search.Input />
                        <Search.Button />
                      </Search.Root>
                    </Field.Root>
                  </form>
                </section>
              </Header.SecondaryNav>
            </Nav.Content>
          </Nav.Positioner>
        </Header.Extended>
      </Nav.Root>
    </Header.Root>
  ),
})
