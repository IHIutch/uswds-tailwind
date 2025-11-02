import { Collapsible } from '@ark-ui/react/collapsible'

export default function CollapsibleCode({ className, children }: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Collapsible.Root collapsedHeight="24rem" className={`relative overflow-hidden ${className}`}>
      <Collapsible.Content>
        <div
          className="overflow-hidden not-docs-prose"
        >
          {children}
        </div>
      </Collapsible.Content>
      <Collapsible.Trigger
        className="group flex justify-center items-end h-32 pb-3 absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-cool-2/100 from-[24px] to-gray-cool-2/0 border-gray-cool-20 border-b border-x rounded-b outline-none data-[state=open]:hidden"
      >
        <div
          className="flex items-center gap-2 rounded font-bold leading-none text-white px-5 py-3 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v"
        >
          <span>Expand Code</span>
        </div>
      </Collapsible.Trigger>
    </Collapsible.Root>
  )
}
