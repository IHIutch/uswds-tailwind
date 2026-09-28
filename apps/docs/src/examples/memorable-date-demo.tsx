import { Fieldset, MemorableDate } from '@uswds-tailwind/react'

export default function MemorableDateDemo() {
  return (
    <MemorableDate.Root>
      <MemorableDate.Legend>Date of birth</MemorableDate.Legend>
      <Fieldset.Description>For example: January 19 2000</Fieldset.Description>
      <MemorableDate.Control>
        <MemorableDate.Month />
        <MemorableDate.Day />
        <MemorableDate.Year />
      </MemorableDate.Control>
    </MemorableDate.Root>
  )
}
