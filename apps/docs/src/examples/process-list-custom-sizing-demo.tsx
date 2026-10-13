import { ProcessList } from '@uswds-tailwind/react/process-list'

export default function ProcessListCustomSizingDemo() {
  return (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content className="-top-2">
          <ProcessList.Title className="text-3xl">Start a process</ProcessList.Title>
          <ProcessList.Description className="text-xl">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content className="-top-2">
          <ProcessList.Title className="text-3xl">Proceed to the second step</ProcessList.Title>
          <ProcessList.Description className="text-xl">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content className="-top-2">
          <ProcessList.Title className="text-3xl">Complete the step-by-step process</ProcessList.Title>
          <ProcessList.Description className="text-xl">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  )
}
