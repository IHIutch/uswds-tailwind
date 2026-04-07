import preview from '../../.storybook/preview'
import { Header } from './header'

const meta = preview.meta({
  title: 'Components/Header',
  component: Header.Root,
})

export const Default = meta.story({
  render: () => (
    <Header.Root>
      <Header.Container>
        <div className="max-w-5xl mx-auto flex justify-between items-end pb-1">
          <Header.Branding>
            <em className="font-bold not-italic">
              <a className="text-gray-90 focus:outline-4 focus:outline-blue-40v" href="/">Project Title</a>
            </em>
          </Header.Branding>
          <Header.MenuTrigger />

          <Header.Backdrop />
          <Header.NavPositioner>
            <Header.NavContent>
              <Header.NavClose />
              <Header.NavList>
                <Header.NavListItem>
                  <Header.NavMenu>
                    <Header.NavMenuTrigger isCurrent>
                      Dropdown
                      <Header.NavMenuIndicator />
                    </Header.NavMenuTrigger>
                    <Header.NavMenuContent>
                      <Header.NavMenuItem>
                        <Header.NavMenuLink href="#">Sub-link one</Header.NavMenuLink>
                      </Header.NavMenuItem>
                      <Header.NavMenuItem>
                        <Header.NavMenuLink href="#">Sub-link two</Header.NavMenuLink>
                      </Header.NavMenuItem>
                    </Header.NavMenuContent>
                  </Header.NavMenu>
                </Header.NavListItem>
                <Header.NavListItem>
                  <Header.NavMenu>
                    <Header.NavMenuTrigger>
                      Dropdown
                      <Header.NavMenuIndicator />
                    </Header.NavMenuTrigger>
                    <Header.NavMenuContent>
                      <Header.NavMenuItem>
                        <Header.NavMenuLink href="#">Sub-link one</Header.NavMenuLink>
                      </Header.NavMenuItem>
                      <Header.NavMenuItem>
                        <Header.NavMenuLink href="#">Sub-link two</Header.NavMenuLink>
                      </Header.NavMenuItem>
                    </Header.NavMenuContent>
                  </Header.NavMenu>
                </Header.NavListItem>
                <Header.NavListItem>
                  <Header.NavLink href="#">Link</Header.NavLink>
                </Header.NavListItem>
              </Header.NavList>
            </Header.NavContent>
          </Header.NavPositioner>
        </div>
      </Header.Container>
    </Header.Root>
  ),
})
