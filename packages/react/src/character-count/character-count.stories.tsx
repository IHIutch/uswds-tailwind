import preview from '../../.storybook/preview'
import { Field } from '../field'
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
  render: ({ maxLength }) => (
    <CharacterCount.Root maxLength={maxLength}>
      <Field.Root>
        <Field.Label>Character Count</Field.Label>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
      <CharacterCount.SrStatus />
    </CharacterCount.Root>
  ),
})

export const WithField = meta.story({
  args: {
    maxLength: 20,
  },
  render: ({ maxLength }) => (
    <CharacterCount.Root maxLength={maxLength}>
      <Field.Root>
        <Field.Label>Character Count</Field.Label>
        <Field.Description>This is an input with a character counter</Field.Description>
        <CharacterCount.Input />
      </Field.Root>
      <CharacterCount.Status />
      <CharacterCount.SrStatus />
    </CharacterCount.Root>
  ),
})
