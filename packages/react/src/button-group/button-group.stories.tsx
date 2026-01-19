import preview from '../../.storybook/preview'
import { ButtonGroup } from './button-group'

const meta = preview.meta({
  title: 'Components/Button Group',
  component: ButtonGroup.Root,
  argTypes: {
    segmented: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
})

export const Basic = meta.story({
  args: {
    segmented: false,
  },
  render: ({ segmented }) => (
    <ButtonGroup.Root segmented={segmented}>
      <ButtonGroup.Button variant="outline">Left</ButtonGroup.Button>
      <ButtonGroup.Button>Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  ),
})

export const Segmented = meta.story({
  render: () => (
    <ButtonGroup.Root segmented>
      <ButtonGroup.Button>Left</ButtonGroup.Button>
      <ButtonGroup.Button>Middle</ButtonGroup.Button>
      <ButtonGroup.Button>Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  ),
})

export const SegmentedRed = meta.story({
  render: () => (
    <ButtonGroup.Root segmented variant="red">
      <ButtonGroup.Button>Left</ButtonGroup.Button>
      <ButtonGroup.Button>Middle</ButtonGroup.Button>
      <ButtonGroup.Button>Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  ),
})

export const SegmentedOutline = meta.story({
  render: () => (
    <ButtonGroup.Root segmented variant="outline">
      <ButtonGroup.Button>Left</ButtonGroup.Button>
      <ButtonGroup.Button>Middle</ButtonGroup.Button>
      <ButtonGroup.Button>Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  ),
})
