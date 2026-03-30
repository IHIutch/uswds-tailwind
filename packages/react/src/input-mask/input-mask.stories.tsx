import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { InputMask } from './input-mask'

const meta = preview.meta({
  title: 'Components/Input Mask',
  component: InputMask.Root,
})

export const SSN = meta.story({
  render: () => (
    <Field.Root>
      <InputMask.Root
        pattern="^(?!(000|666|9))\d{3} (?!00)\d{2} (?!0000)\d{4}$"
        placeholder="___ __ ____"
      >
        <InputMask.Label>Social Security Number</InputMask.Label>
        <Field.Description>For example, 123 45 6789</Field.Description>
        <InputMask.Control>
          <InputMask.Placeholder />
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>
  ),
})

export const Phone = meta.story({
  render: () => (
    <Field.Root>
      <InputMask.Root
        pattern="\d{3}-\d{3}-\d{4}"
        placeholder="___-___-____"
      >
        <InputMask.Label>US Telephone Number</InputMask.Label>
        <Field.Description>For example, 123-456-7890</Field.Description>
        <InputMask.Control>
          <InputMask.Placeholder />
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>
  ),
})

export const ZIP = meta.story({
  render: () => (
    <Field.Root>
      <InputMask.Root
        pattern="^[0-9]{5}(?:-[0-9]{4})?$"
        placeholder="_____-____"
      >
        <InputMask.Label>ZIP Code</InputMask.Label>
        <Field.Description>For example, 12345-6789</Field.Description>
        <InputMask.Control>
          <InputMask.Placeholder />
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>
  ),
})

export const Alphanumeric = meta.story({
  render: () => (
    <Field.Root>
      <InputMask.Root
        pattern="\w\d\w \d\w\d"
        placeholder="___ ___"
        charset="A#A #A#"
      >
        <InputMask.Label>Alphanumeric</InputMask.Label>
        <Field.Description>For example, A1B 2C3</Field.Description>
        <InputMask.Control>
          <InputMask.Placeholder />
          <InputMask.Input />
        </InputMask.Control>
      </InputMask.Root>
    </Field.Root>
  ),
})
