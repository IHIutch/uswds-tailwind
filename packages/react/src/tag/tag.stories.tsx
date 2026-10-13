import preview from '../../.storybook/preview'
import { Tag } from './tag'

const meta = preview.meta({
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'vivid-orange', 'light-gray'],
      table: {
        defaultValue: {
          summary: 'default',
        },
      },
    },
    size: {
      control: 'select',
      options: ['md', 'lg'],
      table: {
        defaultValue: {
          summary: 'default',
        },
      },
    },
  },
})

export const Default = meta.story({
  args: {
    variant: 'default',
    size: 'md',
  },
  render: ({ size, variant }) => (
    <Tag size={size} variant={variant}>New</Tag>
  ),
})

export const VividOrange = meta.story({
  render: () => <Tag variant="vivid-orange">New</Tag>,
})

export const LightGray = meta.story({
  render: () => <Tag variant="light-gray">Topic</Tag>,
})

export const Large = meta.story({
  render: () => (
    <Tag size="lg">New</Tag>
  ),
})
