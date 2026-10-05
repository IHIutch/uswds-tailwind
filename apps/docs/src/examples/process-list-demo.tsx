import { ProcessList } from '@uswds-tailwind/react/process-list'

export default function ProcessListDemo() {
  return (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Start a process</ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Proceed to the second step</ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>Complete the step-by-step process</ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  )
}
