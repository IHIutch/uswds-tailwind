import { Field, Fieldset, Input } from '@uswds-tailwind/react'

export default function FieldFieldsetDemo() {
  return (
    <Fieldset.Root className="max-w-xs">
      <Fieldset.Legend>Personal information</Fieldset.Legend>
      <div className="space-y-4">
        <Field.Root>
          <Field.Label>First name</Field.Label>
          <Input type="text" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Last name</Field.Label>
          <Input type="text" />
        </Field.Root>
      </div>
    </Fieldset.Root>
  )
}
