import { Field, Input } from '@uswds-tailwind/react'

export default function FieldInputDemo() {
  return (
    <Field.Root className="max-w-xs">
      <Field.Label>Email address</Field.Label>
      <Field.Description>We will send updates to this address.</Field.Description>
      <Input type="email" />
    </Field.Root>
  )
}
