import { ProcessList } from '@uswds-tailwind/react/process-list'

export default function ProcessListHeadingsDemo() {
  return (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title><h3>Start a process</h3></ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  )
}
