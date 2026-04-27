import preview from '../../.storybook/preview'
import { Input } from '../input/input'
import { Field } from './field'

const meta = preview.meta({
  title: 'Components/Field',
  component: Field.Root,
})

export const Default = meta.story({
  argTypes: {
    invalid: {
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
  args: {
    invalid: false,
    disabled: false,
  },
  render: ({ invalid, disabled }) => (
    <Field.Root invalid={invalid} disabled={disabled}>
      <Field.Label>Input label</Field.Label>
      <Input type="text" />
    </Field.Root>
  ),
})

export const WithDescription = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>Input label</Field.Label>
      <Field.Description>This is a helpful description.</Field.Description>
      <Input type="text" />
    </Field.Root>
  ),
})

export const WithError = meta.story({
  render: () => (
    <Field.Root invalid>
      <Field.Label>Input label</Field.Label>
      <Field.ErrorMessage>This field is required.</Field.ErrorMessage>
      <Input type="text" />
    </Field.Root>
  ),
})

export const Required = meta.story({
  render: () => (
    <Field.Root required>
      <Field.Label>Input label</Field.Label>
      <Input type="text" />
    </Field.Root>
  ),
})

export const Disabled = meta.story({
  render: () => (
    <Field.Root disabled>
      <Field.Label>Input label</Field.Label>
      <Input type="text" />
    </Field.Root>
  ),
})
