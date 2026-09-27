import { ProcessList } from '@uswds-tailwind/react/process-list'

export default function ProcessListNoTextDemo() {
  return (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Start a process</ProcessList.Title>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Proceed to the second step</ProcessList.Title>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Complete the step-by-step process</ProcessList.Title>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  )
}
