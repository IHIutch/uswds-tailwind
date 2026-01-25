import preview from '../../.storybook/preview'
import { Combobox } from './combobox'

const items = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircraft', content: 'Sample accordion content' },
]

const meta = preview.meta({
  title: 'Components/Combobox',
  component: Combobox.Root,
  argTypes: {},
})

export const Basic = meta.story({
  args: {
  },
  render: () => (
    <Combobox.Root options={items.map(i => ({ value: i.title, label: i.title }))}>
      <Combobox.Label>Choose an option</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearButton />
          <Combobox.ToggleButton />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.List>
        {items.map((item, index) => (
          <Combobox.Item
            key={item.title}
            index={index}
            value={item.title}
            label={item.title}
          >
            {item.title}
          </Combobox.Item>
        ))}
      </Combobox.List>
    </Combobox.Root>
  ),
})
