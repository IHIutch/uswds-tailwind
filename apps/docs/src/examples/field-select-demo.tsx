import { Field, Select } from '@uswds-tailwind/react'

export default function FieldSelectDemo() {
  return (
    <Field.Root className="max-w-xs">
      <Field.Label>Contact method</Field.Label>
      <Field.Description>Choose how you would like a reply.</Field.Description>
      <Select.Root>
        <Select.Field defaultValue="">
          <option value="" disabled>Select a method</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>
  )
}
