import { Collapsible, useCollapsible } from '@ark-ui/react/collapsible'
import * as React from 'react'

export default function CollapsibleCode({ className, children }: {
  className?: string
  children?: React.ReactNode
}) {
  const openSize = 384
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const collapsible = useCollapsible({
    collapsedHeight: `${openSize}px`,
    defaultOpen: true,
  })

  React.useEffect(() => {
    if ((wrapperRef.current?.offsetHeight || 0) > openSize) {
      collapsible.setOpen(false)
    }
  }, [collapsible.isUnmounted])

  return (
    <Collapsible.RootProvider value={collapsible} className={`relative overflow-hidden ${className}`}>
      <Collapsible.Content style={!wrapperRef.current ? { maxHeight: `${openSize}px`, overflow: 'auto' } : undefined}>
        <div
          className="overflow-hidden not-docs-prose"
          ref={wrapperRef}
        >
          {children}
        </div>
      </Collapsible.Content>
      <button
        type="button"
        onClick={() => collapsible.setOpen(true)}
        className="group flex justify-center items-end h-32 pb-3 absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-cool-2/100 from-[24px] to-gray-cool-2/0 border-gray-cool-20 border-b border-x rounded-b outline-none"
        hidden={collapsible.open}
      >
        <div
          className="flex items-center gap-2 rounded-sm font-bold leading-none cursor-pointer text-white px-5 py-3 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v"
        >
          <span>Expand Code</span>
        </div>
      </button>
    </Collapsible.RootProvider>
  )
}
