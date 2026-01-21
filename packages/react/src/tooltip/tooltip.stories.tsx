import preview from '../../.storybook/preview'
import { Button } from '../button'
import { Tooltip } from './tooltip'

const meta = preview.meta({
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: {
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
    placement: 'top',
    content: 'This is a tooltip',
  },
  render: ({ content, placement }) => (
    <Tooltip content={content} placement={placement}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
})

export const Placements = meta.story({
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Tooltip content="Top tooltip" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
})
