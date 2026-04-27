import type { SideNavigationItem } from './side-navigation'
import preview from '../../.storybook/preview'
import { SideNavigation } from './side-navigation'

const meta = preview.meta({
  title: 'Components/Side Navigation',
  component: SideNavigation.Root,
})

export const Default = meta.story({
  render: () => {
    const items: SideNavigationItem[] = [
      { label: 'Parent link', href: '#' },
      { label: 'Current page', href: '#', isCurrent: true },
      { label: 'Parent link', href: '#' },
      { label: 'Parent link', href: '#' },
    ]

    return (
      <SideNavigation.Root>
        <SideNavigation.List>
          {items.map(item => (
            <SideNavigation.ListItem>
              <SideNavigation.Link href={item.href} isCurrent={item.isCurrent}>
                {item.label}
              </SideNavigation.Link>
            </SideNavigation.ListItem>
          ))}
        </SideNavigation.List>
      </SideNavigation.Root>
    )
  },
})

export const Nested = meta.story({
  render: () => {
    const items: SideNavigationItem[] = [
      { label: 'Parent link', href: '#' },
      {
        label: 'Current page',
        href: '#',
        items: [
          { label: 'Child link', href: '#' },
          { label: 'Child link', href: '#' },
          { label: 'Child link', href: '#', isCurrent: true },
        ],
      },
      { label: 'Parent link', href: '#' },
    ]

    return (
      <SideNavigation.Root>
        <SideNavigation.List>
          {items.map(item => (
            <SideNavigation.ListItem>
              <SideNavigation.Link href={item.href}>
                {item.label}
              </SideNavigation.Link>
              {item.items
                ? (
                    <SideNavigation.List>
                      {item.items.map(child => (
                        <SideNavigation.ListItem>
                          <SideNavigation.Link href={child.href} isCurrent={child.isCurrent}>
                            {child.label}
                          </SideNavigation.Link>
                        </SideNavigation.ListItem>
                      ))}
                    </SideNavigation.List>
                  )
                : null}
            </SideNavigation.ListItem>
          ))}
        </SideNavigation.List>
      </SideNavigation.Root>
    )
  },
})

export const DeeplyNested = meta.story({
  render: () => {
    const items: SideNavigationItem[] = [
      { label: 'Parent link', href: '#' },
      {
        label: 'Current page',
        href: '#',
        items: [
          {
            label: 'Child link',
            href: '#',
            items: [
              { label: 'Grandchild link', href: '#' },
              { label: 'Grandchild link', href: '#', isCurrent: true },
            ],
          },
          { label: 'Child link', href: '#' },
        ],
      },
      { label: 'Parent link', href: '#' },
    ]

    return (
      <SideNavigation.Root>
        <SideNavigation.Items items={items} />
      </SideNavigation.Root>
    )
  },
})
