import preview from '../../.storybook/preview'
import { CharacterCount } from './character-count'

const meta = preview.meta({
  title: 'Components/Character Count',
  component: CharacterCount.Root,
  // subcomponents: { ...CharacterCount },
  argTypes: {
    maxLength: {
      control: 'number',
      table: {
        defaultValue: {
          summary: undefined,
        },
      },
    },
  },
})

export const Basic = meta.story({
  args: {
    maxLength: 20,
  },
  // render: args => <AccordionBasic {...args} />,
  render: ({ maxLength }) => (
    <CharacterCount.Root maxLength={maxLength}>
      <div>{maxLength}</div>
      <CharacterCount.Label>Character Count</CharacterCount.Label>
      <CharacterCount.Input className="mt-2" />
      <div className="mt-2">
        <CharacterCount.Status />
      </div>
    </CharacterCount.Root>
  ),
})
