import preview from '../../.storybook/preview'
import { Breadcrumb } from './breadcrumb'

const meta = preview.meta({
  title: 'Components/Breadcrumb',
  component: Breadcrumb.Root,
  argTypes: {
    'wrap': {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    'aria-label': {
      control: 'text',
      table: {
        defaultValue: {
          summary: 'Breadcrumb',
        },
      },
    },
  },
})

const items = [
  { label: 'Home', href: '#' },
  { label: 'Federal Contracting', href: '#' },
  { label: 'Contracting assistance programs', href: '#' },
  { label: 'Economically disadvantaged women-owned small business federal contracting program', href: '#' },
]

export const Basic = meta.story({
  args: {
    'wrap': false,
    'aria-label': 'Breadcrumb',
  },
  render: ({ wrap, 'aria-label': ariaLabel }) => (
    <Breadcrumb.Root wrap={wrap} aria-label={ariaLabel}>
      <Breadcrumb.Previous />
      <Breadcrumb.List>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Breadcrumb.Item key={index} isCurrent={last}>
              <Breadcrumb.Link href={item.href}>
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
    'wrap': true,
    'aria-label': 'Wrapping Breadcrumb',
  },
  render: ({ wrap, 'aria-label': ariaLabel }) => (
    <Breadcrumb.Root wrap={wrap} aria-label={ariaLabel}>
      <Breadcrumb.Previous />
      <Breadcrumb.List>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Breadcrumb.Item key={index} isCurrent={last}>
              <Breadcrumb.Link href={item.href}>
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
