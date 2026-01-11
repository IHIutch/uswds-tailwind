import preview from '../../.storybook/preview'
import { Accordion } from './accordion'

const items = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircraft', content: 'Sample accordion content' },
]

const meta = preview.meta({
  title: 'Example/Accordion',
  component: Accordion.Root,
  // subcomponents: { ...Accordion },
  argTypes: {
    multiple: {
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
    multiple: false,
  },
  // render: args => <AccordionBasic {...args} />,
  render: ({ multiple }) => (
    <Accordion.Root multiple={multiple}>
      {items.map(item => (
        <Accordion.Item key={item.title} value={item.title}>
          <Accordion.Trigger>
            {item.title}
            <Accordion.ItemIndicator />
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="leading-normal max-w-prose">{item.content}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
})

export const Multiple = meta.story({
  args: {
    multiple: true,
  },
  render: ({ multiple }) => (
    <Accordion.Root multiple={multiple}>
      {items.map(item => (
        <Accordion.Item key={item.title} value={item.title}>
          <Accordion.Trigger>
            {item.title}
            <Accordion.ItemIndicator />
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="leading-normal max-w-prose">{item.content}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
})

export const CustomIcons = meta.story({
  args: {
    multiple: false,
  },
  render: ({ multiple }) => (
    <Accordion.Root multiple={multiple}>
      {items.map(item => (
        <Accordion.Item key={item.title} value={item.title}>
          <Accordion.Trigger>
            {item.title}
            <Accordion.ItemIndicator>
              {({ isOpen }) => (<div>{isOpen ? '-' : '+'}</div>)}
            </Accordion.ItemIndicator>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="leading-normal max-w-prose">{item.content}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
})
