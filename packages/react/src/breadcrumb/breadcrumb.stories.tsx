import preview from '../../.storybook/preview'
import { Breadcrumb } from './breadcrumb'

const meta = preview.meta({
  title: 'Components/Breadcrumb',
  component: Breadcrumb.Root,
  argTypes: {
    wrap: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
})

const items = [
  { label: 'Home', href: '#' },
  { label: 'Federal Contracting', href: '#' },
  { label: 'Contracting assistance programs and other things', href: '#' },
  { label: 'Economically disadvantaged women-owned small business federal contracting program', href: '#' },
]

export const Basic = meta.story({
  args: {
    wrap: false,
  },
  render: ({ wrap }) => (
    <Breadcrumb.Root wrap={wrap}>
      <Breadcrumb.List>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Breadcrumb.Item key={index}>
              <Breadcrumb.Link href={item.href} isCurrent={last}>
                {item.label}
              </Breadcrumb.Link>
              {last ? null : <Breadcrumb.Separator />}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  ),
})

export const Wrapping = meta.story({
  args: {
    wrap: true,
  },
  render: ({ wrap }) => (
    <Breadcrumb.Root wrap={wrap}>
      <Breadcrumb.List>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Breadcrumb.Item key={index}>
              <Breadcrumb.Link href={item.href} isCurrent={last}>
                {item.label}
              </Breadcrumb.Link>
              {last ? null : <Breadcrumb.Separator />}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  ),
})
