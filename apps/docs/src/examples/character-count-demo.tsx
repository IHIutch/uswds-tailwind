import { CharacterCount, Field } from '@uswds-tailwind/react'

export default function CharacterCountDemo() {
  return (
    <Field.Root className="max-w-xs">
      <Field.Label>Text input</Field.Label>
      <CharacterCount.Root maxLength={20}>
        <CharacterCount.Input />
        <CharacterCount.Status />
        <CharacterCount.SrStatus />
      </CharacterCount.Root>
    </Field.Root>
  )
}
