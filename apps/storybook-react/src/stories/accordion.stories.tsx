import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from '@uswds-tailwind/react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Accordion',
  component: Accordion.Root,
  parameters: {
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Accordion.Root>

export default meta
type Story = StoryObj<typeof meta>

const data = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircraft', content: 'Sample accordion content' },
]

export const Default: Story = {
  args: {
    multiple: false,
  },
  render: (args) => {
    return (
      <Accordion.Root multiple={args.multiple}>
        {data.map(item => (
          <Accordion.Item key={item.title} value={item.title}>
            <h3>
              <Accordion.Trigger>
                {item.title}
                <Accordion.ItemIndicator />
              </Accordion.Trigger>
            </h3>
            <Accordion.Content>
              <div className="leading-normal max-w-prose">{item.content}</div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    )
  },
}
