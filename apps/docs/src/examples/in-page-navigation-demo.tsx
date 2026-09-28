import type { InPageNavHeading } from '@uswds-tailwind/react'
import { InPageNav } from '@uswds-tailwind/react'
import * as React from 'react'

const headings: InPageNavHeading[] = [
  { href: '#nav-overview', label: 'Overview', depth: 1 },
  { href: '#nav-eligibility', label: 'Eligibility', depth: 2 },
  { href: '#nav-application', label: 'How to apply', depth: 2 },
  { href: '#nav-next-steps', label: 'Next steps', depth: 1 },
]

export default function InPageNavigationDemo() {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col gap-8 tablet:flex-row">
      <div className="tablet:w-64 tablet:shrink-0 tablet:order-last">
        <InPageNav.Root headings={headings}>
          <InPageNav.Scrollspy root={scrollRef} />
          <InPageNav.Heading><h4>On this page</h4></InPageNav.Heading>
          <InPageNav.List>
            {({ headings }) => headings.map(heading => (
              <InPageNav.Item key={heading.href}>
                <InPageNav.Link href={heading.href} depth={heading.depth}>
                  {heading.label}
                </InPageNav.Link>
              </InPageNav.Item>
            ))}
          </InPageNav.List>
        </InPageNav.Root>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-8 max-h-96 overflow-auto border">
        <section className="min-h-40">
          <h4 id="nav-overview" className="text-xl font-bold">Overview</h4>
          <p>Start with the program overview and the services available to applicants.</p>
        </section>
        <section className="min-h-40">
          <h4 id="nav-eligibility" className="text-xl font-bold">Eligibility</h4>
          <p>Check the eligibility requirements before preparing an application.</p>
        </section>
        <section className="min-h-40">
          <h4 id="nav-application" className="text-xl font-bold">How to apply</h4>
          <p>Gather the required documents and submit your application.</p>
        </section>
        <section className="min-h-40">
          <h4 id="nav-next-steps" className="text-xl font-bold">Next steps</h4>
          <p>Review what happens after you submit your application.</p>
        </section>
      </div>
    </div>
  )
}
