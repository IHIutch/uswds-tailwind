import { CharacterCount } from '@uswds-tailwind/react'

export default function CharacterCountDemo() {
  return (
    <CharacterCount.Root maxLength={20} className="max-w-xs">
      <CharacterCount.Label>Text input</CharacterCount.Label>
      <CharacterCount.Input />
      <CharacterCount.Status />
      <CharacterCount.SrStatus />
    </CharacterCount.Root>
  )
}
