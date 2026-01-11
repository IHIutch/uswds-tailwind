import type { AccordionRootProps } from '@uswds-tailwind/react'
import { Accordion } from '@uswds-tailwind/react'

const data = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircraft', content: 'Sample accordion content' },
]

export default function AccordionExample(props: AccordionRootProps) {
  return (
    <Accordion.Root {...props}>
      {data.map(item => (
        <Accordion.Item key={item.title} value={item.title}>
          <h3>
            <Accordion.Trigger>
              {item.title}

              <Accordion.ItemIndicator>
                {({ isOpen }) => (<div>{isOpen ? '-' : '+'}</div>)}
              </Accordion.ItemIndicator>
            </Accordion.Trigger>
          </h3>
          <Accordion.Content>
            <div className="leading-normal max-w-prose">{item.content}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
