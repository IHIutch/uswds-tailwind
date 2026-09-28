import { Field, Input } from '@uswds-tailwind/react'

export default function FieldErrorDemo() {
  return (
    <Field.Root invalid className="max-w-xs">
      <Field.Label>Email address</Field.Label>
      <Field.Description>Enter the address where we can reach you.</Field.Description>
      <Field.ErrorMessage>Enter a valid email address.</Field.ErrorMessage>
      <Input type="email" />
    </Field.Root>
  )
}
