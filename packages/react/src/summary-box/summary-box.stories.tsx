import preview from '../../.storybook/preview'
import { SummaryBox } from './summary-box'

const meta = preview.meta({
  title: 'Components/Summary Box',
  component: SummaryBox.Root,
})

export const Default = meta.story({
  render: () => (
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
  ),
})
