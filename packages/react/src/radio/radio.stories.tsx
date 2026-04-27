import preview from '../../.storybook/preview'
import { Fieldset } from '../fieldset/fieldset'
import { RadioGroup } from './radio'

const items = [
  {
    label: 'Sojourner Truth',
    value: 'sojourner-truth',
    description: 'This is optional text that can be used to describe the label in more detail.',
  },
  {
    label: 'Frederick Douglass',
    value: 'frederick-douglass',
  },
  {
    label: 'Booker T. Washington',
    value: 'booker-t-washington',
  },
  {
    label: 'George Washington Carver',
    value: 'george-washington-carver',
    isDisabled: true,
  },
]

const meta = preview.meta({
  title: 'Components/Radio',
  component: RadioGroup.Root,
  argTypes: {
    tile: {
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
    tile: false,
  },
  render: ({ tile }) => (
    <Fieldset.Root className="max-w-xs">
      <Fieldset.Legend>Select any historical figure</Fieldset.Legend>
      <RadioGroup.Root tile={tile}>
        {items.map(item => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemInput disabled={item.isDisabled} />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>
              {item.label}
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Fieldset.Root>
  ),
})

export const Tile = meta.story({
  render: () => (
    <Fieldset.Root className="max-w-xs">
      <Fieldset.Legend>Select any historical figure</Fieldset.Legend>
      <RadioGroup.Root tile>
        {items.map(item => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemInput disabled={item.isDisabled} />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>
              {item.label}
              {item.description
                ? (
                    <RadioGroup.ItemDescription>
                      {item.description}
                    </RadioGroup.ItemDescription>
                  )
                : null}
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Fieldset.Root>
  ),
})
