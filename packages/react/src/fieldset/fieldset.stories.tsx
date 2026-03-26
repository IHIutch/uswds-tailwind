import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { Input } from '../input/input'
import { Fieldset } from './fieldset'

const meta = preview.meta({
  title: 'Components/Fieldset',
  component: Fieldset.Root,
})

export const Default = meta.story({
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Personal information</Fieldset.Legend>
      <Field.Root>
        <Field.Label>First name</Field.Label>
        <Input type="text" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Last name</Field.Label>
        <Input type="text" />
      </Field.Root>
    </Fieldset.Root>
  ),
})

export const WithDescription = meta.story({
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Personal information</Fieldset.Legend>
      <Fieldset.Description>All fields are required.</Fieldset.Description>
      <Field.Root>
        <Field.Label>First name</Field.Label>
        <Input type="text" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Last name</Field.Label>
        <Input type="text" />
      </Field.Root>
    </Fieldset.Root>
  ),
})

export const WithError = meta.story({
  render: () => (
    <Fieldset.Root invalid>
      <Fieldset.Legend>Personal information</Fieldset.Legend>
      <Fieldset.ErrorMessage>Please correct the errors below.</Fieldset.ErrorMessage>
      <Field.Root invalid>
        <Field.Label>First name</Field.Label>
        <Field.ErrorMessage>First name is required.</Field.ErrorMessage>
        <Input type="text" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Last name</Field.Label>
        <Input type="text" />
      </Field.Root>
    </Fieldset.Root>
  ),
})

export const Disabled = meta.story({
  render: () => (
    <Fieldset.Root disabled>
      <Fieldset.Legend>Personal information</Fieldset.Legend>
      <Field.Root>
        <Field.Label>First name</Field.Label>
        <Input type="text" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Last name</Field.Label>
        <Input type="text" />
      </Field.Root>
    </Fieldset.Root>
  ),
})
