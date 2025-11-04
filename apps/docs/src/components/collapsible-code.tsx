import { normalizeProps, useMachine } from '@zag-js/react'
import * as toggle from '@zag-js/toggle'
import * as React from 'react'

export default function CollapsibleCode({ className, children }: {
  className?: string
  children?: React.ReactNode
}) {
  const [isMounted, setIsMounted] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const service = useMachine(toggle.machine, { defaultPressed: false })
  const api = toggle.connect(service, normalizeProps)

  React.useEffect(() => {
    if (wrapperRef.current) {
      setIsMounted(true)
      if (wrapperRef.current.offsetHeight < 384) {
        api.setPressed(true)
      }
    }
  }, [wrapperRef.current])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={!wrapperRef.current ? 'max-h-96 overflow-auto' : api.pressed ? 'h-auto' : 'h-96'}>
        <div
          className="not-docs-prose"
          ref={wrapperRef}
        >
          {children}
        </div>
      </div>
      {isMounted
        ? (
            <button
              type="button"
              className="group flex justify-center items-end h-32 pb-3 absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-cool-2/100 from-[24px] to-gray-cool-2/0 border-gray-cool-20 border-b border-x rounded-b outline-hidden data-[pressed]:hidden"
              {...api.getRootProps()}
            >
              <div
                className="flex items-center gap-2 rounded-sm font-bold leading-none cursor-pointer text-white px-5 py-3 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v"
              >
                <span>Expand Code</span>
              </div>
            </button>
          )
        : null}
    </div>
  )
}
