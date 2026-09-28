import { Checkbox, Fieldset } from '@uswds-tailwind/react'

export default function CheckboxDemo() {
  return (
    <Fieldset.Root className="max-w-xs">
      <Fieldset.Legend>Select any historical figure</Fieldset.Legend>
      <Checkbox.Group>
        <Checkbox.Root>
          <Checkbox.Input value="sojourner-truth" />
          <Checkbox.Control />
          <Checkbox.Label>Sojourner Truth</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Input value="frederick-douglass" />
          <Checkbox.Control />
          <Checkbox.Label>Frederick Douglass</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Input value="booker-t-washington" />
          <Checkbox.Control />
          <Checkbox.Label>Booker T. Washington</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root>
          <Checkbox.Input value="george-washington-carver" disabled />
          <Checkbox.Control />
          <Checkbox.Label>George Washington Carver</Checkbox.Label>
        </Checkbox.Root>
      </Checkbox.Group>
    </Fieldset.Root>
  )
}
