import { normalizeProps, useMachine } from '@zag-js/react'
import * as splitter from '@zag-js/splitter'
import * as React from 'react'

export default function ZagSplitter({ resize = true, children }: { resize: boolean, children: React.ReactNode }) {
  const service = useMachine(splitter.machine, {
    id: React.useId(),
    defaultSize: [100, 0],
    panels: [
      { id: 'a', collapsible: resize },
      { id: 'b' },
    ],
  })

  const api = splitter.connect(service, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div {...api.getPanelProps({ id: 'a' })} className="bg-gray-cool-2 shadow-[1px_0px_0px_#dfe1e2] p-4">
        {children}
      </div>

      {resize
        ? (
            <div {...api.getResizeTriggerProps({ id: 'a:b' })} className="items-center p-2 group outline-hidden hidden tablet:flex">
              <div className="flex max-h-32 h-full rounded-full w-1.5 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-active:outline-4 group-active:outline-offset-4 group-active:outline-blue-40v group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v" />
            </div>
          )
        : null}
      <div {...api.getPanelProps({ id: 'b' })}></div>
    </div>
  )
}
