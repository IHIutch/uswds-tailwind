import type { InPageNavHeading } from './in-page-navigation'
import * as React from 'react'
import preview from '../../.storybook/preview'
import { InPageNav } from './in-page-navigation'

const meta = preview.meta({
  title: 'Components/In-Page Navigation',
  component: InPageNav.Root,
})

const headings: InPageNavHeading[] = [
  { href: '#section-1', label: 'Section 1', depth: 1 },
  { href: '#section-2', label: 'Section 2', depth: 2 },
  { href: '#section-3', label: 'Section 3', depth: 2 },
  { href: '#section-4', label: 'Section 4', depth: 3 },
  { href: '#section-5', label: 'Section 5', depth: 3 },
  { href: '#section-6', label: 'Section 6', depth: 1 },
  { href: '#section-7', label: 'Section 7', depth: 2 },
  { href: '#section-8', label: 'Section 8', depth: 3 },
  { href: '#section-9', label: 'Section 9', depth: 4 },
  { href: '#section-10', label: 'Section 10', depth: 5 },
]

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit amet enim.'

export const Default = meta.story({
  render: () => {
    const scrollRef = React.useRef<HTMLDivElement>(null)

    return (
      <div className="flex gap-8">
        <div className="w-64 shrink-0 order-last">
          <InPageNav.Root headings={headings}>
            <InPageNav.Scrollspy root={scrollRef} />
            <InPageNav.Heading>
              <h4>On this page</h4>
            </InPageNav.Heading>
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
          {headings.map(heading => (
            <div key={heading.href}>
              <h2 id={heading.href.slice(1)} className="text-xl font-bold">{heading.label}</h2>
              <p className="text-gray-60">
                {loremIpsum}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  },
})
