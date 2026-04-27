import preview from '../../.storybook/preview'
import { Fieldset } from '../fieldset/fieldset'
import { Checkbox } from './checkbox'

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
  title: 'Components/Checkbox',
  component: Checkbox.Root,
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
      <Checkbox.Group>
        {items.map(item => (
          <Checkbox.Root key={item.value} tile={tile}>
            <Checkbox.Input value={item.value} disabled={item.isDisabled} />
            <Checkbox.Control />
            <Checkbox.Label>
              {item.label}
            </Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
    </Fieldset.Root>
  ),
})

export const Tile = meta.story({
  render: () => (
    <Fieldset.Root className="max-w-xs">
      <Fieldset.Legend>Select any historical figure</Fieldset.Legend>
      <Checkbox.Group>
        {items.map(item => (
          <Checkbox.Root key={item.value} tile>
            <Checkbox.Input value={item.value} disabled={item.isDisabled} />
            <Checkbox.Control />
            <Checkbox.Label>
              {item.label}
              {item.description
                ? (
                    <Checkbox.Description>
                      {item.description}
                    </Checkbox.Description>
                  )
                : null}
            </Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
    </Fieldset.Root>
  ),
})
