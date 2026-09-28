import * as React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { InPageNav } from './in-page-navigation'

afterEach(() => vi.unstubAllGlobals())

it('observes headings within the supplied scroll container', async () => {
  let observedRoot: Element | Document | null | undefined
  let observedHeading: Element | undefined

  vi.stubGlobal('IntersectionObserver', class {
    constructor(_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      observedRoot = options?.root
    }

    observe(element: Element) {
      observedHeading = element
    }

    disconnect() {}
  })

  function Demo() {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    return (
      <>
        <InPageNav.Root headings={[{ href: '#test-section', label: 'Test section', depth: 1 }]}>
          <InPageNav.Scrollspy root={scrollRef} />
          <InPageNav.List><InPageNav.Items /></InPageNav.List>
        </InPageNav.Root>
        <div id="scroll-root" ref={scrollRef}>
          <h2 id="test-section">Test section</h2>
        </div>
      </>
    )
  }

  await render(<Demo />)

  await vi.waitFor(() => {
    expect(observedRoot).toBe(document.getElementById('scroll-root'))
    expect(observedHeading).toBe(document.getElementById('test-section'))
  })
})
