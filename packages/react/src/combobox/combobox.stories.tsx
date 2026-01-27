import preview from '../../.storybook/preview'
import { Combobox } from './combobox'

const options = [
  { value: 'watercraft', label: 'Watercraft' },
  { value: 'automobiles', label: 'Automobiles' },
  { value: 'aircraft', label: 'Aircraft' },
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
    <Combobox.Root options={options}>
      <Combobox.Label>Choose an option</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearButton />
          <Combobox.ToggleButton />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.List>
        {({ options }) => (
          <>
            {options.map((option, index) => (
              <Combobox.Item
                key={option.value}
                index={index}
                {...option}
              >
                {option.label}
              </Combobox.Item>
            ))}
            <Combobox.EmptyItem />
          </>
        )}
      </Combobox.List>
    </Combobox.Root>
  ),
})
