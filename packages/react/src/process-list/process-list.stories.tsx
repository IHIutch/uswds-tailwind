import preview from '../../.storybook/preview'
import { ProcessList } from './process-list'

const meta = preview.meta({
  title: 'Components/Process List',
  component: ProcessList.Root,
})

export const Default = meta.story({
  render: () => (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>
            <h3>Start a process</h3>
          </ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>
            <h3>Proceed to the second step</h3>
          </ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>
            <h3>Complete the step-by-step process</h3>
          </ProcessList.Title>
          <ProcessList.Description>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  ),
})

export const NoText = meta.story({
  render: () => (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>
            <h3>Start a process</h3>
          </ProcessList.Title>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>
            <h3>Proceed to the second step</h3>
          </ProcessList.Title>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content>
          <ProcessList.Title>
            <h3>Complete the step-by-step process</h3>
          </ProcessList.Title>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  ),
})

export const CustomSizing = meta.story({
  render: () => (
    <ProcessList.Root>
      <ProcessList.Item>
        <ProcessList.Content className="-top-2">
          <ProcessList.Title className="text-3xl">
            <h3>Start a process</h3>
          </ProcessList.Title>
          <ProcessList.Description className="text-xl">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content className="-top-2">
          <ProcessList.Title className="text-3xl">
            <h3>Proceed to the second step</h3>
          </ProcessList.Title>
          <ProcessList.Description className="text-xl">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
      <ProcessList.Item>
        <ProcessList.Content className="-top-2">
          <ProcessList.Title className="text-3xl">
            <h3>Complete the step-by-step process</h3>
          </ProcessList.Title>
          <ProcessList.Description className="text-xl">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.</p>
          </ProcessList.Description>
        </ProcessList.Content>
      </ProcessList.Item>
    </ProcessList.Root>
  ),
})
