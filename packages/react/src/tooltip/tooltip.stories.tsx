import preview from '../../.storybook/preview'
import { Button } from '../button'
import { Tooltip } from './tooltip'

const meta = preview.meta({
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      table: {
        defaultValue: {
          summary: 'top',
        },
      },
    },
    content: {
      control: 'text',
      defaultValue: '',
    },
  },
})

export const Basic = meta.story({
  args: {
    position: 'top',
    content: 'This is a tooltip',
  },
  render: ({ content, position }) => (
    <Tooltip content={content} position={position}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
})

export const Placements = meta.story({
  render: () => (
    <div className="flex gap-4 flex-wrap justify-center py-12">
      <Tooltip content="Top tooltip" position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
})
