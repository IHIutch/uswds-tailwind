import preview from '../../.storybook/preview'
import { Tag } from './tag'

const meta = preview.meta({
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
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
    size: 'md',
  },
  render: ({ size }) => (
    <Tag size={size}>New</Tag>
  ),
})

export const Large = meta.story({
  render: () => (
    <Tag size="lg">New</Tag>
  ),
})

export const Multiple = meta.story({
  render: () => (
    <div className="flex gap-2">
      <Tag>New</Tag>
      <Tag>Pending</Tag>
      <Tag>Active</Tag>
    </div>
  ),
})
