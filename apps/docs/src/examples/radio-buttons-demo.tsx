import { Fieldset, RadioGroup } from '@uswds-tailwind/react'

export default function RadioButtonsDemo() {
  return (
    <Fieldset.Root className="max-w-xs">
      <Fieldset.Legend>Select one historical figure</Fieldset.Legend>
      <RadioGroup.Root>
        <RadioGroup.Item value="sojourner-truth">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Sojourner Truth</RadioGroup.ItemLabel>
        </RadioGroup.Item>
        <RadioGroup.Item value="frederick-douglass">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Frederick Douglass</RadioGroup.ItemLabel>
        </RadioGroup.Item>
        <RadioGroup.Item value="booker-t-washington">
          <RadioGroup.ItemInput />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>Booker T. Washington</RadioGroup.ItemLabel>
        </RadioGroup.Item>
        <RadioGroup.Item value="george-washington-carver">
          <RadioGroup.ItemInput disabled />
          <RadioGroup.ItemControl />
          <RadioGroup.ItemLabel>George Washington Carver</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Fieldset.Root>
  )
}
