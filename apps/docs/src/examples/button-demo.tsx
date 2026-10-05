import { Button } from '@uswds-tailwind/react/button'

export default function ButtonDemo() {
  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="blue">Default</Button>
        <Button type="button" variant="blue" disabled>Default</Button>
        <Button type="button" variant="blue" size="lg">Default</Button>
        <Button type="button" variant="blue" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="red">Default</Button>
        <Button type="button" variant="red" disabled>Default</Button>
        <Button type="button" variant="red" size="lg">Default</Button>
        <Button type="button" variant="red" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="cyan">Default</Button>
        <Button type="button" variant="cyan" disabled>Default</Button>
        <Button type="button" variant="cyan" size="lg">Default</Button>
        <Button type="button" variant="cyan" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="orange">Default</Button>
        <Button type="button" variant="orange" disabled>Default</Button>
        <Button type="button" variant="orange" size="lg">Default</Button>
        <Button type="button" variant="orange" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="gray">Default</Button>
        <Button type="button" variant="gray" disabled>Default</Button>
        <Button type="button" variant="gray" size="lg">Default</Button>
        <Button type="button" variant="gray" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="outline">Default</Button>
        <Button type="button" variant="outline" disabled>Default</Button>
        <Button type="button" variant="outline" size="lg">Default</Button>
        <Button type="button" variant="outline" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4 bg-black py-4">
        <Button type="button" variant="inverse">Default</Button>
        <Button type="button" variant="inverse" disabled>Default</Button>
        <Button type="button" variant="inverse" size="lg">Default</Button>
        <Button type="button" variant="inverse" size="lg" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" variant="blue" unstyled>Default</Button>
        <Button type="button" variant="blue" unstyled disabled>Default</Button>
        <Button type="button" variant="blue" unstyled size="lg" className="text-xl">Default</Button>
        <Button type="button" variant="blue" unstyled size="lg" className="text-xl" disabled>Default</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4 bg-black py-4">
        <Button type="button" variant="inverse" unstyled>Default</Button>
        <Button type="button" variant="inverse" unstyled disabled>Default</Button>
        <Button type="button" variant="inverse" unstyled size="lg" className="text-xl">Default</Button>
        <Button type="button" variant="inverse" unstyled size="lg" className="text-xl" disabled>Default</Button>
      </div>
    </div>
  )
}
