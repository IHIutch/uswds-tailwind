import preview from '../../.storybook/preview'
import { InputMask } from './input-mask'

const meta = preview.meta({
  tags: ['new'],
  title: 'Components/Input Mask',
  component: InputMask.Root,
})

export const SSN = meta.story({
  render: () => (
    <InputMask.Root
      pattern="^(?!(000|666|9))\d{3} (?!00)\d{2} (?!0000)\d{4}$"
      placeholder="___ __ ____"
    >
      <InputMask.Label>Social Security Number</InputMask.Label>
      <InputMask.Description>For example, 123 45 6789</InputMask.Description>
      <InputMask.Control>
        <InputMask.Placeholder />
        <InputMask.Input />
      </InputMask.Control>
    </InputMask.Root>
  ),
})

export const Phone = meta.story({
  render: () => (
    <InputMask.Root
      pattern="\d{3}-\d{3}-\d{4}"
      placeholder="___-___-____"
    >
      <InputMask.Label>US Telephone Number</InputMask.Label>
      <InputMask.Description>For example, 123-456-7890</InputMask.Description>
      <InputMask.Control>
        <InputMask.Placeholder />
        <InputMask.Input />
      </InputMask.Control>
    </InputMask.Root>
  ),
})

export const ZIP = meta.story({
  render: () => (
    <InputMask.Root
      pattern="^[0-9]{5}(?:-[0-9]{4})?$"
      placeholder="_____-____"
    >
      <InputMask.Label>ZIP Code</InputMask.Label>
      <InputMask.Description>For example, 12345-6789</InputMask.Description>
      <InputMask.Control>
        <InputMask.Placeholder />
        <InputMask.Input />
      </InputMask.Control>
    </InputMask.Root>
  ),
})

export const Alphanumeric = meta.story({
  render: () => (
    <InputMask.Root
      pattern="\w\d\w \d\w\d"
      placeholder="___ ___"
      charset="A#A #A#"
    >
      <InputMask.Label>Alphanumeric</InputMask.Label>
      <InputMask.Description>For example, A1B 2C3</InputMask.Description>
      <InputMask.Control>
        <InputMask.Placeholder />
        <InputMask.Input />
      </InputMask.Control>
    </InputMask.Root>
  ),
})
