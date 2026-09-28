import { Field, Input } from '@uswds-tailwind/react'

export default function FieldSuccessDemo() {
  return (
    <Field.Root className="max-w-xs">
      <Field.Label>Email address</Field.Label>
      <Field.Description>We will send updates to this address.</Field.Description>
      <Input type="email" defaultValue="alex@example.gov" className="border-4 border-green-cool-40v py-1" />
    </Field.Root>
  )
}
