import preview from '../../.storybook/preview'
import { Button } from './button'

const meta = preview.meta({
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['blue', 'red', 'cyan', 'orange', 'gray', 'outline', 'inverse'],
      table: {
        defaultValue: {
          summary: 'blue',
        },
      },
    },
    size: {
      control: 'radio',
      options: ['md', 'lg'],
      table: {
        defaultValue: {
          summary: 'md',
        },
      },
    },
    unstyled: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    disabled: {
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
    variant: 'blue',
    size: 'md',
    unstyled: false,
    disabled: false,
  },
  render: ({ variant, size, unstyled, disabled }) => (
    <Button variant={variant} size={size} unstyled={unstyled} disabled={disabled}>Click Me</Button>
  ),
})

export const Red = meta.story({
  render: () => (
    <Button variant="red">Click Me</Button>
  ),
})

export const Cyan = meta.story({
  render: () => (
    <Button variant="cyan">Click Me</Button>
  ),
})

export const Orange = meta.story({
  render: () => (
    <Button variant="orange">Click Me</Button>
  ),
})

export const Gray = meta.story({
  render: () => (
    <Button variant="gray">Click Me</Button>
  ),
})

export const Outline = meta.story({
  render: () => (
    <Button variant="outline">Click Me</Button>
  ),
})

export const Inverse = meta.story({
  render: () => (
    <div className="bg-gray-90 p-4">
      <Button variant="inverse">Click Me</Button>
    </div>
  ),
})

export const Unstyled = meta.story({
  render: () => (
    <Button unstyled>Click Me</Button>
  ),
})

export const UnstyledInverse = meta.story({
  render: () => (
    <div className="bg-gray-90 p-4">
      <Button variant="inverse" unstyled>Click Me</Button>
    </div>
  ),
})

export const Disabled = meta.story({
  render: () => (
    <Button disabled>Click Me</Button>
  ),
})
