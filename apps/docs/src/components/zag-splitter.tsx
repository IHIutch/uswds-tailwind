import { normalizeProps, useMachine } from '@zag-js/react'
import * as splitter from '@zag-js/splitter'
import * as React from 'react'

export default function ZagSplitter({ overflow, children }: { overflow?: 'hidden' | 'visible', children: React.ReactNode }) {
  // Use size instead of defaultSize to prevent Zag from resetting the panel width when the height changes.
  const [size, setSize] = React.useState([100, 0])

  const service = useMachine(splitter.machine, {
    id: React.useId(),
    size,
    onResize: details => setSize(details.size),
    panels: [
      { id: 'a', collapsible: true },
      { id: 'b' },
    ],
  })

  const api = splitter.connect(service, normalizeProps)
  const rootProps = api.getRootProps()
  const panelProps = api.getPanelProps({ id: 'a' })

  return (
    <div
      {...rootProps}
      style={{ ...rootProps.style, overflow: overflow ?? 'hidden' }}
    >
      <div
        {...panelProps}
        style={{ ...panelProps.style, overflow: overflow ?? 'hidden' }}
        className="bg-gray-cool-2 shadow-[1px_0px_0px_#dfe1e2] py-4 px-8"
      >
        {children}
      </div>

      <div {...api.getResizeTriggerProps({ id: 'a:b' })} className="items-center p-2 group outline-hidden hidden tablet:flex">
        <div className="flex max-h-32 h-full rounded-full w-1.5 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-active:outline-4 group-active:outline-offset-4 group-active:outline-blue-40v group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v" />
      </div>

      <div {...api.getPanelProps({ id: 'b' })}></div>
    </div>
  )
}
