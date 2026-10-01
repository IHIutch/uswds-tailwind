import { SummaryBox } from '@uswds-tailwind/react/summary-box'

export default function SummaryBoxDemo() {
  return (
    <SummaryBox.Root>
      <SummaryBox.Heading>Key information</SummaryBox.Heading>
      <SummaryBox.Content className="prose">
        <ul>
          <li>If you are under 18, you cannot apply.</li>
          <li>You must be a U.S. citizen or permanent resident.</li>
          <li>You must have a valid Social Security number.</li>
        </ul>
      </SummaryBox.Content>
    </SummaryBox.Root>
  )
}
