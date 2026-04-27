import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { Input, Textarea } from './input'

const meta = preview.meta({
  title: 'Components/Input',
  component: () => <Input />,
})

export const BasicInput = meta.story({
  render: () => (
    <Input />
  ),
})

export const ValidInput = meta.story({
  render: () => (
    <Input data-valid />
  ),
})

export const InvalidInput = meta.story({
  render: () => (
    <Input data-invalid />
  ),
})

export const InputWithLabel = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>
        Input Label
      </Field.Label>
      <Input />
    </Field.Root>
  ),
})

export const BasicTextarea = meta.story({
  render: () => (
    <Textarea />
  ),
})

export const ValidTextarea = meta.story({
  render: () => (
    <Textarea data-valid />
  ),
})

export const InvalidTextarea = meta.story({
  render: () => (
    <Textarea data-invalid />
  ),
})
