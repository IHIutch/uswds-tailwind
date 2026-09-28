import { Field, Textarea } from '@uswds-tailwind/react'

export default function FieldTextareaDemo() {
  return (
    <Field.Root className="max-w-xs">
      <Field.Label>Message</Field.Label>
      <Field.Description>Include any details that will help us respond.</Field.Description>
      <Textarea />
    </Field.Root>
  )
}
